import { VictimCase, AuditLogEntry, CaseOfficer, SeverityLevel } from '../types/rehabilitation';

const STORAGE_CASES_KEY = 'gaarc_victim_cases';
const STORAGE_AUDIT_KEY = 'gaarc_rehabilitation_audit';
const STORAGE_OFFICERS_KEY = 'gaarc_case_officers';

export const initialCaseOfficers: CaseOfficer[] = [
  { id: 'off-1', name: 'Anita D. Benz', role: 'Rehabilitation Administrator', email: 'anita.benz@gaarc.org', active: true },
  { id: 'off-2', name: 'Dr. Marcus Vance', role: 'Senior Officer', email: 'm.vance@gaarc.org', active: true },
  { id: 'off-3', name: 'Elena Rostova', role: 'Case Officer', email: 'e.rostova@gaarc.org', active: true },
  { id: 'off-4', name: 'David K. O’Connor', role: 'Case Officer', email: 'd.oconnor@gaarc.org', active: true },
];

export const initialCases: VictimCase[] = [
  {
    id: 'GAARC-CASE-2026-00104',
    referenceNumber: 'GAARC-VR-7821',
    fullName: 'Claire Montgomery',
    preferredName: 'Claire',
    email: 'c.montgomery.cases@secure-vault.net',
    phone: '+44 20 7946 0912',
    country: 'United Kingdom',
    registrationDate: '2026-09-12',
    victimizationTypes: ['identity_theft', 'account_takeover', 'cyber_exploitation'],
    compromisedServicesCount: 6,
    durationMonths: 14,
    employmentImpact: 'Moderate',
    businessImpact: 'None',
    financialImpact: 'Severe',
    documentCompromise: true,
    creditReputationImpact: 'Severe Credit Impairment',
    socialImpact: 'Severe Harassment',
    recoveryDifficulty: 'Complex',
    currentVulnerability: 'Active Impersonation Ongoing',
    evidenceSubmitted: ['Police Crime Reference Report (UK Action Fraud)', 'Compromised Credit Bureau Alert', 'Impersonator Profile Screenshots'],
    severityLevel: 'Level 4 — Critical',
    calculatedScore: 84,
    assessmentNotes: 'Severe synthetic profile created using passport credentials. Perpetrators opened accounts in multiple jurisdictions.',
    assessedBy: 'Dr. Marcus Vance',
    assessedAt: '2026-09-15',
    status: 'Active Rehabilitation',
    assignedOfficer: 'Dr. Marcus Vance',
    planCreatedDate: '2026-09-16',
    actions: [
      {
        id: 'act-101',
        actionName: 'National Fraud Alert Registration & CIFAS Protective Registration',
        description: 'Establish protective fraud alerts across national bureaus to prevent unauthorized credit applications.',
        assignedOfficer: 'Dr. Marcus Vance',
        priority: 'Critical',
        startDate: '2026-09-16',
        targetCompletionDate: '2026-09-20',
        status: 'Completed',
        category: 'Fraud-Alert Guidance'
      },
      {
        id: 'act-102',
        actionName: 'Primary Credential Replacement & Passport Invalidation Protocol',
        description: 'Coordinate with embassy/registry for compromised passport voiding and issuance of clean identity credentials.',
        assignedOfficer: 'Dr. Marcus Vance',
        priority: 'High',
        startDate: '2026-09-21',
        targetCompletionDate: '2026-10-15',
        status: 'In Progress',
        category: 'Credential Replacement'
      },
      {
        id: 'act-103',
        actionName: 'Specialist Cybersecurity & MFA Hardening Session',
        description: 'One-on-one digital security consultation to deploy hardware security keys and secure communications.',
        assignedOfficer: 'Elena Rostova',
        priority: 'Medium',
        startDate: '2026-10-01',
        targetCompletionDate: '2026-10-10',
        status: 'In Progress',
        category: 'Digital-Security Education'
      }
    ],
    supportRecommendation: {
      id: 'rec-1',
      recommendedSupport: ['Credential Invalidation Protocol', 'Legal Aid Referral', 'Digital Forensics Guidance'],
      reason: 'Victim faces ongoing international impersonation; requiring multi-agency documentation assistance.',
      priority: 'Urgent Intervention',
      approvalStatus: 'Approved',
      approvingOfficer: 'Anita D. Benz',
      internalAssistanceStatus: 'Approved Internally',
      internalReferenceNumber: 'GAARC-INT-APPR-2026-441',
      dateRecommended: '2026-09-16'
    },
    documents: [
      {
        id: 'GAARC-DOC-2026-08149',
        caseId: 'GAARC-CASE-2026-00104',
        documentType: 'Victim Rehabilitation Plan',
        creationDate: '2026-09-16',
        version: '1.0',
        author: 'Dr. Marcus Vance',
        status: 'Valid',
        documentHash: 'sha256:7b91f09e8a4d7c2b3e8a4f6d9e0a1c2b',
        notes: 'Initial rehabilitation directive outlining protective registration.'
      }
    ],
    notes: [
      {
        id: 'n-1',
        author: 'Dr. Marcus Vance',
        date: '2026-09-15',
        text: 'Initial consultation completed via encrypted video conference. CIFAS protective registration filed.'
      }
    ]
  },
  {
    id: 'GAARC-CASE-2026-00105',
    referenceNumber: 'GAARC-VR-5219',
    fullName: 'Lucas Meyer',
    preferredName: 'Lucas',
    email: 'lucas.m.identity@proton.me',
    phone: '+41 22 731 4400',
    country: 'Switzerland',
    registrationDate: '2026-09-28',
    victimizationTypes: ['synthetic_identity_fraud', 'financial_identity_fraud'],
    compromisedServicesCount: 4,
    durationMonths: 6,
    employmentImpact: 'Minimal',
    businessImpact: 'Minor Disruption',
    financialImpact: 'Moderate',
    documentCompromise: true,
    creditReputationImpact: 'Noticeable',
    socialImpact: 'Distress',
    recoveryDifficulty: 'Challenging',
    currentVulnerability: 'At Risk',
    evidenceSubmitted: ['Swiss Cantonal Police Complaint Form', 'Credit agency debt collection notice'],
    severityLevel: 'Level 2 — Serious',
    calculatedScore: 46,
    assessmentNotes: 'Synthetic account creation opened in victim name with false address.',
    assessedBy: 'Anita D. Benz',
    assessedAt: '2026-09-29',
    status: 'Under Review',
    assignedOfficer: 'Elena Rostova',
    actions: [],
    documents: [],
    notes: []
  }
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-09-12 10:14:00',
    user: 'System Intake',
    action: 'CASE_CREATED',
    caseId: 'GAARC-CASE-2026-00104',
    newStatus: 'Intake',
    reason: 'Initial victim support registration submitted'
  },
  {
    id: 'aud-2',
    timestamp: '2026-09-15 14:30:00',
    user: 'Dr. Marcus Vance',
    action: 'SEVERITY_ASSESSED',
    caseId: 'GAARC-CASE-2026-00104',
    previousStatus: 'Intake',
    newStatus: 'Severity Assessed',
    reason: 'Severity score computed as 84 -> Level 4 — Critical'
  },
  {
    id: 'aud-3',
    timestamp: '2026-09-16 09:20:00',
    user: 'Dr. Marcus Vance',
    action: 'DOCUMENT_GENERATED',
    caseId: 'GAARC-CASE-2026-00104',
    documentId: 'GAARC-DOC-2026-08149',
    reason: 'Issued Victim Rehabilitation Plan document v1.0'
  }
];

// Helper functions for persistent state
export function getSavedCases(): VictimCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_CASES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading cases from storage', e);
  }
  return initialCases;
}

export function saveCases(cases: VictimCase[]) {
  try {
    localStorage.setItem(STORAGE_CASES_KEY, JSON.stringify(cases));
  } catch (e) {
    console.error('Failed saving cases to storage', e);
  }
}

export function getSavedAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_AUDIT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading audit logs from storage', e);
  }
  return initialAuditLogs;
}

export function logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const current = getSavedAuditLogs();
  const newEntry: AuditLogEntry = {
    id: 'aud-' + Date.now(),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    ...entry
  };
  const updated = [newEntry, ...current];
  try {
    localStorage.setItem(STORAGE_AUDIT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed saving audit entry', e);
  }
  return newEntry;
}

export function getCaseOfficers(): CaseOfficer[] {
  try {
    const raw = localStorage.getItem(STORAGE_OFFICERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return initialCaseOfficers;
}

export function saveCaseOfficers(officers: CaseOfficer[]) {
  try {
    localStorage.setItem(STORAGE_OFFICERS_KEY, JSON.stringify(officers));
  } catch (e) {}
}

export function calculateSeverityScore(caseData: Partial<VictimCase>): { score: number; level: SeverityLevel } {
  let score = 0;

  // Compromised services count (0 to 25 pts)
  const services = caseData.compromisedServicesCount || 0;
  score += Math.min(25, services * 4);

  // Duration in months (0 to 20 pts)
  const duration = caseData.durationMonths || 0;
  score += Math.min(20, Math.round(duration * 1.5));

  // Employment impact (0 to 15 pts)
  switch (caseData.employmentImpact) {
    case 'Job Loss': score += 15; break;
    case 'Severe': score += 12; break;
    case 'Moderate': score += 7; break;
    case 'Minimal': score += 3; break;
  }

  // Financial impact (0 to 15 pts)
  switch (caseData.financialImpact) {
    case 'Catastrophic': score += 15; break;
    case 'Severe': score += 12; break;
    case 'Moderate': score += 7; break;
    case 'Low': score += 3; break;
  }

  // Document compromise (0 or 10 pts)
  if (caseData.documentCompromise) score += 10;

  // Recovery difficulty (0 to 15 pts)
  switch (caseData.recoveryDifficulty) {
    case 'Extremely Difficult': score += 15; break;
    case 'Complex': score += 11; break;
    case 'Challenging': score += 6; break;
    case 'Standard': score += 2; break;
  }

  // Vulnerability (0 to 10 pts)
  if (caseData.currentVulnerability === 'Active Impersonation Ongoing') score += 10;
  else if (caseData.currentVulnerability === 'At Risk') score += 5;

  let level: SeverityLevel = 'Level 1 — Moderate';
  if (score >= 80) level = 'Level 5 — Extreme';
  else if (score >= 65) level = 'Level 4 — Critical';
  else if (score >= 45) level = 'Level 3 — Severe';
  else if (score >= 25) level = 'Level 2 — Serious';
  else level = 'Level 1 — Moderate';

  return { score, level };
}
