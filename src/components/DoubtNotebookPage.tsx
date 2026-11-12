import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import { ProblemType, DoubtStatus, DoubtEntry } from '../types';
import {
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  Trash2,
  Edit2,
  Tag,
  Code,
  FileText,
  AlertCircle,
  X,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Terminal,
  Bookmark
} from 'lucide-react';

const PROBLEM_TYPES: ProblemType[] = [
  'Coding Error',
  'Python Error',
  'SQL Error',
  'ML/Deep Learning Doubt',
  'RAG/LLM Doubt',
  'API/Backend Error',
  'Deployment Error',
  'Conceptual Doubt',
  'Other'
];

export const DoubtNotebookPage: React.FC = () => {
  const {
    state,
    addDoubtEntry,
    updateDoubtEntry,
    deleteDoubtEntry,
    setDoubtStatus,
    toggleDoubtNeedsRevision,
    saveDoubtAdditionalNotes,
    userRole,
    setSelectedDayNumber,
    setCurrentPage
  } = useApp();

  const isOwner = userRole === 'owner';
  const entries: DoubtEntry[] = state.doubtEntries || [];

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'revisit' | 'solved'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DoubtEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Expanded cards
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form input states
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<ProblemType>('Coding Error');
  const [formTech, setFormTech] = useState('');
  const [formErrorMsg, setFormErrorMsg] = useState('');
  const [formCodeSnippet, setFormCodeSnippet] = useState('');
  const [formExplanation, setFormExplanation] = useState('');
  const [formRootCause, setFormRootCause] = useState('');
  const [formSolution, setFormSolution] = useState('');
  const [formDay, setFormDay] = useState<number>(1);
  const [formTopic, setFormTopic] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formStatus, setFormStatus] = useState<DoubtStatus>('unresolved');
  const [formNeedsRevision, setFormNeedsRevision] = useState(false);
  const [formAdditionalNotes, setFormAdditionalNotes] = useState('');
  const [formValidationMsg, setFormValidationMsg] = useState('');

  // Inline notes editing
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  // Collect all unique technologies for filter dropdown
  const allTechs = useMemo(() => {
    const techSet = new Set<string>();
    entries.forEach(e => {
      if (e.technology && e.technology.trim()) {
        techSet.add(e.technology.trim());
      }
    });
    return Array.from(techSet).sort();
  }, [entries]);

  // Real Counts calculated from actual records
  const totalCount = entries.length;
  const unresolvedCount = entries.filter(e => e.status === 'unresolved').length;
  const inProgressCount = entries.filter(e => e.status === 'in_progress').length;
  const solvedCount = entries.filter(e => e.status === 'solved').length;
  const pendingRevisionCount = entries.filter(e => e.needsRevision).length;

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormTitle('');
    setFormType('Coding Error');
    setFormTech('');
    setFormErrorMsg('');
    setFormCodeSnippet('');
    setFormExplanation('');
    setFormRootCause('');
    setFormSolution('');
    setFormDay(1);
    setFormTopic(ALL_180_DAYS[0]?.topic || '');
    setFormTags('');
    setFormStatus('unresolved');
    setFormNeedsRevision(false);
    setFormAdditionalNotes('');
    setFormValidationMsg('');
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (entry: DoubtEntry) => {
    setEditingEntry(entry);
    setFormTitle(entry.title);
    setFormType(entry.problemType);
    setFormTech(entry.technology);
    setFormErrorMsg(entry.errorMessage);
    setFormCodeSnippet(entry.codeSnippet || '');
    setFormExplanation(entry.explanation);
    setFormRootCause(entry.rootCause);
    setFormSolution(entry.solution);
    setFormDay(entry.relatedDay);
    setFormTopic(entry.relatedTopic);
    setFormTags((entry.tags || []).join(', '));
    setFormStatus(entry.status);
    setFormNeedsRevision(entry.needsRevision);
    setFormAdditionalNotes(entry.additionalNotes || '');
    setFormValidationMsg('');
    setIsModalOpen(true);
  };

  const handleFormDayChange = (dayNum: number) => {
    const cleanDay = Math.max(1, Math.min(180, dayNum));
    setFormDay(cleanDay);
    const daySchedule = ALL_180_DAYS[cleanDay - 1];
    if (daySchedule) {
      setFormTopic(daySchedule.topic);
    }
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationMsg('');

    if (!formTitle.trim()) {
      setFormValidationMsg('Please enter a title for the error or doubt.');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    if (editingEntry) {
      updateDoubtEntry(editingEntry.id, {
        title: formTitle.trim(),
        problemType: formType,
        technology: formTech.trim(),
        errorMessage: formErrorMsg.trim(),
        codeSnippet: formCodeSnippet.trim(),
        explanation: formExplanation.trim(),
        rootCause: formRootCause.trim(),
        solution: formSolution.trim(),
        relatedDay: formDay,
        relatedTopic: formTopic.trim() || ALL_180_DAYS[formDay - 1]?.topic || '',
        tags: tagsArray,
        status: formStatus,
        needsRevision: formNeedsRevision,
        additionalNotes: formAdditionalNotes.trim()
      });
      setIsModalOpen(false);
    } else {
      addDoubtEntry({
        title: formTitle.trim(),
        problemType: formType,
        technology: formTech.trim(),
        errorMessage: formErrorMsg.trim(),
        codeSnippet: formCodeSnippet.trim(),
        explanation: formExplanation.trim(),
        rootCause: formRootCause.trim(),
        solution: formSolution.trim(),
        relatedDay: formDay,
        relatedTopic: formTopic.trim() || ALL_180_DAYS[formDay - 1]?.topic || '',
        tags: tagsArray,
        status: formStatus,
        needsRevision: formNeedsRevision,
        additionalNotes: formAdditionalNotes.trim()
      });
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteDoubtEntry(id);
    setDeleteConfirmId(null);
  };

  // Reopen solved entry
  const handleReopen = (id: string) => {
    setDoubtStatus(id, 'unresolved');
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter(item => {
      // Tab filter
      if (activeTab === 'revisit') {
        if (!item.needsRevision && item.status === 'solved') return false;
      } else if (activeTab === 'solved') {
        if (item.status !== 'solved') return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMsg = (item.errorMessage || '').toLowerCase().includes(q);
        const matchesExpl = (item.explanation || '').toLowerCase().includes(q);
        const matchesCause = (item.rootCause || '').toLowerCase().includes(q);
        const matchesSol = (item.solution || '').toLowerCase().includes(q);
        const matchesTech = (item.technology || '').toLowerCase().includes(q);
        const matchesTags = (item.tags || []).some(t => t.includes(q));
        if (!matchesTitle && !matchesMsg && !matchesExpl && !matchesCause && !matchesSol && !matchesTech && !matchesTags) {
          return false;
        }
      }

      // Problem Type
      if (selectedType !== 'all' && item.problemType !== selectedType) {
        return false;
      }

      // Technology
      if (selectedTech !== 'all' && item.technology !== selectedTech) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      // Day
      if (selectedDayFilter !== 'all' && item.relatedDay !== Number(selectedDayFilter)) {
        return false;
      }

      return true;
    });
  }, [entries, activeTab, searchQuery, selectedType, selectedTech, selectedStatus, selectedDayFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E7826D] font-bold mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>DEBUGGING & CONCEPTUAL MASTERY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
            DOUBT & ERROR NOTEBOOK
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Log coding errors, root causes, technical solutions, and unresolved questions to build deep intuition.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] active:bg-[#C85D48] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-[#E7826D]/30 transition-all uppercase tracking-wider shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Doubt / Error</span>
        </button>
      </div>

      {/* Real Statistics Counters Matrix (Strictly real data from database) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-[#E0DCD3] rounded-2xl shadow-sm">
          <span className="text-xs text-[#78716C] font-semibold block mb-1">Total Entries</span>
          <span className="text-2xl font-bold font-mono text-[#292929] tabular-nums">{totalCount}</span>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">Recorded technical issues</span>
        </div>

        <div className="p-4 bg-white border border-[#E0DCD3] rounded-2xl shadow-sm">
          <span className="text-xs text-[#78716C] font-semibold block mb-1">Unresolved</span>
          <span className="text-2xl font-bold font-mono text-[#DC2626] tabular-nums">{unresolvedCount}</span>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">Awaiting solution</span>
        </div>

        <div className="p-4 bg-white border border-[#E0DCD3] rounded-2xl shadow-sm">
          <span className="text-xs text-[#78716C] font-semibold block mb-1">Solved</span>
          <span className="text-2xl font-bold font-mono text-[#16A34A] tabular-nums">{solvedCount}</span>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">Resolved with solution</span>
        </div>

        <div className="p-4 bg-white border border-[#E0DCD3] rounded-2xl shadow-sm">
          <span className="text-xs text-[#78716C] font-semibold block mb-1">Pending Revision</span>
          <span className="text-2xl font-bold font-mono text-[#E7826D] tabular-nums">{pendingRevisionCount}</span>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">Marked for Saturday review</span>
        </div>
      </div>

      {/* Primary Section Tabs: All Entries vs "Problems to Revisit" vs "Solved" */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-[#E0DCD3] rounded-xl text-xs shadow-sm">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#292929] text-white shadow-sm'
              : 'text-[#78716C] hover:text-[#292929]'
          }`}
        >
          All Entries ({totalCount})
        </button>

        <button
          onClick={() => setActiveTab('revisit')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'revisit'
              ? 'bg-[#E7826D] text-white shadow-sm'
              : 'text-[#E7826D] hover:bg-[#FAF8F5]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Problems to Revisit ({unresolvedCount + pendingRevisionCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('solved')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'solved'
              ? 'bg-[#292929] text-white shadow-sm'
              : 'text-[#78716C] hover:text-[#292929]'
          }`}
        >
          Solved Archive ({solvedCount})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search errors by message, root cause, code, or tags..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#E7826D] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Problem Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer"
          >
            <option value="all">All Problem Types</option>
            {PROBLEM_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Technology Filter */}
          {allTechs.length > 0 && (
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer"
            >
              <option value="all">All Technologies</option>
              {allTechs.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          )}

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="unresolved">Unresolved (Red)</option>
            <option value="in_progress">In Progress (Terracotta)</option>
            <option value="solved">Solved (Green)</option>
          </select>

          {/* Day Filter */}
          <select
            value={selectedDayFilter}
            onChange={(e) => setSelectedDayFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer"
          >
            <option value="all">All Days</option>
            {Array.from({ length: 180 }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>Day {d}</option>
            ))}
          </select>

          {(selectedType !== 'all' || selectedTech !== 'all' || selectedStatus !== 'all' || selectedDayFilter !== 'all' || searchQuery.trim()) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedTech('all');
                setSelectedStatus('all');
                setSelectedDayFilter('all');
              }}
              className="text-[#E7826D] hover:underline text-xs font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#E0DCD3] text-[#E7826D] flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#292929]">No Errors or Doubts Logged Yet</h3>
            <p className="text-xs text-[#78716C] max-w-md mx-auto">
              When encountering a tricky bug, CUDA memory issue, BM25 indexing error, or conceptual uncertainty, log it here to track its root cause and solution.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-[#E7826D]/30 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Log Your First Doubt / Error</span>
          </button>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-8 text-center text-xs text-[#78716C]">
          No notebook entries match your current filter or tab.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map(entry => {
            const isExpanded = expandedId === entry.id;

            return (
              <div
                key={entry.id}
                className={`bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
                  entry.status === 'unresolved'
                    ? 'border-rose-200'
                    : entry.status === 'in_progress'
                    ? 'border-[#E7826D]/40'
                    : 'border-[#E0DCD3]'
                }`}
              >
                {/* Top strip */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          entry.status === 'solved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : entry.status === 'in_progress'
                            ? 'bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {entry.status.replace('_', ' ')}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#292929] font-semibold border border-[#E0DCD3]">
                        {entry.problemType}
                      </span>

                      {entry.technology && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#78716C] font-mono font-medium border border-[#E0DCD3]">
                          {entry.technology}
                        </span>
                      )}

                      <button
                        onClick={() => {
                          setSelectedDayNumber(entry.relatedDay);
                          setCurrentPage('today_work');
                        }}
                        className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#E0DCD3] text-[#E7826D] font-mono font-bold border border-[#E0DCD3] cursor-pointer"
                        title="Jump to this Day"
                      >
                        Day {entry.relatedDay}
                      </button>

                      {entry.needsRevision && (
                        <span className="px-2 py-0.5 rounded-md bg-[#E7826D]/15 text-[#E7826D] font-bold text-[10px] flex items-center gap-1">
                          <Bookmark className="w-3 h-3" />
                          <span>NEEDS REVISION</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#292929] pt-0.5">
                      {entry.title}
                    </h3>

                    {/* Related Topic */}
                    {entry.relatedTopic && (
                      <p className="text-xs text-[#78716C]">
                        <strong className="text-[#292929] font-medium">Topic: </strong>
                        <span>{entry.relatedTopic}</span>
                      </p>
                    )}
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Status switcher dropdown / toggle */}
                    <select
                      value={entry.status}
                      onChange={(e) => setDoubtStatus(entry.id, e.target.value as DoubtStatus)}
                      className="px-2.5 py-1 bg-[#FAF8F5] border border-[#E0DCD3] rounded-lg text-xs font-semibold text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer"
                    >
                      <option value="unresolved">Unresolved</option>
                      <option value="in_progress">In Progress</option>
                      <option value="solved">Solved</option>
                    </select>

                    {/* Toggle Needs Revision */}
                    <button
                      onClick={() => toggleDoubtNeedsRevision(entry.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        entry.needsRevision
                          ? 'bg-[#E7826D]/15 border-[#E7826D] text-[#E7826D]'
                          : 'bg-white border-[#E0DCD3] text-[#A8A29E] hover:text-[#292929]'
                      }`}
                      title={entry.needsRevision ? 'Unmark revision' : 'Mark for Saturday revision'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${entry.needsRevision ? 'fill-[#E7826D]' : ''}`} />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEdit(entry)}
                      className="p-1.5 rounded-lg bg-white border border-[#E0DCD3] text-[#78716C] hover:text-[#292929] hover:bg-[#FAF8F5] cursor-pointer"
                      title="Edit entry"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmId(entry.id)}
                      className="p-1.5 rounded-lg bg-white border border-[#E0DCD3] text-[#78716C] hover:text-[#DC2626] hover:bg-rose-50 cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Expand/Collapse */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      className="p-1.5 rounded-lg bg-white border border-[#E0DCD3] text-[#78716C] hover:text-[#292929] cursor-pointer"
                      title={isExpanded ? 'Collapse' : 'Expand full explanation'}
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message Box if present */}
                {entry.errorMessage && (
                  <div className="mt-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] font-mono text-xs text-[#DC2626] overflow-x-auto">
                    <div className="text-[10px] font-bold uppercase text-[#78716C] mb-1 font-sans">
                      Error Output / Exception:
                    </div>
                    {entry.errorMessage}
                  </div>
                )}

                {/* Explanation preview or full body */}
                {entry.explanation && (
                  <p className={`text-xs text-[#78716C] mt-2.5 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    <strong className="text-[#292929] font-medium">Problem Summary: </strong>
                    {entry.explanation}
                  </p>
                )}

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#E0DCD3] space-y-3 text-xs">
                    {/* Code Snippet */}
                    {entry.codeSnippet && (
                      <div className="space-y-1">
                        <span className="font-semibold text-[#292929] block">Failing Code Snippet:</span>
                        <pre className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] font-mono text-xs text-[#292929] overflow-x-auto">
                          {entry.codeSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Root Cause */}
                    {entry.rootCause && (
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-1">
                        <span className="font-bold text-[#E7826D] uppercase text-[11px] block">Root Cause Analysis:</span>
                        <p className="text-xs text-[#292929] leading-relaxed whitespace-pre-line">{entry.rootCause}</p>
                      </div>
                    )}

                    {/* Solution */}
                    {entry.solution && (
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                        <span className="font-bold text-[#16A34A] uppercase text-[11px] block">Solution & Corrected Code:</span>
                        <pre className="font-mono text-xs text-[#292929] whitespace-pre-line overflow-x-auto leading-relaxed">
                          {entry.solution}
                        </pre>
                      </div>
                    )}

                    {/* Additional Notes */}
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-1">
                      <div className="flex items-center justify-between text-[#78716C] text-[11px]">
                        <span className="font-semibold text-[#292929]">Post-Resolution Notes:</span>
                        <button
                          onClick={() => {
                            setEditingNotesId(editingNotesId === entry.id ? null : entry.id);
                            setNotesDraft(entry.additionalNotes || '');
                          }}
                          className="hover:underline text-[#E7826D] cursor-pointer"
                        >
                          {editingNotesId === entry.id ? 'Cancel' : 'Edit Notes'}
                        </button>
                      </div>

                      {editingNotesId === entry.id ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            value={notesDraft}
                            onChange={(e) => setNotesDraft(e.target.value)}
                            rows={3}
                            placeholder="Add extra insights or follow-up questions..."
                            className="w-full p-2 bg-white border border-[#E0DCD3] rounded-lg text-xs text-[#292929] focus:outline-none focus:border-[#E7826D]"
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                saveDoubtAdditionalNotes(entry.id, notesDraft.trim());
                                setEditingNotesId(null);
                              }}
                              className="px-3 py-1 bg-[#292929] hover:bg-[#404040] text-white rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Save Notes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#292929] leading-relaxed">
                          {entry.additionalNotes || 'No post-resolution notes added yet.'}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Strip */}
                <div className="mt-3 pt-3 border-t border-[#E0DCD3] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#78716C]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>Logged on {new Date(entry.dateCreated).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                    {entry.tags && entry.tags.length > 0 && (
                      <span>· {entry.tags.map(t => `#${t}`).join(' ')}</span>
                    )}
                  </div>

                  {entry.status === 'solved' && (
                    <button
                      onClick={() => handleReopen(entry.id)}
                      className="text-[#E7826D] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reopen Issue</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#292929]/70 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-3">
              <h2 className="text-base font-bold text-[#292929]">
                {editingEntry ? 'Edit Doubt / Error Entry' : 'Log New Technical Doubt or Coding Error'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#78716C] hover:text-[#292929]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formValidationMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formValidationMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#292929] mb-1">
                  Title / Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. pgvector HNSW distance metric returning cosine distance vs inner product"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#292929] mb-1">
                    Problem Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ProblemType)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                  >
                    {PROBLEM_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#292929] mb-1">
                    Technology / Language
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Python, FastAPI, PostgreSQL"
                    value={formTech}
                    onChange={(e) => setFormTech(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#292929] mb-1">
                    Preparation Day (1–180)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={formDay}
                    onChange={(e) => handleFormDayChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] font-mono focus:outline-none focus:border-[#E7826D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#292929] mb-1">
                  Related Syllabus Topic
                </label>
                <input
                  type="text"
                  placeholder="Auto-filled or custom topic"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#292929] mb-1">
                  Error Message / Stack Trace (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Paste terminal exception or error output here..."
                  value={formErrorMsg}
                  onChange={(e) => setFormErrorMsg(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] font-mono focus:outline-none focus:border-[#E7826D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#292929] mb-1">
                  Code Snippet (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste snippet where the bug occurred..."
                  value={formCodeSnippet}
                  onChange={(e) => setFormCodeSnippet(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] font-mono focus:outline-none focus:border-[#E7826D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#292929] mb-1">
                  Problem Explanation
                </label>
                <textarea
                  rows={2}
                  placeholder="What was intended, what actually happened, and what makes it confusing..."
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#292929] mb-1">
                    Root Cause
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Why did this happen? (e.g. vector dimension mismatch, unindexed column)..."
                    value={formRootCause}
                    onChange={(e) => setFormRootCause(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#292929] mb-1">
                    Solution or Corrected Code
                  </label>
                  <textarea
                    rows={3}
                    placeholder="How was this fixed? Correct syntax or architectural adjustment..."
                    value={formSolution}
                    onChange={(e) => setFormSolution(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] font-mono focus:outline-none focus:border-[#E7826D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block font-semibold text-[#292929] mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as DoubtStatus)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                  >
                    <option value="unresolved">Unresolved</option>
                    <option value="in_progress">In Progress</option>
                    <option value="solved">Solved</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#292929] mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="rag, celery, redis, sql"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formNeedsRevision}
                      onChange={(e) => setFormNeedsRevision(e.target.checked)}
                      className="rounded border-[#E0DCD3] text-[#E7826D] focus:ring-[#E7826D] w-4 h-4"
                    />
                    <span className="font-semibold text-[#292929]">Flag for Revision Review</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E0DCD3]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-[#292929] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white font-bold cursor-pointer shadow-md shadow-[#E7826D]/30 uppercase tracking-wider"
                >
                  {editingEntry ? 'Update Entry' : 'Save Doubt Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-[#292929]/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#DC2626] flex items-center justify-center shrink-0 border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#292929]">Delete Entry</h3>
                <p className="text-xs text-[#78716C]">
                  Are you sure you want to remove this error/doubt entry from your notebook?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-[#292929] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
