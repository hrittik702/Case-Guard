import { openDatabase, saveLocal, loadLocal, blobMemoryCache } from './db.js';
import { computeSHA256, hashFileSHA256 } from './cryptoService.js';

const STORAGE_KEY = 'caseguard_documents';

export const DocumentRepository = {
  async getAllDocuments() {
    const localDocs = loadLocal(STORAGE_KEY, []);
    try {
      const db = await openDatabase();
      return new Promise((resolve) => {
        const tx = db.transaction('documents', 'readonly');
        const store = tx.objectStore('documents');
        const request = store.getAll();

        request.onsuccess = () => {
          let docs = request.result || [];
          if (docs.length === 0 && localDocs.length > 0) {
            this.restoreLocalBackup(localDocs).catch(console.warn);
            docs = localDocs;
          } else if (docs.length > 0) {
            saveLocal(STORAGE_KEY, docs);
          }
          docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          resolve(docs);
        };
        request.onerror = () => {
          console.warn('Error reading documents from IndexedDB, using local storage backup:', request.error);
          resolve(localDocs);
        };
      });
    } catch (err) {
      console.warn('IndexedDB unavailable, falling back to local storage for documents:', err);
      return localDocs;
    }
  },

  async restoreLocalBackup(docs) {
    try {
      const db = await openDatabase();
      const tx = db.transaction('documents', 'readwrite');
      const store = tx.objectStore('documents');
      for (const d of docs) {
        store.put(d);
      }
    } catch (e) {
      console.warn('Failed to restore documents to IndexedDB:', e);
    }
  },

  async getDocumentsByCase(caseId) {
    const all = await this.getAllDocuments();
    return all.filter(d => d.caseId === caseId);
  },

  async getDocumentById(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readonly');
      const store = tx.objectStore('documents');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  },

  async findDuplicateDocument(caseId, hash, filename = '') {
    const docs = await this.getDocumentsByCase(caseId);
    
    // 1. Exact hash duplicate
    if (hash) {
      const exactMatch = docs.find(d => (d.storedHash === hash) || (d.hash === hash));
      if (exactMatch) {
        return {
          isDuplicate: true,
          type: 'EXACT_HASH',
          existingDoc: exactMatch,
          message: `A document with this identical SHA-256 fingerprint already exists in this case: "${exactMatch.name}".`
        };
      }
    }
    
    // 2. Same filename duplicate
    if (filename) {
      const cleanTarget = filename.trim().toLowerCase();
      const nameMatch = docs.find(d => d.name.trim().toLowerCase() === cleanTarget);
      if (nameMatch) {
        return {
          isDuplicate: true,
          type: 'SAME_NAME',
          existingDoc: nameMatch,
          message: `A document named "${nameMatch.name}" already exists in this case.`
        };
      }
    }

    return { isDuplicate: false };
  },

  async createDocumentWithFile(metadata, fileBlob, user, onProgress) {
    if (!fileBlob || !(fileBlob instanceof Blob)) {
      throw new Error('Valid file binary payload is required.');
    }

    const docId = `DOC-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const versionId = `VER-${Date.now().toString(36).toUpperCase()}-1`;
    const now = new Date().toISOString();

    // 1. Calculate genuine SHA-256 from actual file bytes with streaming & fallback
    const hash = await hashFileSHA256(fileBlob, onProgress);

    const filename = metadata.name || fileBlob.name || 'Untitled Document';
    const lowerName = filename.toLowerCase();

    // Normalize MIME type with extension fallback (especially for PDF and modern office)
    let mimeType = fileBlob.type || '';
    if (!mimeType || mimeType === 'application/octet-stream') {
      if (lowerName.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (lowerName.endsWith('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (lowerName.endsWith('.xlsx')) mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      else if (lowerName.endsWith('.pptx')) mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      else if (lowerName.endsWith('.txt')) mimeType = 'text/plain';
      else if (lowerName.endsWith('.csv')) mimeType = 'text/csv';
      else if (lowerName.endsWith('.json')) mimeType = 'application/json';
      else if (lowerName.endsWith('.png')) mimeType = 'image/png';
      else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else mimeType = 'application/octet-stream';
    }

    const versionRecord = {
      id: versionId,
      documentId: docId,
      versionNumber: 1,
      versionLabel: 'V1',
      fileBlob,
      size: fileBlob.size,
      mimeType,
      hash,
      createdAt: now,
      createdBy: user?.name || 'Authorized Officer',
      changeNote: 'Initial upload and cryptographic anchoring.'
    };

    const isImage = mimeType.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp|tiff)$/i.test(lowerName);
    const isPdf = mimeType === 'application/pdf' || lowerName.endsWith('.pdf');
    const isDocx = mimeType.includes('wordprocessingml') || lowerName.endsWith('.docx');
    const ocrApplicable = isImage || isPdf || isDocx;

    const docRecord = {
      id: docId,
      caseId: metadata.caseId,
      name: filename,
      mimeType,
      size: fileBlob.size,
      classification: metadata.classification || 'Confidential',
      category: metadata.category || 'Evidence Record',
      tags: metadata.tags || [],
      currentVersion: 'V1',
      currentVersionId: versionId,
      storedHash: hash,
      hash,
      originalBlob: fileBlob, // kept for tamper-restore demonstration
      ocr: {
        status: ocrApplicable ? 'AVAILABLE' : 'NOT_APPLICABLE',
        text: '',
        language: 'eng',
        processedAt: null,
        pageCount: 0,
        error: null
      },
      createdAt: now,
      updatedAt: now,
      createdBy: user?.name || 'Authorized Officer',
      isTampered: false
    };

    // Store in IndexedDB atomically
    try {
      const db = await openDatabase();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(['documents', 'versions'], 'readwrite');
        const docStore = tx.objectStore('documents');
        const verStore = tx.objectStore('versions');

        docStore.put(docRecord);
        verStore.put(versionRecord);

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed.'));
      });
    } catch (err) {
      console.warn('IndexedDB write failure during document creation:', err);
      throw new Error(`Unable to save document to storage: ${err.message || 'IndexedDB error'}`);
    }

    // Cache blob in memory for instant retrieval without waiting for DB
    blobMemoryCache.set(versionId, fileBlob);

    // Immediately persist metadata to localStorage for zero data loss on immediate refresh
    const localDocs = loadLocal(STORAGE_KEY, []);
    saveLocal(STORAGE_KEY, [docRecord, ...localDocs.filter(d => d.id !== docId)]);

    return docRecord;
  },

  async updateDocumentOcr(documentId, ocrData) {
    const localDocs = loadLocal(STORAGE_KEY, []);
    const updatedLocal = localDocs.map(d => {
      if (d.id === documentId) {
        return {
          ...d,
          ocr: {
            ...(d.ocr || {}),
            ...ocrData,
            processedAt: ocrData.processedAt || new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };
      }
      return d;
    });
    saveLocal(STORAGE_KEY, updatedLocal);

    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('documents', 'readwrite');
        const store = tx.objectStore('documents');
        const getReq = store.get(documentId);

        getReq.onsuccess = () => {
          const doc = getReq.result || localDocs.find(d => d.id === documentId);
          if (!doc) {
            return resolve(null);
          }
          const updated = {
            ...doc,
            ocr: {
              ...(doc.ocr || {}),
              ...ocrData,
              processedAt: ocrData.processedAt || new Date().toISOString()
            },
            updatedAt: new Date().toISOString()
          };
          store.put(updated);
          tx.oncomplete = () => resolve(updated);
        };
        getReq.onerror = () => reject(getReq.error);
      });
    } catch (err) {
      return updatedLocal.find(d => d.id === documentId) || null;
    }
  },

  async addVersion(documentId, fileBlob, user, changeNote, onProgress) {
    if (!fileBlob || !(fileBlob instanceof Blob)) {
      throw new Error('Valid file binary payload is required.');
    }

    const doc = await this.getDocumentById(documentId);
    if (!doc) throw new Error('Document not found.');

    const versions = await this.getDocumentVersions(documentId);
    const nextVerNumber = versions.length + 1;
    const versionLabel = `V${nextVerNumber}`;
    const versionId = `VER-${Date.now().toString(36).toUpperCase()}-${nextVerNumber}`;
    const now = new Date().toISOString();

    const hash = await hashFileSHA256(fileBlob, onProgress);

    const filename = fileBlob.name || doc.name;
    const lowerName = filename.toLowerCase();

    let mimeType = fileBlob.type || doc.mimeType;
    if (!mimeType || mimeType === 'application/octet-stream') {
      if (lowerName.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (lowerName.endsWith('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (lowerName.endsWith('.xlsx')) mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      else if (lowerName.endsWith('.pptx')) mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      else mimeType = doc.mimeType || 'application/octet-stream';
    }

    const versionRecord = {
      id: versionId,
      documentId,
      versionNumber: nextVerNumber,
      versionLabel,
      fileBlob,
      size: fileBlob.size,
      mimeType,
      hash,
      createdAt: now,
      createdBy: user?.name || 'Authorized Officer',
      changeNote: changeNote || `Revision ${versionLabel} uploaded.`
    };

    const isImage = mimeType.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp|tiff)$/i.test(lowerName);
    const isPdf = mimeType === 'application/pdf' || lowerName.endsWith('.pdf');
    const isDocx = mimeType.includes('wordprocessingml') || lowerName.endsWith('.docx');
    const ocrApplicable = isImage || isPdf || isDocx;

    const updatedDoc = {
      ...doc,
      currentVersion: versionLabel,
      currentVersionId: versionId,
      size: fileBlob.size,
      mimeType,
      storedHash: hash,
      hash,
      ocr: {
        status: ocrApplicable ? 'AVAILABLE' : 'NOT_APPLICABLE',
        text: '',
        language: 'eng',
        processedAt: null,
        pageCount: 0,
        error: null
      },
      updatedAt: now,
      isTampered: false
    };

    // Store in IndexedDB atomically
    try {
      const db = await openDatabase();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(['documents', 'versions'], 'readwrite');
        tx.objectStore('versions').put(versionRecord);
        tx.objectStore('documents').put(updatedDoc);

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error('Failed to record version.'));
      });
    } catch (err) {
      console.warn('IndexedDB write failure during addVersion:', err);
      throw new Error(`Unable to record new version: ${err.message || 'IndexedDB error'}`);
    }

    // Cache blob in memory
    blobMemoryCache.set(versionId, fileBlob);

    // Update in localStorage
    const localDocs = loadLocal(STORAGE_KEY, []);
    saveLocal(STORAGE_KEY, localDocs.map(d => d.id === documentId ? updatedDoc : d));

    return updatedDoc;
  },

  async getDocumentVersions(documentId) {
    try {
      const db = await openDatabase();
      return new Promise((resolve) => {
        const tx = db.transaction('versions', 'readonly');
        const store = tx.objectStore('versions');
        const request = store.getAll();

        request.onsuccess = () => {
          const all = request.result || [];
          const filtered = all.filter(v => v.documentId === documentId);
          filtered.sort((a, b) => b.versionNumber - a.versionNumber);
          resolve(filtered);
        };
        request.onerror = () => resolve([]);
      });
    } catch (err) {
      return [];
    }
  },

  async getVersionBlob(versionId) {
    if (!versionId) return null;
    if (blobMemoryCache.has(versionId)) {
      return blobMemoryCache.get(versionId);
    }
    try {
      const db = await openDatabase();
      return new Promise((resolve) => {
        const tx = db.transaction('versions', 'readonly');
        const store = tx.objectStore('versions');
        const request = store.get(versionId);

        request.onsuccess = () => {
          if (request.result && request.result.fileBlob) {
            blobMemoryCache.set(versionId, request.result.fileBlob);
            resolve(request.result.fileBlob);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (err) {
      console.warn('Failed to retrieve version blob:', err);
      return null;
    }
  },

  async verifyDocumentIntegrity(documentId) {
    const doc = await this.getDocumentById(documentId);
    if (!doc) throw new Error('Document not found.');

    const blob = await this.getVersionBlob(doc.currentVersionId);
    if (!blob) throw new Error('Version file blob not found in storage.');

    // Calculate live hash from the actual stored bytes
    const calculatedHash = await computeSHA256(blob);
    const valid = (calculatedHash === doc.storedHash) && !doc.isTampered;

    return {
      valid,
      documentName: doc.name,
      currentVersion: doc.currentVersion,
      storedHash: doc.storedHash,
      calculatedHash,
      isTampered: doc.isTampered
    };
  },

  async simulateDocumentTamper(documentId) {
    const db = await openDatabase();
    const doc = await this.getDocumentById(documentId);
    if (!doc) throw new Error('Document not found.');

    const currentBlob = await this.getVersionBlob(doc.currentVersionId);
    if (!currentBlob) throw new Error('Version blob not found.');

    // Deliberately corrupt 1 byte of the blob for demonstration
    const buffer = await currentBlob.arrayBuffer();
    const corruptedArray = new Uint8Array(buffer.byteLength + 1);
    corruptedArray.set(new Uint8Array(buffer));
    corruptedArray[corruptedArray.length - 1] = 0xAA; // append corrupted byte

    const corruptedBlob = new Blob([corruptedArray], { type: currentBlob.type });
    const corruptedHash = await computeSHA256(corruptedBlob);

    return new Promise((resolve, reject) => {
      const tx = db.transaction(['documents', 'versions'], 'readwrite');
      
      // Update version with corrupted blob
      const verStore = tx.objectStore('versions');
      verStore.get(doc.currentVersionId).onsuccess = (e) => {
        const ver = e.target.result;
        ver.fileBlob = corruptedBlob;
        verStore.put(ver);
      };

      // Mark document as tampered
      const docStore = tx.objectStore('documents');
      const updatedDoc = {
        ...doc,
        isTampered: true,
        tamperedHash: corruptedHash
      };
      docStore.put(updatedDoc);

      tx.oncomplete = () => resolve(updatedDoc);
      tx.onerror = () => reject(tx.error);
    });
  },

  async restoreDocument(documentId) {
    const db = await openDatabase();
    const doc = await this.getDocumentById(documentId);
    if (!doc || !doc.originalBlob) throw new Error('Cannot restore document.');

    return new Promise((resolve, reject) => {
      const tx = db.transaction(['documents', 'versions'], 'readwrite');

      const verStore = tx.objectStore('versions');
      verStore.get(doc.currentVersionId).onsuccess = (e) => {
        const ver = e.target.result;
        ver.fileBlob = doc.originalBlob;
        verStore.put(ver);
      };

      const docStore = tx.objectStore('documents');
      const updatedDoc = {
        ...doc,
        isTampered: false,
        tamperedHash: null
      };
      docStore.put(updatedDoc);

      tx.oncomplete = () => resolve(updatedDoc);
      tx.onerror = () => reject(tx.error);
    });
  },

  async deleteDocument(id) {
    const localDocs = loadLocal(STORAGE_KEY, []);
    saveLocal(STORAGE_KEY, localDocs.filter(d => d.id !== id));

    try {
      const db = await openDatabase();
      const versions = await this.getDocumentVersions(id);

      return new Promise((resolve) => {
        const tx = db.transaction(['documents', 'versions'], 'readwrite');
        const docStore = tx.objectStore('documents');
        const verStore = tx.objectStore('versions');

        docStore.delete(id);
        versions.forEach(v => {
          blobMemoryCache.delete(v.id);
          verStore.delete(v.id);
        });

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(true);
      });
    } catch (err) {
      return true;
    }
  }
};
