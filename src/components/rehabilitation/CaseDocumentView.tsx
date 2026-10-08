import React from 'react';
import { CaseDocument, VictimCase } from '../types/rehabilitation';
import { ShieldCheck, Calendar, User, FileText, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';

interface CaseDocumentPDFProps {
  doc: CaseDocument;
  victimCase: VictimCase;
  onClose?: () => void;
  onPrint?: () => void;
}

export function CaseDocumentView({ doc, victimCase, onClose, onPrint }: CaseDocumentPDFProps) {
  const verifyUrl = `${window.location.origin}/verify/document/${doc.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(verifyUrl)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex justify-center p-4 sm:p-6 backdrop-blur-sm print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-auto border border-gray-200 print:shadow-none print:border-none print:m-0">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-imrc-secondary" />
            <div>
              <p className="font-semibold text-sm leading-none">{doc.documentType}</p>
              <p className="text-xs text-gray-400 font-mono mt-1">{doc.id} (v{doc.version})</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.print()}
              className="bg-imrc-secondary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              Print / Save PDF
            </button>
            {onClose && (
              <button 
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 sm:p-14 relative bg-white text-slate-800 font-sans print:p-8">
          
          {/* Subtle Security Watermark in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <div className="text-center transform -rotate-45 font-black text-6xl tracking-widest text-slate-900 uppercase">
              GAARC • OFFICIAL CASE RECORD • {doc.id}
            </div>
          </div>

          {/* Document Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-8 border-b-2 border-slate-200 gap-6">
            <div className="flex items-center gap-4">
              <img 
                src="https://i.postimg.cc/hP30Q9Fd/GAARC-Logo-01.png" 
                alt="GAARC" 
                className="h-16 w-auto object-contain" 
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#0047AB] tracking-tight m-0">
                  GLOBAL ANTI-IDENTITY THEFT & REHABILITATION COMMISSION
                </h1>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                  Victim Rehabilitation & Operational Support Division
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right w-full sm:w-auto bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <div className="text-xs uppercase font-bold text-slate-500">Document Identifier</div>
              <div className="text-sm font-mono font-bold text-slate-900">{doc.id}</div>
              <div className="text-[11px] text-slate-500 mt-1">Version: <span className="font-semibold text-slate-800">{doc.version}</span> • Status: <span className={`font-bold ${doc.status === 'Valid' ? 'text-emerald-700' : 'text-rose-600'}`}>{doc.status.toUpperCase()}</span></div>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="my-8 bg-[#0047AB] text-white p-5 rounded-lg flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-orange-300 tracking-wider">Official Case Record</div>
              <h2 className="text-2xl font-black tracking-tight text-white m-0 uppercase mt-0.5">{doc.documentType}</h2>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-white/80">Issue Date</div>
              <div className="text-sm font-bold text-white">{doc.creationDate}</div>
            </div>
          </div>

          {/* Recipient & Case Classification Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-200 p-6 rounded-xl mb-8">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Assessed Victim / Case Subject</p>
              <h3 className="text-xl font-bold text-slate-900 m-0">{victimCase.fullName}</h3>
              <p className="text-xs font-mono text-slate-600 mt-1">Ref ID: {victimCase.referenceNumber} • Case ID: {victimCase.id}</p>
              <p className="text-xs text-slate-600 mt-1">Jurisdiction: <span className="font-semibold text-slate-800">{victimCase.country}</span></p>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-6 pt-4 sm:pt-0">
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Operational Assessment</p>
              <div className="inline-block px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs rounded-full mb-2">
                {victimCase.severityLevel || 'Severity Pending'}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compromised Services: <span className="font-semibold">{victimCase.compromisedServicesCount}</span> | Duration: <span className="font-semibold">{victimCase.durationMonths} months</span>
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                Current Status: <span className="font-semibold text-slate-900">{victimCase.status}</span>
              </p>
            </div>
          </div>

          {/* Victimization Details */}
          <div className="mb-8">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0047AB]" /> Scope of Verified Victimization
            </h4>
            <div className="flex flex-wrap gap-2">
              {victimCase.victimizationTypes.map((type) => (
                <span key={type} className="text-xs px-3 py-1 bg-slate-100 border border-slate-300 font-medium text-slate-800 rounded-md capitalize">
                  {type.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Action Directives / Plan Steps */}
          {victimCase.actions && victimCase.actions.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Rehabilitation Directives
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200">
                {victimCase.actions.map((act, idx) => (
                  <div key={act.id} className="p-4 bg-white hover:bg-slate-50 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-sm">
                        {idx + 1}. {act.actionName}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${act.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {act.status}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-2 leading-relaxed">{act.description}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-4">
                      <span>Category: <strong className="text-slate-600">{act.category}</strong></span>
                      <span>Assigned: <strong className="text-slate-600">{act.assignedOfficer}</strong></span>
                      <span>Target: <strong className="text-slate-600">{act.targetCompletionDate}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidentiality & Integrity Statement */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed mb-8">
            <strong className="text-slate-800 block mb-1">Confidentiality & Authority Notice:</strong>
            This document constitutes an administrative rehabilitation case record issued by the Global Anti-Identity Theft & Rehabilitation Commission (GAARC) for authorized victim support, institutional coordination, and case remediation. It does not certify banking accounts or financial claims. Unauthorized duplication, modification, or deceptive distribution is strictly prohibited.
          </div>

          {/* Authentication & Verification Section */}
          <div className="border-t-2 border-slate-200 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            
            {/* Signature Area */}
            <div className="sm:col-span-2">
              <p className="text-xs uppercase font-bold text-slate-400 mb-2">Authorizing Case Officer</p>
              <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg relative overflow-hidden">
                <div className="text-sm font-bold text-slate-900">{doc.author}</div>
                <div className="text-xs text-slate-500">Case Officer • GAARC Victim Rehabilitation Unit</div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Cryptographic Record ID: {doc.documentHash.substring(0, 16)}...</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Digitally Validated
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Verification */}
            <div className="flex flex-col items-center text-center sm:border-l border-slate-200 sm:pl-6">
              <div className="w-24 h-24 bg-white p-1.5 border border-slate-200 rounded-lg shadow-sm mb-2 flex items-center justify-center">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Independent Verification</p>
              <a 
                href={verifyUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[11px] text-[#0047AB] hover:underline font-mono font-medium truncate max-w-[180px] block"
              >
                /verify/document/{doc.id}
              </a>
            </div>

          </div>

          {/* Footer Microtext */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between text-[10px] text-slate-400 font-mono">
            <span>GAARC Global Registry • Geneva Bureau • Case Ref: {victimCase.referenceNumber}</span>
            <span>Document Integrity Record: {doc.id}-V{doc.version}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
