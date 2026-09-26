import { ROLES } from './roles.js';

export const DEMO_USERS = [
  {
    id: 'user-investigator',
    email: 'investigator@caseguard.gov',
    password: 'investigator123',
    name: 'Inspector Vikram Rathore',
    designation: 'Senior Investigation Officer (Cyber & EOW)',
    badge: 'DL-POL-4418',
    role: ROLES.INVESTIGATION_OFFICER,
    clearance: 'Secret',
    assignedCases: ['INV-2026-0142', 'INV-2026-0189', 'INV-2026-0077'],
    organization: 'Delhi Police Special Cell / EOW',
    description: 'Lead Investigator across all primary investigation dossiers with full evidentiary upload & versioning rights.'
  },
  {
    id: 'user-officer',
    email: 'officer@caseguard.gov',
    password: 'officer123',
    name: 'Sub-Inspector Rajesh Verma',
    designation: 'Station House Officer (Hauz Khas PS)',
    badge: 'DL-POL-8832',
    role: ROLES.POLICE_OFFICER,
    clearance: 'Secret',
    assignedCases: ['INV-2026-0189'],
    organization: 'Hauz Khas Police Station, South District',
    description: 'Local precinct officer assigned strictly to violent crime docket INV-2026-0189. Denied access to other cases.'
  },
  {
    id: 'user-legal',
    email: 'legal@caseguard.gov',
    password: 'legal123',
    name: 'Advocate R. K. Shrivastava',
    designation: 'Special Public Prosecutor (Directorate of Prosecution)',
    badge: 'BAR-DL-9921',
    role: ROLES.LEGAL_OFFICER,
    clearance: 'Confidential',
    assignedCases: ['INV-2026-0142', 'INV-2026-0077'],
    organization: 'Delhi Prosecution Department / Sessions Courts',
    description: 'Prosecuting counsel assigned to Financial Fraud & DRI Customs. Cannot access Homicide Case INV-2026-0189 unless a document is explicitly shared.'
  },
  {
    id: 'user-admin',
    email: 'admin@caseguard.gov',
    password: 'admin123',
    name: 'Sh. Alok Vardhan',
    designation: 'Chief System Administrator & Integrity Auditor',
    badge: 'SYS-AUD-001',
    role: ROLES.ADMINISTRATOR,
    clearance: 'Top Secret',
    assignedCases: ['*'],
    organization: 'Ministry of Home Affairs / Central Evidence Vault',
    description: 'Unrestricted supervisory authority with universal audit access, cryptographic verification, and security governance.'
  }
];

export function findUserByEmail(email) {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  return DEMO_USERS.find(u => u.email.toLowerCase() === clean) || null;
}

export function authenticateDemoUser(email, password) {
  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Officer identification or email not found in institutional registry.' };
  }
  if (user.password !== password) {
    return { success: false, error: 'Invalid security credentials or access key.' };
  }
  return { success: true, user };
}
