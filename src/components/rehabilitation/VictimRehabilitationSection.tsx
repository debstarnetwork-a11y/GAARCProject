import React, { useState, useEffect, useMemo } from 'react';
import { VictimCase, CaseDocument, CaseWorkflowStatus } from '../../types/rehabilitation';
import { 
  getSavedCases, 
  saveCases, 
  getSavedAuditLogs, 
  logAuditEvent, 
  getCaseOfficers 
} from '../../lib/rehabilitationStore';
import { CaseIntakeModal } from './CaseIntakeModal';
import { CaseDetailDrawer } from './CaseDetailDrawer';
import { CaseDocumentView } from './CaseDocumentView';
import { 
  ShieldAlert, 
  UserPlus, 
  FileCheck2, 
  Search, 
  Filter, 
  AlertCircle, 
  Clock, 
  History, 
  FolderLock, 
  Users, 
  ChevronRight,
  Printer
} from 'lucide-react';

export function VictimRehabilitationSection() {
  const [cases, setCases] = useState<VictimCase[]>([]);
  const [subSection, setSubSection] = useState<
    'All' | 'New' | 'Review' | 'Active' | 'Completed' | 'Audit' | 'Criteria' | 'Officers'
  >('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<VictimCase | null>(null);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [activeDocument, setActiveDocument] = useState<{ doc: CaseDocument; victimCase: VictimCase } | null>(null);
  const [auditLogs, setAuditLogs] = useState(getSavedAuditLogs());
  const officers = getCaseOfficers();

  useEffect(() => {
    setCases(getSavedCases());
    setAuditLogs(getSavedAuditLogs());
  }, []);

  // Filter cases based on subSection and searchQuery
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      // SubSection filter
      if (subSection === 'New' && c.status !== 'Intake') return false;
      if (subSection === 'Review' && (c.status !== 'Under Review' && c.status !== 'Severity Assessed')) return false;
      if (subSection === 'Active' && c.status !== 'Active Rehabilitation') return false;
      if (subSection === 'Completed' && (c.status !== 'Remediation Completed' && c.status !== 'Case Closed')) return false;

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          c.fullName.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query) ||
          c.referenceNumber.toLowerCase().includes(query) ||
          c.country.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [cases, subSection, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: cases.length,
      newIntake: cases.filter(c => c.status === 'Intake').length,
      underReview: cases.filter(c => c.status === 'Under Review' || c.status === 'Severity Assessed').length,
      activeRehab: cases.filter(c => c.status === 'Active Rehabilitation').length,
      critical: cases.filter(c => c.severityLevel?.includes('Critical') || c.severityLevel?.includes('Extreme')).length,
      completed: cases.filter(c => c.status === 'Remediation Completed' || c.status === 'Case Closed').length,
      docsCount: cases.reduce((acc, c) => acc + (c.documents?.length || 0), 0)
    };
  }, [cases]);

  // Handlers
  const handleCreateCase = (newCase: VictimCase) => {
    const updated = [newCase, ...cases];
    setCases(updated);
    saveCases(updated);
    logAuditEvent({
      user: 'Anita D. Benz',
      action: 'CASE_CREATED',
      caseId: newCase.id,
      newStatus: newCase.status,
      reason: `Case intake for ${newCase.fullName} (${newCase.country})`
    });
    setAuditLogs(getSavedAuditLogs());
    setShowIntakeModal(false);
    setSelectedCase(newCase);
  };

  const handleUpdateCase = (updatedCase: VictimCase, reason: string) => {
    const updated = cases.map(c => c.id === updatedCase.id ? updatedCase : c);
    setCases(updated);
    saveCases(updated);
    setSelectedCase(updatedCase);
    logAuditEvent({
      user: 'Anita D. Benz',
      action: 'CASE_UPDATED',
      caseId: updatedCase.id,
      newStatus: updatedCase.status,
      reason
    });
    setAuditLogs(getSavedAuditLogs());
  };

  const handleGenerateDocument = (vCase: VictimCase, docType: CaseDocument['documentType']) => {
    const docId = `GAARC-DOC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newDoc: CaseDocument = {
      id: docId,
      caseId: vCase.id,
      documentType: docType,
      creationDate: new Date().toISOString().substring(0, 10),
      version: '1.0',
      author: vCase.assignedOfficer || 'Anita D. Benz',
      status: 'Valid',
      documentHash: `sha256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      notes: `Official ${docType} generated under GAARC Victim Rehabilitation Protocol`
    };

    const updatedCase = {
      ...vCase,
      documents: [newDoc, ...vCase.documents]
    };

    handleUpdateCase(updatedCase, `Issued document: ${docType} (${docId})`);
    setActiveDocument({ doc: newDoc, victimCase: updatedCase });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Title */}
      <div className="bg-[#0047AB] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-black text-white m-0 tracking-tight">
              Victim Rehabilitation & Case Management
            </h2>
          </div>
          <p className="text-xs text-blue-100 mt-1 max-w-2xl leading-relaxed">
            Centralized operational console for case intake, severity assessment, active recovery plans, and administrative case documentation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowIntakeModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> New Case Intake
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">Total Cases</span>
          <div className="text-2xl font-black text-[#0047AB] mt-1">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">New Intake</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.newIntake}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">Under Review</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{stats.underReview}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">Active Rehab</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.activeRehab}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">Critical / Severe</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{stats.critical}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">Documents Issued</span>
          <div className="text-2xl font-black text-purple-600 mt-1">{stats.docsCount}</div>
        </div>
      </div>

      {/* Sub-Navigation Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'All', label: 'All Cases' },
            { id: 'New', label: `New Cases (${stats.newIntake})` },
            { id: 'Review', label: `Under Review (${stats.underReview})` },
            { id: 'Active', label: `Active Rehabilitation (${stats.activeRehab})` },
            { id: 'Completed', label: `Completed (${stats.completed})` },
            { id: 'Audit', label: 'Audit Log' },
            { id: 'Criteria', label: 'Assessment Criteria' },
            { id: 'Officers', label: 'Case Officers' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                subSection === tab.id 
                  ? 'bg-[#0047AB] text-white font-bold' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        {(subSection === 'All' || subSection === 'New' || subSection === 'Review' || subSection === 'Active' || subSection === 'Completed') && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search victim, case ID, ref..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0047AB]"
            />
          </div>
        )}
      </div>

      {/* VIEW: CASE TABLE */}
      {(subSection === 'All' || subSection === 'New' || subSection === 'Review' || subSection === 'Active' || subSection === 'Completed') && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
          {filteredCases.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs">
              No victim cases found matching this criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Case ID / Ref</th>
                    <th className="px-4 py-3">Victim Name</th>
                    <th className="px-4 py-3">Victimization Scope</th>
                    <th className="px-4 py-3">Severity Level</th>
                    <th className="px-4 py-3">Case Status</th>
                    <th className="px-4 py-3">Assigned Officer</th>
                    <th className="px-4 py-3">Actions</th>
                    <th className="px-4 py-3 text-right">View Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCases.map(c => (
                    <tr 
                      key={c.id} 
                      onClick={() => setSelectedCase(c)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono">
                        <span className="font-bold text-[#0047AB] block">{c.id}</span>
                        <span className="text-[10px] text-gray-400">{c.referenceNumber}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-900 block">{c.fullName}</span>
                        <span className="text-[11px] text-gray-400">{c.country}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {c.victimizationTypes.slice(0, 2).map(t => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 capitalize">
                              {t.replace(/_/g, ' ')}
                            </span>
                          ))}
                          {c.victimizationTypes.length > 2 && (
                            <span className="text-[10px] text-gray-400">+{c.victimizationTypes.length - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          c.severityLevel?.includes('Critical') || c.severityLevel?.includes('Extreme')
                            ? 'bg-rose-100 text-rose-800'
                            : c.severityLevel?.includes('Severe')
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {c.severityLevel || 'Pending'}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-mono">Score: {c.calculatedScore || 0}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded font-semibold text-[10px]">
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {c.assignedOfficer || <span className="text-gray-400 italic">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-500 font-mono text-[11px]">
                          {c.actions.length} Directives
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedCase(c); }}
                          className="px-2.5 py-1 bg-white border border-gray-300 hover:border-[#0047AB] hover:text-[#0047AB] rounded-lg text-xs font-bold transition-all"
                        >
                          Manage &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW: AUDIT LOG */}
      {subSection === 'Audit' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 m-0 flex items-center gap-2">
                <History className="w-4 h-4 text-[#0047AB]" /> Administrative Audit Trail
              </h3>
              <p className="text-xs text-gray-500">Immutable chronological record of case lifecycle events and transitions</p>
            </div>
            <span className="text-xs text-gray-400 font-mono">{auditLogs.length} Records</span>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 hover:bg-slate-50 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-[#0047AB]">{log.action}</span>
                    {log.caseId && <span className="text-gray-500 font-mono">[{log.caseId}]</span>}
                    {log.documentId && <span className="text-purple-600 font-mono">[{log.documentId}]</span>}
                  </div>
                  <p className="text-slate-700 m-0">{log.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-medium text-slate-800 block">{log.user}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: ASSESSMENT CRITERIA CONFIGURATION */}
      {subSection === 'Criteria' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-gray-900 m-0">Severity Assessment Weights & Algorithm</h3>
            <p className="text-xs text-gray-500">Objective, non-discriminatory evaluation weights applied across all case reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl p-4 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-2">1. Compromised Services Weight (Max 25 pts)</h4>
              <p className="text-slate-600 mb-2">Evaluates spread across banking, email, government portals, and e-commerce services.</p>
              <div className="text-[11px] font-mono text-[#0047AB]">Weight Factor: 4 points per service compromise</div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-2">2. Duration of Compromise (Max 20 pts)</h4>
              <p className="text-slate-600 mb-2">Chronic victimization impairs long-term recovery and compounds identity impersonation risk.</p>
              <div className="text-[11px] font-mono text-[#0047AB]">Weight Factor: 1.5 points per active month</div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-2">3. Government Credential Compromise (10 pts)</h4>
              <p className="text-slate-600 mb-2">Flagged whenever national ID cards, passports, or social registry documents are duplicated.</p>
              <div className="text-[11px] font-mono text-[#0047AB]">Flat Addition: +10 severity points</div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-2">4. Economic & Employment Impairment (Max 30 pts)</h4>
              <p className="text-slate-600 mb-2">Measures loss of employment, commercial disruption, and financial hardship.</p>
              <div className="text-[11px] font-mono text-[#0047AB]">Scaled Level: Minimal (3) to Catastrophic (15)</div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CASE OFFICERS */}
      {subSection === 'Officers' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 m-0">Authorized Case Officers & Delegates</h3>
              <p className="text-xs text-gray-500">Case officers with role-based access for victim consultation and remediation directorship</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {officers.map(off => (
              <div key={off.id} className="border border-gray-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm m-0">{off.name}</h4>
                  <span className="text-[11px] text-[#0047AB] font-semibold">{off.role}</span>
                  <span className="text-[11px] text-gray-400 block">{off.email}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                  Active Officer
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intake Modal */}
      {showIntakeModal && (
        <CaseIntakeModal 
          onClose={() => setShowIntakeModal(false)}
          onSubmit={handleCreateCase}
        />
      )}

      {/* Detail Drawer */}
      {selectedCase && (
        <CaseDetailDrawer
          victimCase={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdateCase={handleUpdateCase}
          onGenerateDocument={handleGenerateDocument}
          onViewDocument={(vc, doc) => setActiveDocument({ doc, victimCase: vc })}
        />
      )}

      {/* PDF View Modal */}
      {activeDocument && (
        <CaseDocumentView
          doc={activeDocument.doc}
          victimCase={activeDocument.victimCase}
          onClose={() => setActiveDocument(null)}
        />
      )}

    </div>
  );
}
