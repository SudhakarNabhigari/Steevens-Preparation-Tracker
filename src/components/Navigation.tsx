import React, { useState } from 'react';
import { useApp, NavigationPage } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Calendar,
  Award,
  TrendingUp,
  FileText,
  History,
  Settings,
  LogOut,
  Timer,
  Play,
  Pause,
  Menu,
  X,
  FileUp,
  RefreshCw,
  Check,
  Library,
  AlertTriangle,
  Code2,
  Cloud
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    state,
    currentPage,
    setCurrentPage,
    activeTimer,
    pauseTimer,
    resumeTimer,
    logout,
    resetGuestPreview,
    saveStatus,
    testModeEnabled,
    testModeDate,
    setSimulationMode
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home_dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'today_work', label: 'Main Plan (180d)', icon: CalendarCheck },
    { id: 'dsa_track', label: 'DSA in C++ (100d)', icon: Code2 },
    { id: 'azure_track', label: 'Azure (100d)', icon: Cloud },
    { id: 'preparation_calendar', label: 'Calendar', icon: Calendar },
    { id: 'all_days', label: '180 Days List', icon: CalendarDays },
    { id: 'weekly_assessments', label: 'Assessments', icon: Award },
    { id: 'weekly_progress', label: 'Weekly Progress', icon: TrendingUp },
    { id: 'resource_library', label: 'Resource Library', icon: Library },
    { id: 'doubt_notebook', label: 'Doubt Notebook', icon: AlertTriangle },
    { id: 'roadmap_pdf', label: 'Roadmap PDF', icon: FileUp },
    { id: 'original_roadmap', label: 'Original Roadmap', icon: FileText },
    { id: 'study_history', label: 'Study History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isOwner = state.role === 'owner';

  const timerTrackLabel =
    activeTimer.trackId === 'dsa' ? 'DSA' : activeTimer.trackId === 'azure' ? 'AZURE' : 'MAIN';

  return (
    <header className="sticky top-0 z-40 bg-[#292929] text-[#F3EFE6] border-b border-[#3D3D3D] shadow-md">
      {/* Guest Mode Persistent Banner */}
      {!isOwner && (
        <div className="bg-[#1F1F1F] border-b border-[#3D3D3D] px-4 py-2 text-xs text-[#E0DCD3] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E7826D] animate-pulse" />
            <span className="font-semibold text-[#F3EFE6]">
              GUEST PREVIEW / TEMPORARY STUDY MODE — Shared PDFs, resources & settings are read-only; your study progress stays local and never affects Steeven.
            </span>
          </div>
          <button
            onClick={resetGuestPreview}
            className="px-2.5 py-1 rounded-md bg-[#292929] hover:bg-[#383838] border border-[#525252] text-[#F3EFE6] font-medium flex items-center gap-1.5 cursor-pointer text-[11px] transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-[#E7826D]" />
            <span>RESET PREVIEW</span>
          </button>
        </div>
      )}

      {/* Ephemeral TEST MODE Banner (Read-Only Schedule Preview — never alters real locks or progress) */}
      {isOwner && testModeEnabled && (
        <div className="bg-[#382E25] border-b border-[#E7826D]/40 px-4 py-1.5 text-xs text-[#F3EFE6] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-[#E7826D] text-[#292929] font-extrabold text-[10px] tracking-wider uppercase">
              TEST MODE
            </span>
            <span>
              Schedule Preview Date:{' '}
              {testModeDate
                ? new Date(testModeDate).toLocaleDateString('en-US', {
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'full'
                  })
                : '16 November 2026'}{' '}
              · Production IST locks & saved progress remain protected.
            </span>
          </div>
          <button
            onClick={() => setSimulationMode(false)}
            className="hover:underline text-[#E7826D] font-semibold ml-4 cursor-pointer shrink-0"
          >
            Exit Test Mode
          </button>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentPage('home_dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E7826D] text-[#292929] flex items-center justify-center font-bold text-xs shadow-sm font-mono">
              180
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-tight text-[#F3EFE6] whitespace-nowrap block">
                {state.sharedSettings?.preparationTitle || "STEEVEN'S 180-DAY PREPARATION TRACKER"}
              </span>
              <span className="text-[10px] text-[#A8A49C] hidden sm:block">
                {state.sharedSettings?.studyScheduleBannerNote ||
                  'Main (180d) · DSA in C++ (100d) · Azure (100d) · Asia/Kolkata'}
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono text-[#A8A49C]">
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1 text-[#E7826D]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E7826D] animate-ping" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-[#9EC4A2]">
                <Check className="w-3 h-3" />
                <span>Saved</span>
              </span>
            )}
            {saveStatus === 'error' && <span className="text-[#F87171]">Save local</span>}
          </div>

          {activeTimer.isActive && (
            <div className="flex items-center gap-2 px-2.5 py-1 bg-[#1F1F1F] border border-[#525252] rounded-lg">
              <Timer className="w-3.5 h-3.5 text-[#E7826D] animate-pulse" />
              <span className="text-[10px] font-bold text-[#E7826D]">{timerTrackLabel}</span>
              <span className="font-mono text-xs font-semibold text-[#F3EFE6] tabular-nums">
                {formatTime(activeTimer.remainingSeconds)}
              </span>
              <div className="flex items-center gap-0.5 ml-1">
                {activeTimer.isPaused ? (
                  <button
                    onClick={resumeTimer}
                    className="p-1 hover:text-[#E7826D] text-[#C2BEB5] cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="p-1 hover:text-[#E7826D] text-[#C2BEB5] cursor-pointer"
                  >
                    <Pause className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1F1F1F] border border-[#3D3D3D] text-xs">
            {isOwner ? (
              <span className="font-semibold text-[#F3EFE6] whitespace-nowrap">Steeven — Owner</span>
            ) : (
              <span className="font-semibold text-[#E7826D] whitespace-nowrap">Guest — Preview</span>
            )}
          </div>

          <button
            onClick={logout}
            className="p-2 text-[#C2BEB5] hover:text-[#F3EFE6] hover:bg-[#3D3D3D] rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-[#C2BEB5] hover:text-[#F3EFE6] hover:bg-[#3D3D3D] rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Horizontal Navigation Bar */}
      <nav className="hidden xl:flex items-center gap-1 px-4 sm:px-6 py-1.5 bg-[#202020] border-t border-[#333333] overflow-x-auto text-xs font-medium">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-1">
          {navItems.map(item => {
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer text-xs ${
                  isActive
                    ? 'bg-[#E7826D] text-[#292929] font-bold shadow-sm'
                    : 'text-[#E0DCD3] hover:text-[#F3EFE6] hover:bg-[#2F2F2F]'
                }`}
              >
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#1F1F1F] border-b border-[#3D3D3D] px-4 py-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left cursor-pointer ${
                currentPage === item.id
                  ? 'bg-[#E7826D] text-[#292929] font-bold'
                  : 'text-[#E0DCD3] hover:bg-[#292929]'
              }`}
            >
              <item.icon className="w-4 h-4 text-[#A8A49C]" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
