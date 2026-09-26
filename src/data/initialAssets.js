export const INITIAL_ASSETS = [
  {
    id: 'ASSET-EV-0412-1',
    caseId: 'CASE-2024-0412',
    caseNumber: 'FIR No. 0412/2024',
    name: 'Samsung Galaxy S23 Ultra (IMEI: 358921094829102)',
    category: 'Digital Device',
    barcode: 'BAR-MALK-2024-0982',
    seizureDate: '2024-03-12',
    seizureLocation: 'Flat 402, Sector 14 Rohini, Delhi',
    seizingOfficer: 'Inspector Vikram Rathore',
    currentCustodian: 'Dr. Ananya Sharma (FSL)',
    storageLocation: 'CFSL Cyber Division Safe #3, New Delhi',
    tamperBagSeal: 'SEAL-POLICE-DL-98012',
    sha256EvidenceHash: '7a8f3b2190cde4581290384756abcefd01289456723019847562019384756201',
    lifecycleState: 'AT_FSL_LAB', // SEIZED -> STORED_IN_MALKHANA -> AT_FSL_LAB -> IN_COURT -> DISPOSED
    custodyChain: [
      {
        step: 1,
        action: 'EVIDENCE_SEIZED_AT_SCENE',
        from: 'Accused Vikramaditya Rawat',
        to: 'Inspector Vikram Rathore (IO)',
        date: '2024-03-12T14:30:00Z',
        purpose: 'Recovery of device used in unauthorized API authentication',
        signatures: ['SIG-IO-VR-941', 'WITNESS-PANCHNAMA-01'],
        blockHeight: 1
      },
      {
        step: 2,
        action: 'DEPOSITED_IN_STATION_MALKHANA',
        from: 'Inspector Vikram Rathore (IO)',
        to: 'SI Harpreet Singh (Malkhana Custodian)',
        date: '2024-03-12T19:00:00Z',
        purpose: 'Secure storage in anti-static Faraday cage locker',
        signatures: ['SIG-IO-VR-941', 'SIG-MALK-HS-1029'],
        blockHeight: 2
      },
      {
        step: 3,
        action: 'TRANSFERRED_TO_FORENSIC_LAB',
        from: 'SI Harpreet Singh (Malkhana Custodian)',
        to: 'Dr. Ananya Sharma (CFSL Cyber Lab)',
        date: '2024-03-25T11:00:00Z',
        purpose: 'Physical bitstream extraction & SQLite database recovery',
        signatures: ['SIG-MALK-HS-1029', 'SIG-FSL-AS-4410'],
        blockHeight: 3
      }
    ]
  },
  {
    id: 'ASSET-EV-0412-2',
    caseId: 'CASE-2024-0412',
    caseNumber: 'FIR No. 0412/2024',
    name: 'SanDisk Extreme 2TB NVMe SSD (S/N: SD24-9981-XX)',
    category: 'Digital Device',
    barcode: 'BAR-MALK-2024-0983',
    seizureDate: '2024-03-12',
    seizureLocation: 'Flat 402, Sector 14 Rohini, Delhi',
    seizingOfficer: 'Inspector Vikram Rathore',
    currentCustodian: 'SI Harpreet Singh',
    storageLocation: 'Vault Locker B-4, Central Malkhana, West District',
    tamperBagSeal: 'SEAL-POLICE-DL-98013',
    sha256EvidenceHash: '3b098234857a26f8d3885c301c20e176b6f00122e20b3294aa9f83a48e718b2a',
    lifecycleState: 'STORED_IN_MALKHANA',
    custodyChain: [
      {
        step: 1,
        action: 'EVIDENCE_SEIZED_AT_SCENE',
        from: 'Accused Vikramaditya Rawat',
        to: 'Inspector Vikram Rathore (IO)',
        date: '2024-03-12T14:35:00Z',
        purpose: 'Backup cold wallet storage drive seized',
        signatures: ['SIG-IO-VR-941', 'WITNESS-PANCHNAMA-01'],
        blockHeight: 1
      },
      {
        step: 2,
        action: 'DEPOSITED_IN_STATION_MALKHANA',
        from: 'Inspector Vikram Rathore (IO)',
        to: 'SI Harpreet Singh (Malkhana Custodian)',
        date: '2024-03-12T19:15:00Z',
        purpose: 'Safe custody pending judicial production',
        signatures: ['SIG-IO-VR-941', 'SIG-MALK-HS-1029'],
        blockHeight: 2
      }
    ]
  },
  {
    id: 'ASSET-EV-0189-1',
    caseId: 'CASE-2024-0189',
    caseNumber: 'FIR No. 0189/2024',
    name: '7.65mm Country-made Improvised Pistol (Marked W-1)',
    category: 'Firearm / Weapon',
    barcode: 'BAR-MALK-2024-1140',
    seizureDate: '2024-06-03',
    seizureLocation: 'Under culvert near Okhla Railway Line',
    seizingOfficer: 'Inspector Vikram Rathore',
    currentCustodian: 'SI Harpreet Singh',
    storageLocation: 'Arms Armor Locker A-1, Central Malkhana',
    tamperBagSeal: 'SEAL-ARMS-SZ-5510',
    sha256EvidenceHash: '499f362b5d4ec3d288d3e26487e45292358fb7e034934149fa5eb9036c1d5648',
    lifecycleState: 'STORED_IN_MALKHANA',
    custodyChain: [
      {
        step: 1,
        action: 'EVIDENCE_SEIZED_AT_SCENE',
        from: 'Disclosure of Accused Kunal Mehra',
        to: 'Inspector Vikram Rathore (IO)',
        date: '2024-06-03T08:00:00Z',
        purpose: 'Section 27 Evidence Act / Section 23 BSA recovery memo',
        signatures: ['SIG-IO-VR-941', 'WITNESS-IND-01'],
        blockHeight: 6
      },
      {
        step: 2,
        action: 'TRANSFERRED_TO_FORENSIC_LAB',
        from: 'Inspector Vikram Rathore (IO)',
        to: 'Dr. Ananya Sharma (CFSL Ballistics)',
        date: '2024-06-05T10:00:00Z',
        purpose: 'Test firing & comparison with recovered spent cases',
        signatures: ['SIG-IO-VR-941', 'SIG-FSL-AS-4410'],
        blockHeight: 7
      },
      {
        step: 3,
        action: 'RETURNED_TO_MALKHANA',
        from: 'Dr. Ananya Sharma (CFSL Ballistics)',
        to: 'SI Harpreet Singh (Malkhana Custodian)',
        date: '2024-06-20T16:00:00Z',
        purpose: 'Returned after report completion under sealed CFSL stamp',
        signatures: ['SIG-FSL-AS-4410', 'SIG-MALK-HS-1029'],
        blockHeight: 8
      }
    ]
  },
  {
    id: 'ASSET-EV-0077-1',
    caseId: 'CASE-2024-0077',
    caseNumber: 'DRI F.No. DRI/HQ/CI/0077/2024',
    name: '120 Units Precision Laser Lithography Inspection Optics',
    category: 'Commercial Contraband / Seized Asset',
    barcode: 'BAR-DRI-2024-4401',
    seizureDate: '2024-01-21',
    seizureLocation: 'Inland Container Depot (ICD), Tughlakabad',
    seizingOfficer: 'Inspector Vikram Rathore',
    currentCustodian: 'Customs Warehouse Bond Officer',
    storageLocation: 'Customs Bonded Warehouse Bay-09, ICD Tughlakabad',
    tamperBagSeal: 'DRI-BOND-CUSTOMS-0081',
    sha256EvidenceHash: '9a0a82f8b7b9e48b010f3c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
    lifecycleState: 'STORED_IN_MALKHANA',
    custodyChain: [
      {
        step: 1,
        action: 'EVIDENCE_SEIZED_AT_SCENE',
        from: 'Container TEMU-772910-4',
        to: 'DRI Special Investigation Team',
        date: '2024-01-21T18:00:00Z',
        purpose: 'Seized under Section 110 Customs Act 1962',
        signatures: ['SIG-IO-VR-941', 'CUSTOMS-SUPDT-09'],
        blockHeight: 8
      }
    ]
  }
];
