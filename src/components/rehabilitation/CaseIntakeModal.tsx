import React, { useState } from 'react';
import { VictimCase, VictimizationType } from '../../types/rehabilitation';
import { calculateSeverityScore } from '../../lib/rehabilitationStore';
import { Shield, User, Globe, AlertCircle, CheckCircle, FileText } from 'lucide-react';

interface CaseIntakeModalProps {
  onClose: () => void;
  onSubmit: (newCase: VictimCase) => void;
}

const VICTIMIZATION_OPTIONS: { id: VictimizationType; label: string }[] = [
  { id: 'identity_theft', label: 'Identity Theft' },
  { id: 'synthetic_identity_fraud', label: 'Synthetic Identity Fraud' },
  { id: 'identity_impersonation', label: 'Identity Impersonation' },
  { id: 'account_takeover', label: 'Account Takeover' },
  { id: 'financial_identity_fraud', label: 'Financial Identity Fraud' },
  { id: 'online_impersonation', label: 'Online / Social Impersonation' },
  { id: 'cyber_exploitation', label: 'Cyber Exploitation / Harassment' },
  { id: 'employment_credential_fraud', label: 'Employment / Credential Fraud' },
  { id: 'other', label: 'Other Related Compromise' },
];

export function CaseIntakeModal({ onClose, onSubmit }: CaseIntakeModalProps) {
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Switzerland');
  const [selectedTypes, setSelectedTypes] = useState<VictimizationType[]>(['identity_theft']);
  
  // Impact factors
  const [servicesCount, setServicesCount] = useState(3);
  const [durationMonths, setDurationMonths] = useState(6);
  const [employmentImpact, setEmploymentImpact] = useState<VictimCase['employmentImpact']>('Moderate');
  const [businessImpact, setBusinessImpact] = useState<VictimCase['businessImpact']>('None');
  const [financialImpact, setFinancialImpact] = useState<VictimCase['financialImpact']>('Moderate');
  const [documentCompromise, setDocumentCompromise] = useState(true);
  const [creditReputation, setCreditReputation] = useState<VictimCase['creditReputationImpact']>('Noticeable');
  const [socialImpact, setSocialImpact] = useState<VictimCase['socialImpact']>('Distress');
  const [recoveryDifficulty, setRecoveryDifficulty] = useState<VictimCase['recoveryDifficulty']>('Challenging');
  const [currentVulnerability, setCurrentVulnerability] = useState<VictimCase['currentVulnerability']>('At Risk');
  const [evidenceText, setEvidenceText] = useState('Police Incident Report, Compromised Service Statement');

  const toggleType = (t: VictimizationType) => {
    setSelectedTypes(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const caseId = `GAARC-CASE-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const refNum = `GAARC-VR-${Math.floor(1000 + Math.random() * 9000)}`;

    const partialData: Partial<VictimCase> = {
      compromisedServicesCount: servicesCount,
      durationMonths,
      employmentImpact,
      businessImpact,
      financialImpact,
      documentCompromise,
      creditReputationImpact: creditReputation,
      socialImpact,
      recoveryDifficulty,
      currentVulnerability,
    };

    const { score, level } = calculateSeverityScore(partialData);

    const newCase: VictimCase = {
      id: caseId,
      referenceNumber: refNum,
      fullName,
      preferredName: preferredName || fullName.split(' ')[0],
      email,
      phone,
      country,
      registrationDate: new Date().toISOString().substring(0, 10),
      victimizationTypes: selectedTypes.length > 0 ? selectedTypes : ['identity_theft'],
      compromisedServicesCount: servicesCount,
      durationMonths,
      employmentImpact,
      businessImpact,
      financialImpact,
      documentCompromise,
      creditReputationImpact: creditReputation,
      socialImpact,
      recoveryDifficulty,
      currentVulnerability,
      evidenceSubmitted: evidenceText.split(',').map(s => s.trim()).filter(Boolean),
      severityLevel: level,
      calculatedScore: score,
      status: 'Intake',
      actions: [],
      documents: [],
      notes: [{
        id: 'n-' + Date.now(),
        author: 'Intake Administrator',
        date: new Date().toISOString().substring(0, 10),
        text: 'Initial case intake registration processed.'
      }]
    };

    onSubmit(newCase);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="bg-[#0047AB] text-white p-6 sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 m-0 text-white">
              <Shield className="w-6 h-6 text-orange-400" /> New Victim Case Intake
            </h2>
            <p className="text-xs text-white/80 mt-1">
              Register and evaluate a victim of identity compromise for case remediation
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-lg text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-6">
          
          {/* Section 1: Victim Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0047AB] mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> 1. Victim Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Legal Name *</label>
                <input 
                  type="text" 
                  required 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)} 
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#0047AB] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Name / Alias</label>
                <input 
                  type="text" 
                  value={preferredName} 
                  onChange={e => setPreferredName(e.target.value)} 
                  placeholder="e.g. Jane"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#0047AB] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="victim@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#0047AB] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="+41 22 123 4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#0047AB] outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Country of Residence</label>
                <input 
                  type="text" 
                  value={country} 
                  onChange={e => setCountry(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#0047AB] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Victimization Scope */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0047AB] mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> 2. Scope of Victimization (Select all that apply)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VICTIMIZATION_OPTIONS.map(opt => (
                <label 
                  key={opt.id} 
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-xs transition-colors ${
                    selectedTypes.includes(opt.id) ? 'bg-blue-50 border-[#0047AB] text-[#0047AB] font-bold' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedTypes.includes(opt.id)} 
                    onChange={() => toggleType(opt.id)} 
                    className="rounded text-[#0047AB]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Impact & Severity Indicators */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0047AB] mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" /> 3. Operational Impact Indicators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Compromised Services</label>
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  value={servicesCount} 
                  onChange={e => setServicesCount(Number(e.target.value))} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#0047AB] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Months)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="120" 
                  value={durationMonths} 
                  onChange={e => setDurationMonths(Number(e.target.value))} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#0047AB] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Financial Impact</label>
                <select 
                  value={financialImpact} 
                  onChange={e => setFinancialImpact(e.target.value as any)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#0047AB] outline-none bg-white"
                >
                  <option value="None">None</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Catastrophic">Catastrophic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Employment Impact</label>
                <select 
                  value={employmentImpact} 
                  onChange={e => setEmploymentImpact(e.target.value as any)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#0047AB] outline-none bg-white"
                >
                  <option value="None">None</option>
                  <option value="Minimal">Minimal</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Job Loss">Job Loss</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Recovery Difficulty</label>
                <select 
                  value={recoveryDifficulty} 
                  onChange={e => setRecoveryDifficulty(e.target.value as any)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#0047AB] outline-none bg-white"
                >
                  <option value="Standard">Standard</option>
                  <option value="Challenging">Challenging</option>
                  <option value="Complex">Complex</option>
                  <option value="Extremely Difficult">Extremely Difficult</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ongoing Risk</label>
                <select 
                  value={currentVulnerability} 
                  onChange={e => setCurrentVulnerability(e.target.value as any)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#0047AB] outline-none bg-white"
                >
                  <option value="Stable">Stable</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Active Impersonation Ongoing">Active Impersonation</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input 
                type="checkbox" 
                id="docCompromise" 
                checked={documentCompromise} 
                onChange={e => setDocumentCompromise(e.target.checked)} 
                className="rounded text-[#0047AB]"
              />
              <label htmlFor="docCompromise" className="text-xs text-gray-700 font-medium cursor-pointer">
                Government Identity Document (Passport/National ID) has been compromised
              </label>
            </div>
          </div>

          {/* Section 4: Evidence List */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Evidence / Supporting Documents (Comma separated)
            </label>
            <textarea 
              rows={2} 
              value={evidenceText} 
              onChange={e => setEvidenceText(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg text-xs focus:border-[#0047AB] outline-none"
              placeholder="e.g. Police Crime Report, Credit Freeze Confirmation, Impersonator Screenshots"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-[#0047AB] hover:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm cursor-pointer"
            >
              Save Case & Run Severity Engine
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
