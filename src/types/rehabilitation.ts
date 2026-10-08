export type VictimizationType = 
  | 'identity_theft'
  | 'synthetic_identity_fraud'
  | 'identity_impersonation'
  | 'account_takeover'
  | 'financial_identity_fraud'
  | 'online_impersonation'
  | 'cyber_exploitation'
  | 'employment_credential_fraud'
  | 'other';

export type SeverityLevel = 
  | 'Level 1 — Moderate'
  | 'Level 2 — Serious'
  | 'Level 3 — Severe'
  | 'Level 4 — Critical'
  | 'Level 5 — Extreme';

export type CaseWorkflowStatus = 
  | 'Intake'
  | 'Under Review'
  | 'Verified'
  | 'Severity Assessed'
  | 'Rehabilitation Plan Created'
  | 'Active Rehabilitation'
  | 'Review'
  | 'Remediation Completed'
  | 'Case Closed';

export type ActionStatus = 
  | 'Not Started'
  | 'In Progress'
  | 'Awaiting Victim'
  | 'Completed'
  | 'Unable to Complete';

export type ActionPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type FinancialAssistanceStatus = 
  | 'Not Applicable'
  | 'Under Internal Review'
  | 'Approved Internally'
  | 'Processing'
  | 'Completed'
  | 'Cancelled';

export interface RehabilitationAction {
  id: string;
  actionName: string;
  description: string;
  assignedOfficer: string;
  priority: ActionPriority;
  startDate: string;
  targetCompletionDate: string;
  status: ActionStatus;
  notes?: string;
  category: 
    | 'Identity Recovery'
    | 'Account Recovery'
    | 'Credential Replacement'
    | 'Security Restoration'
    | 'Fraud-Alert Guidance'
    | 'Credit Dispute Guidance'
    | 'Digital-Security Education'
    | 'Cyber-Safety Education'
    | 'Documentation Assistance'
    | 'Legal-Aid Referral'
    | 'Psychological/Social Referral'
    | 'Employment/Business Recovery'
    | 'Financial-Literacy Education'
    | 'Digital Identity Protection';
}

export interface CaseOfficer {
  id: string;
  name: string;
  role: 'Case Officer' | 'Senior Officer' | 'Rehabilitation Administrator' | 'Director';
  email: string;
  active: boolean;
}

export interface SupportRecommendation {
  id: string;
  recommendedSupport: string[];
  reason: string;
  priority: 'Routine' | 'Priority' | 'High Priority' | 'Urgent Intervention';
  approvalStatus: 'Draft' | 'Submitted' | 'Approved' | 'Declined';
  approvingOfficer?: string;
  internalAssistanceStatus: FinancialAssistanceStatus;
  internalReferenceNumber?: string;
  dateRecommended: string;
}

export interface CaseDocument {
  id: string; // e.g., GAARC-DOC-2026-XXXXXXX
  caseId: string;
  documentType: 
    | 'Case Summary'
    | 'Victim Rehabilitation Plan'
    | 'Case Review Report'
    | 'Rehabilitation Completion Report'
    | 'Referral Letter'
    | 'Administrative Case Report';
  creationDate: string;
  version: string;
  author: string;
  status: 'Valid' | 'Superseded' | 'Revoked';
  documentHash: string;
  notes?: string;
  revocationReason?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 
    | 'CASE_CREATED'
    | 'CASE_UPDATED'
    | 'CASE_VERIFIED'
    | 'SEVERITY_ASSESSED'
    | 'REHABILITATION_PLAN_CREATED'
    | 'CASE_OFFICER_ASSIGNED'
    | 'SUPPORT_RECOMMENDED'
    | 'CASE_REVIEWED'
    | 'DOCUMENT_GENERATED'
    | 'DOCUMENT_UPDATED'
    | 'DOCUMENT_SUPERSEDED'
    | 'DOCUMENT_REVOKED'
    | 'CASE_COMPLETED'
    | 'CASE_REOPENED';
  caseId?: string;
  documentId?: string;
  previousStatus?: string;
  newStatus?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface VictimCase {
  id: string; // e.g., GAARC-CASE-2026-1042
  referenceNumber: string; // e.g., GAARC-VR-9081
  fullName: string;
  preferredName?: string;
  email: string;
  phone: string;
  country: string;
  registrationDate: string;
  
  // Victimization Types
  victimizationTypes: VictimizationType[];
  
  // Impact Assessment Factors
  compromisedServicesCount: number;
  durationMonths: number;
  employmentImpact: 'None' | 'Minimal' | 'Moderate' | 'Severe' | 'Job Loss';
  businessImpact: 'None' | 'Minor Disruption' | 'Major Commercial Disruption' | 'Insolvency Risk';
  financialImpact: 'None' | 'Low' | 'Moderate' | 'Severe' | 'Catastrophic';
  documentCompromise: boolean;
  creditReputationImpact: 'None' | 'Noticeable' | 'Severe Credit Impairment';
  socialImpact: 'None' | 'Distress' | 'Severe Harassment' | 'Social Isolation';
  recoveryDifficulty: 'Standard' | 'Challenging' | 'Complex' | 'Extremely Difficult';
  currentVulnerability: 'Stable' | 'At Risk' | 'Active Impersonation Ongoing';
  evidenceSubmitted: string[];
  
  // Severity Assessment
  severityLevel?: SeverityLevel;
  calculatedScore?: number;
  assessmentNotes?: string;
  assessedBy?: string;
  assessedAt?: string;

  // Workflow & Assignment
  status: CaseWorkflowStatus;
  assignedOfficer?: string; // Case officer name
  
  // Rehabilitation Actions & Support Plan
  planCreatedDate?: string;
  actions: RehabilitationAction[];
  supportRecommendation?: SupportRecommendation;
  
  // Case Documents
  documents: CaseDocument[];
  
  // Case Notes
  notes: {
    id: string;
    author: string;
    date: string;
    text: string;
  }[];
}
