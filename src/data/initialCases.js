export const INITIAL_CASES = [
  {
    id: 'CASE-INV-2026-0142',
    caseNumber: 'INV-2026-0142',
    title: 'Financial Fraud & Mule Banking Syndicate Investigation',
    type: 'Financial Cybercrime',
    status: 'Active Investigation',
    priority: 'High',
    createdDate: '24 Sep 2026',
    lastActivity: '26 Sep 2026, 09:42',
    assignedOfficers: [
      'Inspector Vikram Rathore (IO)',
      'Dr. Ananya Sharma (CFSL)',
      'Advocate R. K. Shrivastava (PP)'
    ],
    policeStation: 'Special Cell (Economic Offences Wing), New Delhi',
    courtName: 'Court of Chief Metropolitan Magistrate, Rouse Avenue Courts, New Delhi',
    acts: [
      'Section 66C & 66D IT Act 2000 (Identity Theft & Impersonation)',
      'Section 318(4) Bharatiya Nyaya Sanhita (BNS) [Cheating & Dishonestly Inducing Delivery]',
      'Section 336(3) Bharatiya Nyaya Sanhita (BNS) [Forgery for Cheating]',
      'Section 61(2) Bharatiya Nyaya Sanhita (BNS) [Criminal Conspiracy]'
    ],
    summary: 'Organized financial cyber-syndicate involved in automated SIM swap attacks, compromised banking API credentials, and unauthorized RTGS outflows totaling INR 14.8 Crores across 118 mule accounts.',
    assignedUsers: [
      { name: 'Inspector Vikram Rathore', role: 'Investigation Officer', access: 'Read / Write' },
      { name: 'Dr. Ananya Sharma', role: 'Forensic Analyst', access: 'Read / Write' },
      { name: 'Advocate R. K. Shrivastava', role: 'Legal Officer', access: 'Read Only' }
    ],
    documents: [
      {
        id: 'DOC-0142-EVID',
        name: 'Case_Evidence_Report.pdf',
        type: 'Investigation Report',
        caseId: 'INV-2026-0142',
        currentVersion: 'V3',
        uploadedBy: 'Officer Sharma',
        uploadDate: '26 Sep 2026, 09:42',
        fileSize: '2.4 MB',
        classification: 'Confidential',
        integrityStatus: 'VERIFIED',
        accessLevel: 'Restricted',
        storedHash: 'a8f9104b2c1e8934fa76210d4589e1b23450987612345678abcdef0172bd9411',
        sha256: 'a8f9104b2c1e8934fa76210d4589e1b23450987612345678abcdef0172bd9411',
        blockHeight: 3,
        ocrStatus: 'Completed',
        ocrKeywords: ['RTGS transfer', 'SIM swap', 'Indus Horizon Bank', 'API token', 'mule network'],
        versions: [
          {
            version: 'V3',
            isCurrent: true,
            modifiedBy: 'Officer Sharma',
            date: '26 Sep 2026, 09:42',
            fileSize: '2.4 MB',
            hash: 'a8f9104b2c1e8934fa76210d4589e1b23450987612345678abcdef0172bd9411',
            changeDescription: 'Appended verified IPDR telemetry logs and bank transaction trace sheets.'
          },
          {
            version: 'V2',
            isCurrent: false,
            modifiedBy: 'Officer Khan',
            date: '25 Sep 2026, 16:20',
            fileSize: '2.1 MB',
            hash: 'b7123984caef01928374650192837465abcde987654321012345678901234567',
            changeDescription: 'Integrated CFSL digital forensic examination findings for Exhibit E-1.'
          },
          {
            version: 'V1',
            isCurrent: false,
            modifiedBy: 'Officer Sharma',
            date: '24 Sep 2026, 11:12',
            fileSize: '1.8 MB',
            hash: 'c8912345defa01293847561029384756fedcba09876543210987654321098765',
            changeDescription: 'Initial investigative field seizure report and evidence inventory.'
          }
        ],
        content: `CENTRAL INVESTIGATION SUMMARY & EVIDENCE REPORT
Case Reference: INV-2026-0142 | Priority: High | Date: 26-Sep-2026
Subject: Forensic Triangulation of Unauthorized RTGS Outflows

1. EXECUTIVE OVERVIEW:
Between 09.03.2024 and 11.03.2024, unauthorized wire transfers totaling INR 3,84,50,000/- were executed from corporate liquidity pools using compromised API gateway credentials.

2. FORENSIC CORROBORATION:
- IP exit nodes mapped to cloud infrastructure in Frankfurt and Mumbai.
- 14 mule beneficiary accounts identified across Surat and Kolkata branches.
- Physical Exhibit E-1 (Samsung S23 Ultra) recovered from suspect Vikramaditya Rawat contains encrypted chat logs referencing @GhostVault_Escrow.

3. STATUTORY COMPLIANCE:
All digital evidence exhibits have been imaged using write-blocked hardware and verified under Section 63 Bharatiya Sakshya Adhiniyam, 2023.`
      },
      {
        id: 'DOC-0142-FIR',
        name: 'First_Information_Report_0142.pdf',
        type: 'FIR',
        caseId: 'INV-2026-0142',
        currentVersion: 'V1',
        uploadedBy: 'Inspector Vikram Rathore',
        uploadDate: '24 Sep 2026, 10:15',
        fileSize: '1.2 MB',
        classification: 'Confidential',
        integrityStatus: 'VERIFIED',
        accessLevel: 'Internal',
        storedHash: '9f83a48e718b2a3b098234857a26f8d3885c301c20e176b6f00122e20b3294aa',
        sha256: '9f83a48e718b2a3b098234857a26f8d3885c301c20e176b6f00122e20b3294aa',
        blockHeight: 1,
        ocrStatus: 'Completed',
        ocrKeywords: ['FIR', 'BNSS 173', 'Complainant', 'Unauthorized wire'],
        versions: [
          {
            version: 'V1',
            isCurrent: true,
            modifiedBy: 'Inspector Vikram Rathore',
            date: '24 Sep 2026, 10:15',
            fileSize: '1.2 MB',
            hash: '9f83a48e718b2a3b098234857a26f8d3885c301c20e176b6f00122e20b3294aa',
            changeDescription: 'Original FIR registration under Section 173 BNSS.'
          }
        ],
        content: `FIRST INFORMATION REPORT (Under Section 173 BNSS 2023)
Police Station: Special Cell (Cyber Crime) | Case: INV-2026-0142
Complainant: Smt. Radhika Swaminathan, CFO, Apex Zenith Infrastructure Ltd.
Aadhaar: [REDACTED: ****-****-9012] | Contact: [REDACTED: 98110*****]

Allegation:
Automated unauthorized debits totaling INR 3.84 Crores executed via spoofed corporate banking API tokens. Suspects Vikramaditya Rawat and Tariq Anwar identified.`
      },
      {
        id: 'DOC-0142-FSL',
        name: 'CFSL_Cyber_Forensics_Report.pdf',
        type: 'Forensic Report',
        caseId: 'INV-2026-0142',
        currentVersion: 'V1',
        uploadedBy: 'Dr. Ananya Sharma',
        uploadDate: '25 Sep 2026, 14:30',
        fileSize: '4.8 MB',
        classification: 'Top Secret',
        integrityStatus: 'VERIFIED',
        accessLevel: 'Special Clearance',
        storedHash: '7a8f3b2190cde4581290384756abcefd01289456723019847562019384756201',
        sha256: '7a8f3b2190cde4581290384756abcefd01289456723019847562019384756201',
        blockHeight: 2,
        ocrStatus: 'Completed',
        ocrKeywords: ['EnCase', 'E01 bitstream', 'Tableau T8u', 'SQLite', 'Tron wallet'],
        versions: [
          {
            version: 'V1',
            isCurrent: true,
            modifiedBy: 'Dr. Ananya Sharma',
            date: '25 Sep 2026, 14:30',
            fileSize: '4.8 MB',
            hash: '7a8f3b2190cde4581290384756abcefd01289456723019847562019384756201',
            changeDescription: 'Initial forensic extraction and bit-stream verification report.'
          }
        ],
        content: `CENTRAL FORENSIC SCIENCE LABORATORY (CFSL)
REPORT NO: CFSL/CYB/2026/0882 | DATED: 25-SEP-2026

Physical write-blocking accomplished using Tableau T8u Bridge.
Forensic Image Fingerprint: 7a8f3b21••••••••••••••••384756201.
Recovered deleted SQLite database records from Telegram syndicate handle @GhostVault_Escrow.`
      },
      {
        id: 'DOC-0142-RESTRICTED',
        name: 'Confidential_Informant_Registry.pdf',
        type: 'Evidence Record',
        caseId: 'INV-2026-0142',
        currentVersion: 'V1',
        uploadedBy: 'Inspector Vikram Rathore',
        uploadDate: '24 Sep 2026, 18:00',
        fileSize: '450 KB',
        classification: 'Top Secret',
        integrityStatus: 'RESTRICTED',
        accessLevel: 'Admin / IO Only',
        storedHash: '3d91827465abcde0192837465102938475610293847561029384756102938475',
        sha256: '3d91827465abcde0192837465102938475610293847561029384756102938475',
        blockHeight: 4,
        ocrStatus: 'Restricted Access',
        ocrKeywords: ['Informer', 'Covert Code CI-09', 'Field intelligence'],
        versions: [
          {
            version: 'V1',
            isCurrent: true,
            modifiedBy: 'Inspector Vikram Rathore',
            date: '24 Sep 2026, 18:00',
            fileSize: '450 KB',
            hash: '3d91827465abcde0192837465102938475610293847561029384756102938475',
            changeDescription: 'Protected witness identity and covert field informant ledger.'
          }
        ],
        content: `[TOP SECRET - ACCESS RESTRICTED]
PROTECTED WITNESS & INFORMANTS REGISTRY (UNDER SEAL)
This document contains classified identity protection records for covert source CI-09. Access requires Top Secret clearance with explicit authorization.`
      }
    ]
  },
  {
    id: 'CASE-INV-2026-0189',
    caseNumber: 'INV-2026-0189',
    title: 'Hauzkhas Godown Homicide & Ballistic Striation Investigation',
    type: 'Violent Crime / Homicide',
    status: 'Active Investigation',
    priority: 'High',
    createdDate: '15 Sep 2026',
    lastActivity: '25 Sep 2026, 11:20',
    assignedOfficers: [
      'Inspector Vikram Rathore (IO)',
      'Dr. Ananya Sharma (CFSL Ballistics)'
    ],
    policeStation: 'Hauz Khas PS, South District, New Delhi',
    courtName: 'Court of Additional Sessions Judge, Saket Courts, New Delhi',
    acts: [
      'Section 103(1) Bharatiya Nyaya Sanhita (BNS) [Murder]',
      'Section 25 / 27 The Arms Act, 1959 [Unlawful Possession & Use of Firearm]'
    ],
    summary: 'Fatal shooting at Okhla godown. Recovery of 7.65mm spent cartridges and an unlicensed country-made firearm with obliterated serial number.',
    assignedUsers: [
      { name: 'Inspector Vikram Rathore', role: 'Investigation Officer', access: 'Read / Write' },
      { name: 'Dr. Ananya Sharma', role: 'Forensic Analyst', access: 'Read / Write' }
    ],
    documents: [
      {
        id: 'DOC-0189-FIR',
        name: 'Homicide_FIR_0189.pdf',
        type: 'FIR',
        caseId: 'INV-2026-0189',
        currentVersion: 'V1',
        uploadedBy: 'Inspector Vikram Rathore',
        uploadDate: '15 Sep 2026, 22:30',
        fileSize: '1.1 MB',
        classification: 'Secret',
        integrityStatus: 'VERIFIED',
        accessLevel: 'Internal',
        storedHash: '14316d3f3f26040847cb502c3c6f4ef891bb3cd4b07e86d26786c55cbbcc48ee',
        sha256: '14316d3f3f26040847cb502c3c6f4ef891bb3cd4b07e86d26786c55cbbcc48ee',
        blockHeight: 5,
        ocrStatus: 'Completed',
        ocrKeywords: ['Homicide', 'Arms Act', '7.65mm', 'Okhla godown'],
        versions: [
          {
            version: 'V1',
            isCurrent: true,
            modifiedBy: 'Inspector Vikram Rathore',
            date: '15 Sep 2026, 22:30',
            fileSize: '1.1 MB',
            hash: '14316d3f3f26040847cb502c3c6f4ef891bb3cd4b07e86d26786c55cbbcc48ee',
            changeDescription: 'FIR registered upon discovery of body at Okhla.'
          }
        ],
        content: `FIRST INFORMATION REPORT (Under Section 173 BNSS 2023)
Case: INV-2026-0189 | Deceased: Sh. Rajeshwar Goel (Age 47 yrs)
Scene: Warehouse 44-B, Okhla Industrial Area Phase-II. Two fired 7.65mm brass cartridge cases recovered.`
      },
      {
        id: 'DOC-0189-BAL',
        name: 'CFSL_Ballistics_Comparison_Report.pdf',
        type: 'Forensic Report',
        caseId: 'INV-2026-0189',
        currentVersion: 'V2',
        uploadedBy: 'Dr. Ananya Sharma',
        uploadDate: '22 Sep 2026, 17:15',
        fileSize: '3.9 MB',
        classification: 'Top Secret',
        integrityStatus: 'VERIFIED',
        accessLevel: 'Special Clearance',
        storedHash: '499f362b5d4ec3d288d3e26487e45292358fb7e034934149fa5eb9036c1d5648',
        sha256: '499f362b5d4ec3d288d3e26487e45292358fb7e034934149fa5eb9036c1d5648',
        blockHeight: 6,
        ocrStatus: 'Completed',
        ocrKeywords: ['Leica FS-CB', 'Firing pin impression', 'Striation match 99.8%'],
        versions: [
          {
            version: 'V2',
            isCurrent: true,
            modifiedBy: 'Dr. Ananya Sharma',
            date: '22 Sep 2026, 17:15',
            fileSize: '3.9 MB',
            hash: '499f362b5d4ec3d288d3e26487e45292358fb7e034934149fa5eb9036c1d5648',
            changeDescription: 'Final comparative microscopy opinion matching recovered cartridge cases with pistol Exhibit W-1.'
          },
          {
            version: 'V1',
            isCurrent: false,
            modifiedBy: 'Dr. Ananya Sharma',
            date: '18 Sep 2026, 14:00',
            fileSize: '2.5 MB',
            hash: '6819230485aef019283746510293847561029384756102938475610293847561',
            changeDescription: 'Initial test firing recovery report.'
          }
        ],
        content: `CFSL BALLISTICS DIVISION COMPARISON REPORT
Case Ref: FSL/BALL/2026/0339 | Comparison Microscope: Leica FS-CB
Cartridge cases C-1 & C-2 recovered from scene match test cases fired from improvised pistol W-1 with 99.8% striation congruence.`
      }
    ]
  },
  {
    id: 'CASE-INV-2026-0077',
    caseNumber: 'INV-2026-0077',
    title: 'Directorate of Revenue Intelligence vs. Zenith Cargo Logistics',
    type: 'Customs & Contraband',
    status: 'Appellate Review',
    priority: 'Medium',
    createdDate: '10 Aug 2026',
    lastActivity: '20 Sep 2026, 15:40',
    assignedOfficers: [
      'Inspector Vikram Rathore (IO)',
      'Advocate R. K. Shrivastava (PP)'
    ],
    policeStation: 'DRI Headquarters, New Delhi',
    courtName: 'High Court of Delhi (Customs Appellate Division)',
    acts: [
      'Section 135(1)(i) The Customs Act, 1962 [Evasion of Duty & Smuggling]',
      'Section 111(d) & (m) The Customs Act, 1962 [Confiscation of Improperly Imported Goods]'
    ],
    summary: 'Interception of multimodal cargo shipping containers carrying concealed semiconductor grade machinery misdeclared as agricultural equipment.',
    assignedUsers: [
      { name: 'Inspector Vikram Rathore', role: 'Investigation Officer', access: 'Read / Write' },
      { name: 'Advocate R. K. Shrivastava', role: 'Legal Officer', access: 'Read / Write' }
    ],
    documents: [
      {
        id: 'DOC-0077-SEIZURE',
        name: 'DRI_Seizure_Memo_110.pdf',
        type: 'Legal Notice',
        caseId: 'INV-2026-0077',
        currentVersion: 'V1',
        uploadedBy: 'Inspector Vikram Rathore',
        uploadDate: '10 Aug 2026, 18:00',
        fileSize: '1.4 MB',
        classification: 'Top Secret',
        integrityStatus: 'VERIFIED',
        accessLevel: 'Internal',
        storedHash: '9a0a82f8b7b9e48b010f3c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
        sha256: '9a0a82f8b7b9e48b010f3c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
        blockHeight: 7,
        ocrStatus: 'Completed',
        ocrKeywords: ['Customs S.110', 'ICD Tughlakabad', 'Laser optics', 'Duty evasion'],
        versions: [
          {
            version: 'V1',
            isCurrent: true,
            modifiedBy: 'Inspector Vikram Rathore',
            date: '10 Aug 2026, 18:00',
            fileSize: '1.4 MB',
            hash: '9a0a82f8b7b9e48b010f3c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
            changeDescription: 'Official seizure memo recorded at ICD Tughlakabad.'
          }
        ],
        content: `DRI SEIZURE MEMO UNDER SECTION 110 CUSTOMS ACT 1962
Location: ICD Tughlakabad | Container: TEMU-772910-4
Declared: Agricultural pump parts. Seized: 120 units high-precision laser inspection optics (Market Value: INR 22.50 Cr).`
      }
    ]
  }
];
