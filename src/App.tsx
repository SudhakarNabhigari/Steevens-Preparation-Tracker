import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { LoginScreen } from './components/LoginScreen';
import { LockScreen } from './components/LockScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { TodayWorkPage } from './components/TodayWorkPage';
import { TrackPreparationPage } from './components/TrackPreparationPage';
import { AllDaysGrid } from './components/AllDaysGrid';
import { WeeklyAssessmentsPage } from './components/WeeklyAssessmentsPage';
import { WeeklyProgressPage } from './components/WeeklyProgressPage';
import { OriginalRoadmapPage } from './components/OriginalRoadmapPage';
import { RoadmapPdfPage } from './components/RoadmapPdfPage';
import { StudyHistoryPage } from './components/StudyHistoryPage';
import { SettingsPage } from './components/SettingsPage';
import { SmartTimerModal } from './components/SmartTimerModal';
import { ResourceLibraryPage } from './components/ResourceLibraryPage';
import { DoubtNotebookPage } from './components/DoubtNotebookPage';
import { PreparationCalendarPage } from './components/PreparationCalendarPage';

const AppContent: React.FC = () => {
  const { state, currentPage, isPreparationLocked, userRole } = useApp();

  if (!state.isAuthenticated) {
    return <LoginScreen />;
  }

  // Guests can preview all pages without date lock blocking them
  const isLockedForCurrentView = userRole !== 'guest' && isPreparationLocked;

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'lock_screen':
        return <LockScreen />;
      case 'home_dashboard':
        return isLockedForCurrentView ? <LockScreen /> : <HomeDashboard />;
      case 'today_work':
        return isLockedForCurrentView ? <LockScreen /> : <TodayWorkPage />;
      case 'dsa_track':
        return <TrackPreparationPage trackId="dsa" />;
      case 'azure_track':
        return <TrackPreparationPage trackId="azure" />;
      case 'preparation_calendar':
        return <PreparationCalendarPage />;
      case 'all_days':
        return <AllDaysGrid />;
      case 'weekly_assessments':
        return isLockedForCurrentView ? <LockScreen /> : <WeeklyAssessmentsPage />;
      case 'weekly_progress':
        return <WeeklyProgressPage />;
      case 'resource_library':
        return <ResourceLibraryPage />;
      case 'doubt_notebook':
        return <DoubtNotebookPage />;
      case 'roadmap_pdf':
        return <RoadmapPdfPage />;
      case 'original_roadmap':
        return <OriginalRoadmapPage />;
      case 'study_history':
        return <StudyHistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return isLockedForCurrentView ? <LockScreen /> : <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-[#292929] flex flex-col font-sans">
      <Navigation />
      <main className="flex-1 pb-16">{renderCurrentView()}</main>
      <SmartTimerModal />

      <footer className="border-t border-[#E0DCD3] bg-[#FAF8F5] py-6 px-4 text-center text-xs text-[#78716C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-semibold text-[#292929]">
            STEEVEN'S 180-DAY PREPARATION TRACKER · Main (180d) · DSA in C++ (100d) · Azure (100d)
          </span>
          <span className="font-mono">
            16 November 2026 – 14 May 2027 · Asia/Kolkata (IST)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
