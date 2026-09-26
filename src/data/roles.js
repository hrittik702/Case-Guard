export const ROLES = {
  INVESTIGATION_OFFICER: {
    id: 'investigation_officer',
    name: 'Investigation Officer',
    designation: 'Investigation Officer',
    clearance: 'Secret',
    iconName: 'Shield',
    permissions: ['view', 'upload', 'download', 'verify', 'create_case', 'create_version']
  },
  POLICE_OFFICER: {
    id: 'police_officer',
    name: 'Police Station Officer',
    designation: 'Station House Officer / SI',
    clearance: 'Secret',
    iconName: 'Building2',
    permissions: ['view', 'upload', 'download', 'verify']
  },
  LEGAL_OFFICER: {
    id: 'legal_officer',
    name: 'Legal Officer',
    designation: 'Legal Officer / Prosecutor',
    clearance: 'Confidential',
    iconName: 'Scale',
    permissions: ['view', 'download', 'verify', 'edit_metadata']
  },
  FORENSIC_ANALYST: {
    id: 'forensic_analyst',
    name: 'Forensic Analyst',
    designation: 'Forensic Analyst',
    clearance: 'Top Secret',
    iconName: 'Microscope',
    permissions: ['view', 'upload', 'download', 'verify', 'forensic_analysis']
  },
  ADMINISTRATOR: {
    id: 'administrator',
    name: 'System Administrator',
    designation: 'System Administrator & Auditor',
    clearance: 'Top Secret',
    iconName: 'ShieldCheck',
    permissions: ['view', 'upload', 'download', 'edit_metadata', 'delete', 'verify', 'manage_access']
  }
};
