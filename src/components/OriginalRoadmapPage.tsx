import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RETAINED_REFERENCES, ALL_180_DAYS } from '../data/syllabus';
import {
  FileText,
  Search,
  CheckCircle2
} from 'lucide-react';

export const OriginalRoadmapPage: React.FC = () => {
  const { setSelectedDayNumber, setCurrentPage } = useApp();
  const [activeTab, setActiveTab] = useState<'audit' | 'api' | 'db' | 'stack' | 'security' | 'capstone' | 'rhythm' | 'readiness'>('audit');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive search across all 180 days and retained references
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    return ALL_180_DAYS.filter(d => {
      return (
        d.topic.toLowerCase().includes(q) ||
        d.subtopics.some(s => s.toLowerCase().includes(q)) ||
        d.output.toLowerCase().includes(q) ||
        d.deliverable.toLowerCase().includes(q) ||
        d.moduleTitle.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const audit = RETAINED_REFERENCES.contentAudit;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#E0DCD3]">
        <div className="flex items-center gap-2 text-xs text-[#E7826D] font-bold mb-1">
          <FileText className="w-4 h-4" />
          <span>SINGLE SOURCE OF TRUTH · 20-PAGE COMPLETE SYLLABUS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
          ORIGINAL ROADMAP & 100% CONTENT AUDIT
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1">
          Full extracted source syllabus from FINAL_RAG_180_DAY_COMPLETE_LEARNING_SYLLABUS.pdf with complete traceability mapping.
        </p>
      </div>

      {/* Global Search Bar */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any keyword to find its exact Day, Module, and PDF Page (e.g. pgvector, BM25, RRF, Ragas, Celery, parent-child)..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#E7826D] focus:bg-white transition-colors"
          />
        </div>

        {/* Live Search Results Drawer if user typed query */}
        {searchQuery.trim() && (
          <div className="mt-4 pt-4 border-t border-[#E0DCD3] space-y-2 max-h-80 overflow-y-auto">
            <span className="text-xs font-semibold text-[#E7826D] block">
              Found {searchResults.length} matching schedule days:
            </span>

            {searchResults.length === 0 ? (
              <p className="text-xs text-[#78716C] py-2">No matching topics found in the 180-day syllabus.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {searchResults.map(match => (
                  <button
                    key={match.dayNumber}
                    onClick={() => {
                      setSelectedDayNumber(match.dayNumber);
                      setCurrentPage('today_work');
                    }}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] hover:border-[#E7826D] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-[#E7826D]">Day {match.dayNumber} ({match.dateString})</span>
                      <span className="text-[10px] text-[#78716C]">PDF Page {match.pdfPage}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#292929] block group-hover:text-[#E7826D]">{match.topic}</span>
                    <span className="text-[11px] text-[#78716C] line-clamp-1 mt-0.5">{match.subtopics.join(', ')}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Retained Reference Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-[#E0DCD3] rounded-xl overflow-x-auto text-xs shadow-sm">
        {[
          { id: 'audit', label: '100% Content Audit' },
          { id: 'api', label: 'API Contract (Page 6)' },
          { id: 'db', label: 'Database Entities (Page 6)' },
          { id: 'stack', label: 'Tech Stack (Page 7)' },
          { id: 'security', label: 'Security & Quality (Page 8)' },
          { id: 'capstone', label: 'Capstone & Rubric (Page 9)' },
          { id: 'rhythm', label: 'Mentor Questions (Page 10)' },
          { id: 'readiness', label: 'Readiness Checklist (Page 20)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#292929] text-white shadow-sm'
                : 'text-[#78716C] hover:text-[#292929] hover:bg-[#FAF8F5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Content Audit Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#292929]">Source-Content Coverage Audit</h2>
              <p className="text-xs text-[#78716C] mt-1">
                Audited against FINAL_RAG_180_DAY_COMPLETE_LEARNING_SYLLABUS.pdf (Pages 1 through 20).
              </p>
            </div>

            {/* Audit Numbers Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Total PDF Pages</span>
                <span className="text-xl font-bold font-mono text-[#292929] tabular-nums">{audit.totalPages}</span>
              </div>
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Extracted Items</span>
                <span className="text-xl font-bold font-mono text-[#E7826D] tabular-nums">{audit.extractedItemsCount}</span>
              </div>
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Assigned to Days</span>
                <span className="text-xl font-bold font-mono text-[#16A34A] tabular-nums">{audit.assignedDaysCount}</span>
              </div>
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Retained Ref Items</span>
                <span className="text-xl font-bold font-mono text-[#292929] tabular-nums">{audit.retainedReferenceItemsCount}</span>
              </div>
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Unassigned Items</span>
                <span className="text-xl font-bold font-mono text-[#16A34A] tabular-nums">{audit.unassignedItemsCount}</span>
              </div>
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[11px] text-emerald-800 block mb-1 font-bold">Final Coverage</span>
                <span className="text-xl font-extrabold font-mono text-[#16A34A] tabular-nums">{audit.coveragePercentage}%</span>
              </div>
            </div>

            {/* Two Complete Pipelines Box from Source Page 2 */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-3 text-xs">
              <span className="font-bold text-[#292929] uppercase tracking-wider block">
                Two Complete Pipelines Retained from Source (Page 2):
              </span>

              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-white border border-[#E0DCD3]">
                  <span className="font-bold text-[#292929] block mb-1">(1) Document Ingestion Pipeline:</span>
                  <p className="font-mono text-[#78716C] leading-relaxed">{RETAINED_REFERENCES.twoPipelines.ingestion}</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-[#E0DCD3]">
                  <span className="font-bold text-[#292929] block mb-1">(2) Question Answering Pipeline:</span>
                  <p className="font-mono text-[#78716C] leading-relaxed">{RETAINED_REFERENCES.twoPipelines.qa}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7826D]/40 text-[#292929]">
                <strong className="text-[#E7826D] font-bold">Critical Design Rule: </strong>
                {RETAINED_REFERENCES.twoPipelines.criticalRule}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. API Contract Tab */}
      {activeTab === 'api' && (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#292929]">Suggested API Contract & Endpoints</h2>
            <p className="text-xs text-[#78716C] mt-1">Source Page 6 / 16 · All 14 endpoints required for production RAG.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-[#78716C] uppercase font-mono text-[10px] border-b border-[#E0DCD3]">
                <tr>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Path</th>
                  <th className="py-2.5 px-3">Purpose</th>
                  <th className="py-2.5 px-3">Authorization</th>
                  <th className="py-2.5 px-3">Response Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DCD3] font-mono">
                {RETAINED_REFERENCES.coreApiEndpoints.map((ep, i) => (
                  <tr key={i} className="hover:bg-[#FAF8F5]">
                    <td className="py-2 px-3 font-bold text-[#E7826D]">{ep.method}</td>
                    <td className="py-2 px-3 text-[#292929]">{ep.path}</td>
                    <td className="py-2 px-3 font-sans text-[#78716C]">{ep.purpose}</td>
                    <td className="py-2 px-3 text-[#78716C] font-sans">{ep.auth}</td>
                    <td className="py-2 px-3 text-[#16A34A] font-bold">{ep.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Database Entities Tab */}
      {activeTab === 'db' && (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#292929]">Core Database Entities & Relationships</h2>
            <p className="text-xs text-[#78716C] mt-1">Source Page 6 / 16 · PostgreSQL multi-tenant schema.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RETAINED_REFERENCES.coreDatabaseEntities.map((ent, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-2">
                <span className="font-mono text-sm font-bold text-[#E7826D] block">{ent.entity}</span>
                <div className="text-xs text-[#292929]">
                  <span className="text-[#78716C] font-medium">Fields: </span>
                  <span className="font-mono text-[#292929]">{ent.fields.join(', ')}</span>
                </div>
                <p className="text-xs text-[#78716C]">{ent.notes}</p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7826D]/40 text-xs text-[#292929]">
            <strong className="text-[#E7826D] font-bold">Vector Payload Rule: </strong>
            {RETAINED_REFERENCES.vectorPayloadRequirement}
          </div>
        </div>
      )}

      {/* 4. Tech Stack & Early Mistakes Tab */}
      {activeTab === 'stack' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#292929]">Recommended Stack & Learning Boundaries (Source Page 7 / 16)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-[#78716C] uppercase font-mono text-[10px] border-b border-[#E0DCD3]">
                  <tr>
                    <th className="py-2.5 px-3">Layer</th>
                    <th className="py-2.5 px-3">Primary Choice</th>
                    <th className="py-2.5 px-3">Rationale & Alternatives</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DCD3]">
                  {RETAINED_REFERENCES.recommendedStack.map((stk, i) => (
                    <tr key={i} className="hover:bg-[#FAF8F5]">
                      <td className="py-2.5 px-3 font-semibold text-[#292929]">{stk.layer}</td>
                      <td className="py-2.5 px-3 font-mono text-[#E7826D] font-bold">{stk.choice}</td>
                      <td className="py-2.5 px-3 text-[#78716C]">{stk.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Early Mistakes to Avoid */}
          <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-[#DC2626]">Avoid These Early Mistakes (Source Page 7 / 17)</h2>
            <div className="space-y-2">
              {RETAINED_REFERENCES.earlyMistakesToAvoid.map((mistake, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#292929]">
                  <span className="text-[#DC2626] font-bold shrink-0 mt-0.5">•</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Security & Quality Targets Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#292929]">Evaluation Dimensions (Source Page 8 / 17)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-[#78716C] uppercase font-mono text-[10px] border-b border-[#E0DCD3]">
                  <tr>
                    <th className="py-2.5 px-3">Area</th>
                    <th className="py-2.5 px-3">What to Measure / Inspect</th>
                    <th className="py-2.5 px-3">Example Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DCD3]">
                  {RETAINED_REFERENCES.evaluationDimensions.map((dim, i) => (
                    <tr key={i} className="hover:bg-[#FAF8F5]">
                      <td className="py-2.5 px-3 font-bold text-[#E7826D]">{dim.area}</td>
                      <td className="py-2.5 px-3 text-[#292929]">{dim.measure}</td>
                      <td className="py-2.5 px-3 text-[#78716C] font-mono text-[11px]">{dim.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Minimum Security Requirements */}
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-[#292929]">Minimum Security Requirements (Source Page 8 / 17)</h2>
            <div className="space-y-2">
              {RETAINED_REFERENCES.minimumSecurityRequirements.map((sec, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#292929]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{sec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Capstone & Rubric Tab */}
      {activeTab === 'capstone' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#292929]">Final Capstone: Enterprise AI Knowledge Assistant</h2>
            <p className="text-xs text-[#78716C]">
              Business Scenario: Employees search internal policies, product manuals, technical documentation and process guides through a secure AI assistant.
            </p>

            <h3 className="text-sm font-semibold text-[#292929] pt-2">Required User-Facing Screens (Source Page 9 / 18):</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RETAINED_REFERENCES.capstoneScreens.map((scr, i) => (
                <div key={i} className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl space-y-1">
                  <span className="text-xs font-bold text-[#E7826D] block">{scr.screen}</span>
                  <span className="text-xs text-[#78716C] block">{scr.functionality}</span>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-[#292929] pt-4">Capstone Grading Rubric (Weights summing to 100%):</h3>
            <div className="space-y-2">
              {RETAINED_REFERENCES.capstoneGradingRubric.map((rub, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] text-xs">
                  <span className="text-[#292929] font-medium">{rub.category}</span>
                  <span className="font-mono font-bold text-[#E7826D]">{rub.weight}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Mentor Rhythm Tab */}
      {activeTab === 'rhythm' && (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#292929]">Mentor Checkpoint Questions (Source Page 10 / 19)</h2>
          <p className="text-xs text-[#78716C]">
            During Saturday reviews and the final viva, the candidate must answer these 6 core checkpoint questions without reading notes.
          </p>

          <div className="space-y-3 pt-2">
            {RETAINED_REFERENCES.mentorQuestions.map((q, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-xs text-[#292929] flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#E0DCD3] text-[#E7826D] font-mono font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="font-medium pt-0.5">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Readiness Checklist Tab */}
      {activeTab === 'readiness' && (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#292929]">Acceptance and Readiness Checklist (Source Page 20)</h2>
          <p className="text-xs text-[#78716C]">
            The 14 explicit acceptance criteria required before presenting the capstone and declaring production readiness.
          </p>

          <div className="space-y-2.5 pt-2">
            {RETAINED_REFERENCES.readinessChecklist.map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-xs text-[#292929] flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
