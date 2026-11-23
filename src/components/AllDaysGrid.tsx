import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import {
  Search,
  ChevronRight
} from 'lucide-react';

export const AllDaysGrid: React.FC = () => {
  const {
    currentDayNumber,
    isDayUnlocked,
    getDayStatus,
    getDayTaskCompletion,
    setSelectedDayNumber,
    setCurrentPage
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress' | 'incomplete' | 'locked'>('all');
  const days = ALL_180_DAYS;

  const filteredDays = useMemo(() => {
    return days.filter(day => {
      const status = getDayStatus(day.dayNumber);
      const unlocked = isDayUnlocked(day.dayNumber);

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTopic = day.topic.toLowerCase().includes(query);
        const matchesMod = day.moduleTitle.toLowerCase().includes(query);
        const matchesDay = `day ${day.dayNumber}`.includes(query);
        const matchesSub = unlocked && day.subtopics.some(s => s.toLowerCase().includes(query));
        const matchesOutput = unlocked && day.output.toLowerCase().includes(query);
        if (!matchesTopic && !matchesSub && !matchesOutput && !matchesMod && !matchesDay) return false;
      }

      // Module filter
      if (selectedModuleFilter !== 'all' && day.moduleNumber !== selectedModuleFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'completed' && status !== 'completed') return false;
        if (statusFilter === 'in-progress' && status !== 'in-progress') return false;
        if (statusFilter === 'incomplete' && status !== 'incomplete') return false;
        if (statusFilter === 'locked' && status !== 'locked') return false;
      }

      return true;
    });
  }, [searchQuery, selectedModuleFilter, statusFilter, getDayStatus, days]);

  const handleSelectDay = (dayNum: number) => {
    setSelectedDayNumber(dayNum);
    setCurrentPage('today_work');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#E0DCD3]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
          180 DAYS OF PREPARATION SCHEDULE
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1">
          Complete daily syllabus breakdown from 23 November 2026 to 21 May 2027.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, subtopics, tech terms (e.g. pgvector, BM25, FastAPI, Ragas)..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#E7826D] focus:bg-white transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed (Green)</option>
            <option value="in-progress">In Progress (Terracotta)</option>
            <option value="incomplete">Incomplete (Red)</option>
            <option value="locked">Locked (Grey)</option>
          </select>

          {/* Module Filter */}
          <select
            value={selectedModuleFilter}
            onChange={(e) => setSelectedModuleFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer"
          >
            <option value="all">All 13 Modules</option>
            <option value="1">Module 1: Foundations</option>
            <option value="2">Module 2: Frontend & API</option>
            <option value="3">Module 3: Auth & DB</option>
            <option value="4">Module 4: Ingestion & OCR</option>
            <option value="5">Module 5: Chunking & Vectors</option>
            <option value="6">Module 6: Basic RAG Chat</option>
            <option value="7">Module 7: Advanced Retrieval</option>
            <option value="8">Module 8: Evaluation & Tests</option>
            <option value="9">Module 9: Security & Reliability</option>
            <option value="10">Module 10: Observability & Cost</option>
            <option value="11">Module 11: Deployment & CI/CD</option>
            <option value="12">Module 12: Capstone & Handover</option>
            <option value="13">Module 13: Final 12 Days Integration</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-[#78716C] flex items-center justify-between px-1">
        <span>Showing <strong className="text-[#292929]">{filteredDays.length}</strong> of 180 scheduled days</span>
        <span className="font-mono text-[#E7826D] font-bold">Current: Day {currentDayNumber}</span>
      </div>

      {/* Day Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDays.map(day => {
          const status = getDayStatus(day.dayNumber);
          const { completed, total, percentage } = getDayTaskCompletion(day.dayNumber);
          const isCurrent = day.dayNumber === currentDayNumber;

          let cardBorder = 'border-[#E0DCD3] hover:border-[#292929]/30';
          let statusBadge = 'bg-stone-100 text-stone-600 border border-stone-200';

          if (status === 'completed') {
            cardBorder = 'border-emerald-300 hover:border-emerald-500';
            statusBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
          } else if (status === 'in-progress') {
            cardBorder = 'border-[#E7826D]/50 hover:border-[#E7826D]';
            statusBadge = 'bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30';
          } else if (status === 'incomplete') {
            cardBorder = 'border-rose-300 hover:border-rose-400';
            statusBadge = 'bg-rose-50 text-rose-700 border border-rose-200';
          }

          return (
            <div
              key={day.dayNumber}
              onClick={() => handleSelectDay(day.dayNumber)}
              className={`bg-white border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all cursor-pointer hover:shadow-md shadow-sm ${cardBorder} ${
                isCurrent ? 'ring-2 ring-[#E7826D]' : ''
              }`}
            >
              <div className="space-y-3">
                {/* Card Top Strip */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#292929]">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[11px] text-[#78716C]">
                      ({day.dayOfWeek.slice(0, 3)})
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusBadge}`}>
                    {status.replace('-', ' ')}
                  </span>
                </div>

                {/* Date & Target */}
                <div className="flex items-center gap-2 text-xs text-[#78716C]">
                  <span className="font-mono text-[#E7826D] font-semibold">{day.dateString}</span>
                  <span>·</span>
                  <span>{day.targetHours}h study target</span>
                </div>

                {/* Topic */}
                <h3 className="text-base font-bold text-[#292929] line-clamp-1">
                  {day.topic}
                </h3>

                {/* Subtopics snippet (unlocked) or safe module/unlock info (locked) */}
                <p className="text-xs text-[#78716C] line-clamp-2 leading-relaxed">
                  {status === 'locked'
                    ? `Module ${day.moduleNumber}: ${day.moduleTitle} · Unlocks ${day.dateString} · 00:00 IST`
                    : day.subtopics.join(' · ')}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-[#E0DCD3] flex items-center justify-between text-xs">
                <span className="font-mono text-[#78716C] tabular-nums">
                  {completed}/{total} tasks ({percentage}%)
                </span>
                <span className="text-[#E7826D] hover:text-[#D66F5A] flex items-center gap-1 font-semibold">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
