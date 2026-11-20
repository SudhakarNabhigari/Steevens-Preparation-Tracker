import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import { ResourceCategory, ResourceItem } from '../types';
import {
  BookOpen,
  Plus,
  Search,
  ExternalLink,
  Star,
  CheckCircle2,
  Trash2,
  Edit2,
  Tag,
  Calendar,
  Layers,
  Filter,
  FileText,
  AlertCircle,
  X,
  Save,
  Clock,
  Sparkles,
  Lock,
  RefreshCw
} from 'lucide-react';

const CATEGORIES: ResourceCategory[] = [
  'Official Documentation',
  'Research Papers',
  'YouTube Videos',
  'Tutorials',
  'Learning Websites',
  'Technical Blogs',
  'Personal Notes',
  'Other Resources'
];

export const ResourceLibraryPage: React.FC = () => {
  const {
    state,
    addResource,
    updateResource,
    deleteResource,
    toggleResourceImportant,
    toggleResourceCompleted,
    saveResourceNotes,
    refreshSharedContent,
    userRole,
    setSelectedDayNumber,
    setCurrentPage
  } = useApp();

  const isOwner = userRole === 'owner';
  const resources: ResourceItem[] = state.resources || [];
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncLatest = async () => {
    setIsSyncing(true);
    await refreshSharedContent();
    setTimeout(() => setIsSyncing(false), 300);
  };

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('all');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [filterImportantOnly, setFilterImportantOnly] = useState(false);
  const [filterCompletedOnly, setFilterCompletedOnly] = useState(false);

  // Grouping view: 'list' | 'week' | 'day' | 'category' | 'topic'
  const [groupBy, setGroupBy] = useState<'list' | 'week' | 'day' | 'category'>('list');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form input states
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formCategory, setFormCategory] = useState<ResourceCategory>('Official Documentation');
  const [formDay, setFormDay] = useState<number>(1);
  const [formWeek, setFormWeek] = useState<number>(1);
  const [formTopic, setFormTopic] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formImportant, setFormImportant] = useState(false);
  const [formError, setFormError] = useState('');

  // Editing notes inline
  const [activeNotesId, setActiveNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  // Collect all unique tags for tag filter
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    resources.forEach(r => (r.tags || []).forEach(t => tagsSet.add(t.trim().toLowerCase())));
    return Array.from(tagsSet).sort();
  }, [resources]);

  // Add or edit within the active role's isolated library.
  const handleOpenAdd = () => {
    setEditingResource(null);
    setFormTitle('');
    setFormUrl('');
    setFormCategory('Official Documentation');
    setFormDay(1);
    setFormWeek(1);
    setFormTopic(ALL_180_DAYS[0]?.topic || '');
    setFormDescription('');
    setFormNotes('');
    setFormTags('');
    setFormImportant(false);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (res: ResourceItem) => {
    setEditingResource(res);
    setFormTitle(res.title);
    setFormUrl(res.url);
    setFormCategory(res.category);
    setFormDay(res.relatedDay);
    setFormWeek(res.relatedWeek);
    setFormTopic(res.relatedTopic);
    setFormDescription(res.shortDescription);
    setFormNotes(res.personalNotes);
    setFormTags((res.tags || []).join(', '));
    setFormImportant(res.isImportant);
    setFormError('');
    setIsModalOpen(true);
  };

  // Auto-fill topic when Day changes in form
  const handleFormDayChange = (dayNum: number) => {
    const cleanDay = Math.max(1, Math.min(180, dayNum));
    setFormDay(cleanDay);
    const calculatedWeek = Math.min(26, Math.max(1, Math.ceil(cleanDay / 7)));
    setFormWeek(calculatedWeek);
    const daySchedule = ALL_180_DAYS[cleanDay - 1];
    if (daySchedule) {
      setFormTopic(daySchedule.topic);
    }
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim()) {
      setFormError('Please enter a title for the resource.');
      return;
    }
    if (!formUrl.trim()) {
      setFormError('Please enter a URL for the resource.');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    if (editingResource) {
      updateResource(editingResource.id, {
        title: formTitle.trim(),
        url: formUrl.trim(),
        category: formCategory,
        relatedDay: formDay,
        relatedWeek: formWeek,
        relatedTopic: formTopic.trim() || ALL_180_DAYS[formDay - 1]?.topic || '',
        shortDescription: formDescription.trim(),
        personalNotes: formNotes.trim(),
        tags: tagsArray,
        isImportant: formImportant
      });
      setIsModalOpen(false);
    } else {
      const res = addResource({
        title: formTitle.trim(),
        url: formUrl.trim(),
        category: formCategory,
        relatedDay: formDay,
        relatedWeek: formWeek,
        relatedTopic: formTopic.trim() || ALL_180_DAYS[formDay - 1]?.topic || '',
        shortDescription: formDescription.trim(),
        personalNotes: formNotes.trim(),
        tags: tagsArray,
        isImportant: formImportant,
        isCompleted: false
      });

      if (!res.success) {
        setFormError(res.message);
        return;
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteResource(id);
    setDeleteConfirmId(null);
  };

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter(item => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = (item.shortDescription || '').toLowerCase().includes(q);
        const matchesTopic = (item.relatedTopic || '').toLowerCase().includes(q);
        const matchesNotes = (item.personalNotes || '').toLowerCase().includes(q);
        const matchesTags = (item.tags || []).some(t => t.includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTopic && !matchesNotes && !matchesTags) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Week
      if (selectedWeekFilter !== 'all' && item.relatedWeek !== Number(selectedWeekFilter)) {
        return false;
      }

      // Day
      if (selectedDayFilter !== 'all' && item.relatedDay !== Number(selectedDayFilter)) {
        return false;
      }

      // Tag
      if (selectedTagFilter !== 'all' && !(item.tags || []).map(t => t.toLowerCase()).includes(selectedTagFilter)) {
        return false;
      }

      // Important
      if (filterImportantOnly && !item.isImportant) {
        return false;
      }

      // Completed
      if (filterCompletedOnly && !item.isCompleted) {
        return false;
      }

      return true;
    });
  }, [
    resources,
    searchQuery,
    selectedCategory,
    selectedWeekFilter,
    selectedDayFilter,
    selectedTagFilter,
    filterImportantOnly,
    filterCompletedOnly
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E7826D] font-bold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>GENAI ENGINEER PREPARATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
            RESOURCE LIBRARY
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            {state.sharedSettings?.resourceLibraryNotice ||
              'Organize official docs, research papers, tutorials, technical blogs, and personal notes mapped across 180 days.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] active:bg-[#C85D48] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-[#E7826D]/30 transition-all uppercase tracking-wider shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource</span>
          </button>
          {!isOwner && (
            <button
              onClick={handleSyncLatest}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Refresh latest resources added by Steeven"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#E7826D] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* Guest sandbox notice */}
      {!isOwner && (
        <div className="p-4 rounded-xl bg-white border border-[#E0DCD3] text-xs text-[#78716C] flex items-start gap-3 shadow-sm">
          <Lock className="w-4 h-4 text-[#E7826D] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#292929] block">
              Guest Resource Library (Temporary Sandbox)
            </span>
            <p className="leading-relaxed">
              Changes here are saved only in this Guest preview and never change Steeven&apos;s library.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by title, topic, notes, or tags (e.g., pgvector, Attention, RRF)..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#E7826D] focus:bg-white transition-colors"
            />
          </div>

          {/* Group View Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs shrink-0">
            <span className="text-[#78716C] text-[11px] px-2 font-semibold">Group by:</span>
            {(['list', 'week', 'day', 'category'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setGroupBy(mode)}
                className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-colors cursor-pointer ${
                  groupBy === mode
                    ? 'bg-[#292929] text-white shadow-sm'
                    : 'text-[#78716C] hover:text-[#292929]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Week Filter */}
          <select
            value={selectedWeekFilter}
            onChange={(e) => setSelectedWeekFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer"
          >
            <option value="all">All Weeks</option>
            {Array.from({ length: 26 }, (_, i) => i + 1).map(wk => (
              <option key={wk} value={wk}>Week {wk}</option>
            ))}
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

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <select
              value={selectedTagFilter}
              onChange={(e) => setSelectedTagFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>#{tag}</option>
              ))}
            </select>
          )}

          {/* Important toggle */}
          <button
            onClick={() => setFilterImportantOnly(!filterImportantOnly)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer font-semibold ${
              filterImportantOnly
                ? 'bg-[#E7826D]/15 border-[#E7826D] text-[#E7826D]'
                : 'bg-[#FAF8F5] border-[#E0DCD3] text-[#78716C] hover:text-[#292929]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterImportantOnly ? 'fill-[#E7826D]' : ''}`} />
            <span>Important Only</span>
          </button>

          {/* Completed toggle */}
          <button
            onClick={() => setFilterCompletedOnly(!filterCompletedOnly)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer font-semibold ${
              filterCompletedOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-[#FAF8F5] border-[#E0DCD3] text-[#78716C] hover:text-[#292929]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Reviewed Only</span>
          </button>

          {(selectedCategory !== 'all' || selectedWeekFilter !== 'all' || selectedDayFilter !== 'all' || selectedTagFilter !== 'all' || filterImportantOnly || filterCompletedOnly || searchQuery.trim()) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedWeekFilter('all');
                setSelectedDayFilter('all');
                setSelectedTagFilter('all');
                setFilterImportantOnly(false);
                setFilterCompletedOnly(false);
              }}
              className="text-[#E7826D] hover:underline text-xs font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Count Indicator */}
      <div className="flex items-center justify-between text-xs text-[#78716C] px-1">
        <span>Showing <strong className="text-[#292929]">{filteredResources.length}</strong> of {resources.length} saved resources</span>
        {!isOwner && (
          <span className="text-[#E7826D] font-semibold">Temporary Guest Library · isolated from Owner</span>
        )}
      </div>

      {/* Main Content Area */}
      {resources.length === 0 ? (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#E0DCD3] text-[#E7826D] flex items-center justify-center mx-auto shadow-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#292929]">No Learning Resources Added Yet</h3>
            <p className="text-xs text-[#78716C] max-w-md mx-auto">
              Bookmark official docs, research papers, YouTube videos, and architecture guides mapped to your preparation schedule.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-[#E7826D]/30 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Resource</span>
          </button>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-8 text-center text-xs text-[#78716C]">
          No resources match the selected search or filter criteria.
        </div>
      ) : (
        /* Render according to grouping */
        <div className="space-y-4">
          {filteredResources.map(res => (
            <div
              key={res.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
                res.isImportant ? 'border-[#E7826D]/50' : 'border-[#E0DCD3]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#292929] font-semibold border border-[#E0DCD3]">
                      {res.category}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedDayNumber(res.relatedDay);
                        setCurrentPage('today_work');
                      }}
                      className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#E0DCD3] text-[#E7826D] font-mono font-bold border border-[#E0DCD3] cursor-pointer"
                      title="Jump to this Day's preparation"
                    >
                      Day {res.relatedDay} (Week {res.relatedWeek})
                    </button>
                    {res.isImportant && (
                      <span className="px-2 py-0.5 rounded-md bg-[#E7826D]/15 text-[#E7826D] font-bold text-[10px] flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#E7826D]" />
                        <span>IMPORTANT</span>
                      </span>
                    )}
                    {res.isCompleted && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                        <span>REVIEWED</span>
                      </span>
                    )}
                  </div>

                  {/* Title & External Link */}
                  <div className="flex items-start gap-2 pt-1">
                    <h3 className="text-base font-bold text-[#292929] leading-snug">
                      {res.title}
                    </h3>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded-lg text-[#78716C] hover:text-[#E7826D] hover:bg-[#FAF8F5] transition-colors shrink-0"
                      title="Open external link in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* URL */}
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#78716C] hover:text-[#292929] hover:underline font-mono line-clamp-1 block"
                  >
                    {res.url}
                  </a>

                  {/* Related Topic */}
                  {res.relatedTopic && (
                    <div className="text-xs text-[#78716C] pt-1">
                      <span className="font-semibold text-[#292929]">Syllabus Topic: </span>
                      <span>{res.relatedTopic}</span>
                    </div>
                  )}

                  {/* Description */}
                  {res.shortDescription && (
                    <p className="text-xs text-[#78716C] pt-1 leading-relaxed">
                      {res.shortDescription}
                    </p>
                  )}

                  {/* Tags */}
                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {res.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E0DCD3] text-[11px] font-mono text-[#78716C]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Personal Notes Display & Edit Toggle */}
                  {res.personalNotes && (
                    <div className="mt-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-xs space-y-1">
                      <div className="flex items-center justify-between text-[#78716C] font-semibold text-[11px]">
                        <span className="flex items-center gap-1 text-[#292929]">
                          <FileText className="w-3.5 h-3.5 text-[#E7826D]" />
                          <span>Personal Notes</span>
                        </span>
                        <button
                          onClick={() => {
                            setActiveNotesId(activeNotesId === res.id ? null : res.id);
                            setNotesDraft(res.personalNotes);
                          }}
                          className="hover:underline text-[#E7826D] cursor-pointer"
                        >
                          {activeNotesId === res.id ? 'Cancel' : 'Edit Note'}
                        </button>
                      </div>

                      {activeNotesId === res.id ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            value={notesDraft}
                            onChange={(e) => setNotesDraft(e.target.value)}
                            rows={3}
                            className="w-full p-2 bg-white border border-[#E0DCD3] rounded-lg text-xs text-[#292929] focus:outline-none focus:border-[#E7826D]"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                saveResourceNotes(res.id, notesDraft.trim());
                                setActiveNotesId(null);
                              }}
                              className="px-3 py-1 bg-[#292929] hover:bg-[#404040] text-white rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#292929] whitespace-pre-line leading-relaxed">
                          {res.personalNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions modify only the signed-in role's local state. */}
                <div className="flex sm:flex-col items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E0DCD3]">
                    {/* Important Toggle */}
                    <button
                      onClick={() => toggleResourceImportant(res.id)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        res.isImportant
                          ? 'bg-[#E7826D]/15 border-[#E7826D] text-[#E7826D]'
                          : 'bg-white border-[#E0DCD3] text-[#A8A29E] hover:text-[#292929]'
                      }`}
                      title={res.isImportant ? 'Unmark important' : 'Mark as important'}
                    >
                      <Star className={`w-4 h-4 ${res.isImportant ? 'fill-[#E7826D]' : ''}`} />
                    </button>

                    {/* Completed / Reviewed Toggle */}
                    <button
                      onClick={() => toggleResourceCompleted(res.id)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        res.isCompleted
                          ? 'bg-emerald-50 border-emerald-300 text-[#16A34A]'
                          : 'bg-white border-[#E0DCD3] text-[#A8A29E] hover:text-[#16A34A]'
                      }`}
                      title={res.isCompleted ? 'Mark as not reviewed' : 'Mark as completed/reviewed'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEdit(res)}
                      className="p-2 rounded-lg bg-white border border-[#E0DCD3] text-[#78716C] hover:text-[#292929] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                      title="Edit resource"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmId(res.id)}
                      className="p-2 rounded-lg bg-white border border-[#E0DCD3] text-[#78716C] hover:text-[#DC2626] hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#292929]/70 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-3">
              <h2 className="text-base font-bold text-[#292929]">
                {editingResource ? 'Edit Learning Resource' : 'Add New Learning Resource'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#78716C] hover:text-[#292929]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveResource} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#292929] mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Attention Is All You Need (Original Paper)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#292929] mb-1">
                  Resource URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://arxiv.org/abs/1706.03762"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] font-mono focus:outline-none focus:border-[#E7826D] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#292929] mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ResourceCategory)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#292929] mb-1">
                    Related Preparation Day (1–180)
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
                  placeholder="Auto-detected or customized topic"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#292929] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Key concepts covered, why this is valuable..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#292929] mb-1">
                  Personal Study Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Personal takeaways, implementation formulas, architecture notes..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold text-[#292929] mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="rag, embeddings, transformers"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formImportant}
                      onChange={(e) => setFormImportant(e.target.checked)}
                      className="rounded border-[#E0DCD3] text-[#E7826D] focus:ring-[#E7826D] w-4 h-4"
                    />
                    <span className="font-semibold text-[#292929]">Mark as High Priority / Important</span>
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
                  {editingResource ? 'Update Resource' : 'Save Resource'}
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
                <h3 className="text-base font-bold text-[#292929]">Delete Resource</h3>
                <p className="text-xs text-[#78716C]">
                  Are you sure you want to remove this resource from your permanent library?
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
