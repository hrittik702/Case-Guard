import test from 'node:test';
import assert from 'node:assert/strict';
import { getFileInfo, VIEWER_TYPES, FILE_CATEGORIES } from '../src/utils/fileTypes.js';
import { saveLocal, loadLocal } from '../src/services/db.js';

test('File Types Registry: Correctly maps MIME and extensions to viewer types', () => {
  // 1. PDF
  const pdfInfo = getFileInfo('application/pdf', 'warrant.pdf');
  assert.equal(pdfInfo.viewerType, VIEWER_TYPES.PDF);
  assert.equal(pdfInfo.category, FILE_CATEGORIES.DOCUMENT);
  assert.equal(pdfInfo.ocrEligible, true);

  // 2. DOCX
  const docxInfo = getFileInfo('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'affidavit.docx');
  assert.equal(docxInfo.viewerType, VIEWER_TYPES.DOCX);
  assert.equal(docxInfo.category, FILE_CATEGORIES.DOCUMENT);
  assert.equal(docxInfo.ocrEligible, true);

  // 3. Spreadsheet (XLSX, CSV)
  const xlsxInfo = getFileInfo('', 'financial_ledger.xlsx');
  assert.equal(xlsxInfo.viewerType, VIEWER_TYPES.SPREADSHEET);
  assert.equal(xlsxInfo.category, FILE_CATEGORIES.SPREADSHEET);

  const csvInfo = getFileInfo('text/csv', 'call_records.csv');
  assert.equal(csvInfo.viewerType, VIEWER_TYPES.SPREADSHEET);

  // 4. PPTX
  const pptxInfo = getFileInfo('', 'briefing.pptx');
  assert.equal(pptxInfo.viewerType, VIEWER_TYPES.PPTX);
  assert.equal(pptxInfo.category, FILE_CATEGORIES.PRESENTATION);

  // 5. Images (PNG, JPG)
  const pngInfo = getFileInfo('image/png', 'crime_scene.png');
  assert.equal(pngInfo.viewerType, VIEWER_TYPES.IMAGE);
  assert.equal(pngInfo.ocrEligible, true);

  // 6. Video (MP4)
  const mp4Info = getFileInfo('video/mp4', 'cctv_footage.mp4');
  assert.equal(mp4Info.viewerType, VIEWER_TYPES.VIDEO);

  // 7. Audio (MP3, WAV)
  const audioInfo = getFileInfo('audio/mpeg', 'wiretap_intercept.mp3');
  assert.equal(audioInfo.viewerType, VIEWER_TYPES.AUDIO);

  // 8. Text (TXT, JSON, MD)
  const textInfo = getFileInfo('text/plain', 'confession.txt');
  assert.equal(textInfo.viewerType, VIEWER_TYPES.TEXT);
  assert.equal(textInfo.ocrEligible, true);

  const jsonInfo = getFileInfo('application/json', 'metadata.json');
  assert.equal(jsonInfo.viewerType, VIEWER_TYPES.TEXT);

  // 9. Archives (ZIP)
  const zipInfo = getFileInfo('application/zip', 'case_evidence.zip');
  assert.equal(zipInfo.viewerType, VIEWER_TYPES.ARCHIVE);

  // 10. Legacy Unsupported (DOC, PPT)
  const docInfo = getFileInfo('', 'legacy_order.doc');
  assert.equal(docInfo.viewerType, VIEWER_TYPES.UNSUPPORTED);
  assert.equal(docInfo.isLegacy, true);

  const pptInfo = getFileInfo('', 'presentation_old.ppt');
  assert.equal(pptInfo.viewerType, VIEWER_TYPES.UNSUPPORTED);
  assert.equal(pptInfo.isLegacy, true);

  // 11. Generic Binary
  const binInfo = getFileInfo('application/octet-stream', 'memory_dump.bin');
  assert.equal(binInfo.viewerType, VIEWER_TYPES.UNSUPPORTED);
  assert.equal(binInfo.isLegacy, false);
});

test('Dual-Persistence Architecture: saveLocal and loadLocal preserve state across page reloads', () => {
  // Mock localStorage for node environment if not in browser
  const mockStorage = new Map();
  globalThis.localStorage = {
    getItem: (key) => mockStorage.get(key) || null,
    setItem: (key, val) => mockStorage.set(key, String(val)),
    removeItem: (key) => mockStorage.delete(key),
    clear: () => mockStorage.clear()
  };

  const sampleCases = [
    { id: 'CASE-01', caseNumber: 'CR/2026/001', title: 'Cyber Fraud Investigation' }
  ];

  saveLocal('test_caseguard_cases', sampleCases);
  const loaded = loadLocal('test_caseguard_cases', []);

  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].id, 'CASE-01');
  assert.equal(loaded[0].caseNumber, 'CR/2026/001');

  // Non-existent key falls back to default value
  const fallback = loadLocal('non_existent_key', ['default_item']);
  assert.deepEqual(fallback, ['default_item']);
});

test('Image Dynamic 90% Sizing: calculateFitDimensions correctly handles portrait, landscape, and clamping', async () => {
  const { calculateFitDimensions } = await import('../src/utils/imageFit.js');

  // 1. Standard Portrait Image: fits 90% container height, preserves aspect ratio
  // Container: 1000 x 800 (90% = 900 x 720)
  // Image: 600w x 1200h (aspect ratio = 0.5)
  const portraitFit = calculateFitDimensions(600, 1200, 1000, 800);
  assert.ok(portraitFit);
  assert.equal(portraitFit.isPortrait, true);
  assert.equal(portraitFit.height, 720); // 800 * 0.9
  assert.equal(portraitFit.width, 360);  // 720 * 0.5
  assert.ok(portraitFit.width <= 900);
  assert.ok(portraitFit.height <= 720);

  // 2. Standard Landscape Image: fits 90% container width, preserves aspect ratio
  // Container: 1000 x 800 (90% = 900 x 720)
  // Image: 1600w x 900h (aspect ratio = 16/9)
  const landscapeFit = calculateFitDimensions(1600, 900, 1000, 800);
  assert.ok(landscapeFit);
  assert.equal(landscapeFit.isPortrait, false);
  assert.equal(landscapeFit.width, 900); // 1000 * 0.9
  assert.equal(landscapeFit.height, Math.round(900 / (1600 / 900))); // 506
  assert.ok(landscapeFit.width <= 900);
  assert.ok(landscapeFit.height <= 720);

  // 3. Ultra-wide Landscape constrained by container height (never cropped)
  // Container: 1000 x 400 (90% = 900 x 360)
  // Image: 1200w x 800h (aspect ratio = 1.5)
  // Initial width 900 would yield height 600 (> 360), so clamps to height 360
  const wideClampFit = calculateFitDimensions(1200, 800, 1000, 400);
  assert.ok(wideClampFit);
  assert.equal(wideClampFit.height, 360); // clamped to 400 * 0.9
  assert.equal(wideClampFit.width, 540);  // 360 * 1.5
  assert.ok(wideClampFit.width <= 900);
  assert.ok(wideClampFit.height <= 360);

  // 4. Ultra-tall Portrait constrained by container width (never cropped)
  // Container: 400 x 1000 (90% = 360 x 900)
  // Image: 800w x 1000h (aspect ratio = 0.8)
  // Initial height 900 would yield width 720 (> 360), so clamps to width 360
  const tallClampFit = calculateFitDimensions(800, 1000, 400, 1000);
  assert.ok(tallClampFit);
  assert.equal(tallClampFit.width, 360); // clamped to 400 * 0.9
  assert.equal(tallClampFit.height, 450); // 360 / 0.8
  assert.ok(tallClampFit.width <= 360);
  assert.ok(tallClampFit.height <= 900);

  // 5. Returns null on invalid dimensions
  assert.equal(calculateFitDimensions(0, 100, 1000, 800), null);
  assert.equal(calculateFitDimensions(100, 100, 0, 800), null);
});
