import React, { useState } from 'react';
import { VictimCase, CaseWorkflowStatus, RehabilitationAction, ActionPriority, ActionStatus } from '../../types/rehabilitation';
import { 
  getCaseOfficers, 
  calculateSeverityScore 
} from '../../lib/rehabilitationStore';
import { 
  ShieldCheck, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  FileText, 
  Send, 
  Clock, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface CaseDetailDrawerProps {
  victimCase: VictimCase;
  onClose: () => void;
  onUpdateCase: (updated: VictimCase, reason: string) => void;
  onGenerateDocument: (victimCase: VictimCase, docType: any) => void;
  onViewDocument: (victimCase: VictimCase, doc: any) => void;
}

const WORKFLOW_STEPS: CaseWorkflowStatus[] = [
  'Intake',
  'Under Review',
  'Verified',
  'Severity Assessed',
  'Rehabilitation Plan Created',
  'Active Rehabilitation',
  'Review',
  'Remediation Completed',
  'Case Closed'
];

export function CaseDetailDrawer({ 
  victimCase, 
  onClose, 
  onUpdateCase,
  onGenerateDocument,
  onViewDocument
}: CaseDetailDrawerProps) {
  const officers = getCaseOfficers();
  const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'documents' | 'recommendation' | 'notes'>('overview');

  // New action modal / inline form
  const [showAddAction, setShowAddAction] = useState(false);
  const [actionName, setActionName] = useState('');
  const [actionDesc, setActionDesc] = useState('');
  const [actionCategory, setActionCategory] = useState<RehabilitationAction['category']>('Identity Recovery');
  const [actionPriority, setActionPriority] = useState<ActionPriority>('High');
  const [actionTargetDate, setActionTargetDate] = useState('2026-10-30');

  // New note
  const [noteText, setNoteText] = useState('');

  // Support recommendation form state
  const [recReason, setRecReason] = useState(victimCase.supportRecommendation?.reason || '');
  const [recServices, setRecServices] = useState<string[]>(victimCase.supportRecommendation?.recommendedSupport || ['Identity Recovery', 'Cybersecurity Education']);
  const [internalRef, setInternalRef] = useState(victimCase.supportRecommendation?.internalReferenceNumber || '');

  const handleStatusChange = (newStatus: CaseWorkflowStatus) => {
    const updated = { ...victimCase, status: newStatus };
    onUpdateCase(updated, `Workflow transition to ${newStatus}`);
  };

  const handleAssignOfficer = (officerName: string) => {
    const updated = { ...victimCase, assignedOfficer: officerName };
    onUpdateCase(updated, `Assigned case officer: ${officerName}`);
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionName) return;

    const newAction: RehabilitationAction = {
      id: 'act-' + Date.now(),
      actionName,
      description: actionDesc,
      category: actionCategory,
      priority: actionPriority,
      startDate: new Date().toISOString().substring(0, 10),
      targetCompletionDate: actionTargetDate,
      status: 'Not Started',
      assignedOfficer: victimCase.assignedOfficer || 'Case Officer'
    };

    const updatedActions = [...victimCase.actions, newAction];
    const updated = { 
      ...victimCase, 
      actions: updatedActions,
      status: victimCase.status === 'Intake' || victimCase.status === 'Under Review' || victimCase.status === 'Severity Assessed'
        ? 'Active Rehabilitation'
        : victimCase.status
    };
    onUpdateCase(updated, `Added rehabilitation directive: "${actionName}"`);
    setShowAddAction(false);
    setActionName('');
    setActionDesc('');
  };

  const handleToggleActionStatus = (actionId: string, nextStatus: ActionStatus) => {
    const updatedActions = victimCase.actions.map(a => 
      a.id === actionId ? { ...a, status: nextStatus } : a
    );
    const updated = { ...victimCase, actions: updatedActions };
    onUpdateCase(updated, `Action status updated to ${nextStatus}`);
  };

  const handleSaveRecommendation = () => {
    const updatedRec = {
      id: victimCase.supportRecommendation?.id || 'rec-' + Date.now(),
      recommendedSupport: recServices,
      reason: recReason,
      priority: 'High Priority' as const,
      approvalStatus: 'Approved' as const,
      approvingOfficer: 'Anita D. Benz',
      internalAssistanceStatus: 'Approved Internally' as const,
      internalReferenceNumber: internalRef || `GAARC-REF-${Math.floor(1000 + Math.random() * 9000)}`,
      dateRecommended: new Date().toISOString().substring(0, 10)
    };
    const updated = { ...victimCase, supportRecommendation: updatedRec };
    onUpdateCase(updated, 'Updated Rehabilitation Support Recommendation');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNote = {
      id: 'n-' + Date.now(),
      author: 'Case Officer',
      date: new Date().toISOString().substring(0, 10),
      text: noteText.trim()
    };
    const updated = { ...victimCase, notes: [newNote, ...victimCase.notes] };
    onUpdateCase(updated, 'Added case consultation note');
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-4xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="bg-[#0047AB] text-white p-6 shrink-0 flex items-center justify-between border-b border-blue-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-orange-500 text-white rounded text-[11px] font-bold uppercase tracking-wider">
                {victimCase.status}
              </span>
              <span className="text-xs text-blue-200 font-mono">Case #{victimCase.id}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1 m-0">{victimCase.fullName}</h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Ref: <span className="font-mono">{victimCase.referenceNumber}</span> • Country: {victimCase.country} • Registered: {victimCase.registrationDate}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg text-lg cursor-pointer hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Workflow Progress Ribbon */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs min-w-max">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Transition Workflow:</span>
            {WORKFLOW_STEPS.map((step, idx) => {
              const isCurrent = victimCase.status === step;
              return (
                <button
                  key={step}
                  onClick={() => handleStatusChange(step)}
                  className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    isCurrent 
                      ? 'bg-[#0047AB] text-white font-bold shadow-xs' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-[#0047AB]'
                  }`}
                >
                  {idx + 1}. {step}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-white shrink-0">
          {[
            { id: 'overview', label: 'Overview & Assessment' },
            { id: 'plan', label: `Rehabilitation Plan (${victimCase.actions.length})` },
            { id: 'documents', label: `Documents (${victimCase.documents.length})` },
            { id: 'recommendation', label: 'Support Review' },
            { id: 'notes', label: `Consultation Notes (${victimCase.notes.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                activeTab === tab.id 
                  ? 'border-[#0047AB] text-[#0047AB]' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: OVERVIEW & ASSESSMENT */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Severity Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Assessed Severity Classification</span>
                    <h3 className="text-lg font-bold text-slate-900 m-0">
                      {victimCase.severityLevel || 'Severity Not Assessed'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Calculated Score</span>
                    <div className="text-2xl font-black text-[#0047AB]">
                      {victimCase.calculatedScore ?? 0} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Compromised Accounts</span>
                    <strong className="text-slate-800">{victimCase.compromisedServicesCount} services</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duration</span>
                    <strong className="text-slate-800">{victimCase.durationMonths} months</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Document Compromise</span>
                    <strong className={victimCase.documentCompromise ? 'text-rose-600' : 'text-emerald-600'}>
                      {victimCase.documentCompromise ? 'Yes (Passport/ID)' : 'No'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Recovery Complexity</span>
                    <strong className="text-slate-800">{victimCase.recoveryDifficulty}</strong>
                  </div>
                </div>

                {victimCase.assessmentNotes && (
                  <p className="mt-3 text-xs text-slate-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100 italic">
                    "{victimCase.assessmentNotes}"
                  </p>
                )}
              </div>

              {/* Assignment & Management */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Assigned Case Officer</label>
                  <select 
                    value={victimCase.assignedOfficer || ''} 
                    onChange={e => handleAssignOfficer(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:border-[#0047AB] outline-none"
                  >
                    <option value="">Unassigned</option>
                    {officers.map(o => (
                      <option key={o.id} value={o.name}>{o.name} ({o.role})</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Case officers have direct coordination permissions for this victim's recovery plan.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Scope of Victimization</label>
                  <div className="flex flex-wrap gap-1.5">
                    {victimCase.victimizationTypes.map(t => (
                      <span key={t} className="text-[11px] px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200 capitalize">
                        {t.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Evidence Details */}
              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Verified Evidence on Record ({victimCase.evidenceSubmitted.length})
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {victimCase.evidenceSubmitted.map((ev, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* TAB 2: REHABILITATION PLAN */}
          {activeTab === 'plan' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 m-0">Directives & Remediation Actions</h3>
                  <p className="text-xs text-slate-500">Track recovery objectives, agency referrals, and victim empowerment milestones</p>
                </div>
                <button
                  onClick={() => setShowAddAction(!showAddAction)}
                  className="bg-[#0047AB] hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Remediation Action
                </button>
              </div>

              {/* Inline Form to add an action */}
              {showAddAction && (
                <form onSubmit={handleAddAction} className="bg-slate-50 border border-slate-300 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase text-[#0047AB]">New Rehabilitation Action</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">Action Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={actionName} 
                        onChange={e => setActionName(e.target.value)} 
                        placeholder="e.g. Identity Invalidation Notice"
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">Category</label>
                      <select 
                        value={actionCategory} 
                        onChange={e => setActionCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                      >
                        <option value="Identity Recovery">Identity Recovery</option>
                        <option value="Account Recovery">Account Recovery</option>
                        <option value="Credential Replacement">Credential Replacement</option>
                        <option value="Fraud-Alert Guidance">Fraud-Alert Guidance</option>
                        <option value="Credit Dispute Guidance">Credit Dispute Guidance</option>
                        <option value="Digital-Security Education">Digital-Security Education</option>
                        <option value="Legal-Aid Referral">Legal-Aid Referral</option>
                        <option value="Documentation Assistance">Documentation Assistance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">Priority</label>
                      <select 
                        value={actionPriority} 
                        onChange={e => setActionPriority(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">Target Date</label>
                      <input 
                        type="date" 
                        value={actionTargetDate} 
                        onChange={e => setActionTargetDate(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700">Description</label>
                      <input 
                        type="text" 
                        value={actionDesc} 
                        onChange={e => setActionDesc(e.target.value)} 
                        placeholder="Describe operational steps"
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddAction(false)}
                      className="px-3 py-1 text-xs text-slate-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-[#0047AB] text-white px-4 py-1 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Save Directive
                    </button>
                  </div>
                </form>
              )}

              {/* Actions List */}
              {victimCase.actions.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-500">No remediation actions registered yet.</p>
                  <button 
                    onClick={() => setShowAddAction(true)}
                    className="mt-2 text-xs text-[#0047AB] font-bold hover:underline cursor-pointer"
                  >
                    + Create First Action
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {victimCase.actions.map(act => (
                    <div key={act.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-slate-900">{act.actionName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                              {act.category}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${act.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-orange-100 text-orange-800'}`}>
                              {act.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mb-2 leading-relaxed">{act.description}</p>
                          <div className="text-[11px] text-slate-400 flex items-center gap-4">
                            <span>Assigned to: <strong className="text-slate-700">{act.assignedOfficer}</strong></span>
                            <span>Target: <strong className="text-slate-700">{act.targetCompletionDate}</strong></span>
                          </div>
                        </div>

                        {/* Status switcher */}
                        <select 
                          value={act.status} 
                          onChange={e => handleToggleActionStatus(act.id, e.target.value as any)}
                          className={`text-xs px-2 py-1 rounded font-semibold border cursor-pointer ${
                            act.status === 'Completed' 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                              : act.status === 'In Progress'
                              ? 'bg-blue-50 border-blue-300 text-blue-800'
                              : 'bg-slate-50 border-slate-300 text-slate-700'
                          }`}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Awaiting Victim">Awaiting Victim</option>
                          <option value="Completed">Completed</option>
                          <option value="Unable to Complete">Unable to Complete</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 m-0">Issued Administrative Documents</h3>
                  <p className="text-xs text-slate-500">Official case summaries, recovery plans, and referral reports</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onGenerateDocument(victimCase, 'Victim Rehabilitation Plan')}
                    className="bg-[#0047AB] hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FileText className="w-4 h-4" /> Issue Plan Document
                  </button>
                  <button 
                    onClick={() => onGenerateDocument(victimCase, 'Case Summary')}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FileText className="w-4 h-4" /> Issue Case Summary
                  </button>
                </div>
              </div>

              {victimCase.documents.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No administrative documents generated yet for this case.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                  {victimCase.documents.map(doc => (
                    <div key={doc.id} className="p-4 bg-white flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900">{doc.documentType}</span>
                          <span className="text-[11px] font-mono text-slate-400">({doc.id})</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${doc.status === 'Valid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {doc.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-4">
                          <span>Issued: <strong>{doc.creationDate}</strong></span>
                          <span>Author: <strong>{doc.author}</strong></span>
                          <span>Version: <strong>v{doc.version}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onViewDocument(victimCase, doc)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          View / Print PDF
                        </button>
                        <a 
                          href={`/verify/document/${doc.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0047AB] rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Test Verification URL
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: SUPPORT RECOMMENDATION & INTERNAL RECORD */}
          {activeTab === 'recommendation' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 m-0">Rehabilitation Support Assessment</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Internal committee review determining non-profit support services, documentation assistance, and referrals.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recommended Support Modalities</label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['Credential Invalidation Protocol', 'Digital Forensics Guidance', 'Legal Aid Referral', 'Protective Credit Freeze Guidance', 'Identity Recovery Counseling'].map(s => {
                      const checked = recServices.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRecServices(prev => checked ? prev.filter(x => x !== s) : [...prev, s])}
                          className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                            checked ? 'bg-[#0047AB] text-white border-[#0047AB] font-bold' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {checked ? '✓ ' : '+ '} {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Administrative Justification / Reason</label>
                  <textarea 
                    rows={3} 
                    value={recReason} 
                    onChange={e => setRecReason(e.target.value)}
                    placeholder="Document specific grounds for prioritized intervention..."
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs bg-white focus:border-[#0047AB] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Internal Reference Number</label>
                    <input 
                      type="text" 
                      value={internalRef} 
                      onChange={e => setInternalRef(e.target.value)}
                      placeholder="e.g. GAARC-INT-APPR-2026-441"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Internal Approval Status</label>
                    <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
                      {victimCase.supportRecommendation?.internalAssistanceStatus || 'Under Internal Review'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={handleSaveRecommendation}
                    className="bg-[#0047AB] hover:bg-blue-800 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer shadow-xs"
                  >
                    Save Support Assessment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Add Case Consultation Note</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={noteText} 
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Enter notes from consultation, agency contact, or victim updates..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:border-[#0047AB] outline-none"
                  />
                  <button 
                    type="submit"
                    className="bg-[#0047AB] text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Post Note
                  </button>
                </div>
              </form>

              <div className="space-y-2 pt-2">
                {victimCase.notes.map(n => (
                  <div key={n.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1 font-mono">
                      <span className="font-bold text-slate-700">{n.author}</span>
                      <span>{n.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed m-0">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
