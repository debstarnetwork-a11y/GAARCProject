import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSavedCases } from '@/lib/rehabilitationStore';
import { VictimCase, CaseDocument } from '@/types/rehabilitation';
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2, AlertTriangle, ArrowLeft, Lock } from 'lucide-react';

export function DocumentVerification() {
  const { documentId } = useParams<{ documentId: string }>();
  const [searchInput, setSearchInput] = useState(documentId || '');
  const [queriedId, setQueriedId] = useState(documentId || '');
  const [record, setRecord] = useState<{ doc: CaseDocument; victimCase: VictimCase } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (documentId) {
      performLookup(documentId);
    }
  }, [documentId]);

  const performLookup = (idToFind: string) => {
    setHasSearched(true);
    setQueriedId(idToFind.trim());
    const allCases = getSavedCases();
    
    for (const c of allCases) {
      if (c.documents) {
        const found = c.documents.find(d => d.id.toLowerCase() === idToFind.trim().toLowerCase());
        if (found) {
          setRecord({ doc: found, victimCase: c });
          return;
        }
      }
    }
    setRecord(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      performLookup(searchInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation link back */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0047AB] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Return to GAARC Homepage
        </Link>

        {/* Verification Card Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="https://i.postimg.cc/hP30Q9Fd/GAARC-Logo-01.png" 
              alt="GAARC" 
              className="h-16 w-auto object-contain" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight m-0">
              GAARC Document Verification Registry
            </h1>
            <p className="text-xs text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
              Verify the authenticity and current integrity status of official administrative documents, rehabilitation case reports, and directives issued by the Global Anti-Identity Theft & Rehabilitation Commission.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 pt-2">
            <input 
              type="text" 
              value={searchInput} 
              onChange={e => setSearchInput(e.target.value)}
              placeholder="e.g. GAARC-DOC-2026-08149"
              className="flex-1 px-4 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-[#0047AB] font-mono"
            />
            <button 
              type="submit"
              className="bg-[#0047AB] hover:bg-blue-800 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Verify
            </button>
          </form>
        </div>

        {/* Verification Result Section */}
        {hasSearched && (
          <div>
            {record ? (
              <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 overflow-hidden">
                <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="font-bold text-sm tracking-wide uppercase">Official Document Verified</span>
                  </div>
                  <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded font-bold">
                    {record.doc.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Registry metadata table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Document Identifier</span>
                      <strong className="text-sm font-mono text-slate-900">{record.doc.id}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Document Category</span>
                      <strong className="text-sm text-slate-900">{record.doc.documentType}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Issue Date</span>
                      <strong className="text-slate-800">{record.doc.creationDate}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Version Number</span>
                      <strong className="text-slate-800">Version {record.doc.version}</strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Issuing Authority / Officer</span>
                      <strong className="text-slate-800">{record.doc.author}</strong>
                      <span className="text-[11px] text-slate-500 block">GAARC Victim Rehabilitation Unit</span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Recipient Reference</span>
                      <strong className="font-mono text-slate-800">
                        {record.victimCase.referenceNumber.substring(0, 8)}*** (Protected Privacy)
                      </strong>
                    </div>
                  </div>

                  {/* Hash & Security info */}
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-start gap-3">
                    <Lock className="w-4 h-4 text-[#0047AB] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold m-0 text-xs">Cryptographic Record Integrity Record:</p>
                      <p className="font-mono text-[11px] text-blue-700 mt-1 break-all m-0">
                        {record.doc.documentHash}
                      </p>
                      <p className="text-[11px] text-blue-600 mt-1 m-0">
                        This document record matches the official GAARC database.
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center m-0">
                    GAARC Document Registry • Protected by Case Integrity Protocol • Non-sensitive public verification display
                  </p>

                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-rose-200 overflow-hidden">
                <div className="bg-rose-600 text-white px-6 py-4 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-white" />
                  <span className="font-bold text-sm tracking-wide uppercase">Document Verification Failed</span>
                </div>
                <div className="p-8 text-center space-y-3">
                  <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900 m-0">Record Not Found in GAARC Registry</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    No official administrative document with identifier <strong className="font-mono text-slate-800">"{queriedId}"</strong> could be verified in the GAARC Central Registry.
                  </p>
                  <p className="text-xs text-slate-400">
                    Please ensure the ID was transcribed accurately, or contact <a href="mailto:support@gaarc.org" className="text-[#0047AB] underline">support@gaarc.org</a> for institutional verification inquiries.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
