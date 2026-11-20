import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';

export const OverallProgressBar: React.FC = () => {
  const { state, currentDayNumber, userRole } = useApp();
  
  const completedCount = Object.values(state.completedDays).filter(Boolean).length;
  const percentage = Math.round((completedCount / 180) * 100);

  return (
    <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5A5650]">
          Overall 180-Day Preparation Journey
        </span>
        <span className="text-sm font-bold font-mono text-[#E7826D] tabular-nums">
          {completedCount} / 180 Days ({percentage}%)
        </span>
      </div>
      <div className="w-full h-3 bg-[#EAE5DC] rounded-full overflow-hidden p-0.5 border border-[#D5D0C7]">
        <div
          className="h-full bg-[#E7826D] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(percentage > 0 ? percentage : 1, 1)}%` }}
        />
      </div>
      <div className="flex justify-between items-center text-[11px] text-[#736E65] mt-2 font-mono">
        <span>Day 1 ({userRole === 'owner' ? '23 Nov 2026' : '16 Nov 2026'})</span>
        <span>Position: Day {state.lastActiveDayNumber || currentDayNumber}</span>
        <span>Day 180 ({userRole === 'owner' ? '21 May 2027' : '14 May 2027'})</span>
      </div>
    </div>
  );
};

export const CompletionTrajectoryChart: React.FC = () => {
  const { state, currentDayNumber } = useApp();
  const [hoveredPoint, setHoveredPoint] = useState<{ day: number; count: number; x: number; y: number } | null>(null);

  const checkpoints = [1, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
  
  const data = checkpoints.map(day => {
    let completedUpToDay = 0;
    for (let d = 1; d <= day; d++) {
      if (state.completedDays[d]) completedUpToDay++;
    }
    const target = Math.min(day, 180);
    return { day, actual: completedUpToDay, target };
  });

  const width = 600;
  const height = 180;
  const padding = 30;

  const getX = (day: number) => padding + ((day - 1) / 179) * (width - 2 * padding);
  const getY = (val: number) => height - padding - (val / 180) * (height - 2 * padding);

  const targetPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.day)} ${getY(d.target)}`).join(' ');
  const actualPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.day)} ${getY(d.actual)}`).join(' ');

  return (
    <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#292929]">
            180-Day Completion Trajectory
          </h3>
          <p className="text-[11px] text-[#736E65]">Planned Target vs Verified Completed Days</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-[#736E65]">
            <span className="w-2.5 h-0.5 bg-[#A8A49C] border-dashed" /> Planned
          </span>
          <span className="flex items-center gap-1.5 text-[#E7826D] font-bold">
            <span className="w-2.5 h-1 bg-[#E7826D] rounded" /> Actual
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {[0, 45, 90, 135, 180].map(v => (
            <g key={v}>
              <line
                x1={padding}
                y1={getY(v)}
                x2={width - padding}
                y2={getY(v)}
                stroke="#EAE5DC"
                strokeWidth="1"
              />
              <text x={padding - 6} y={getY(v) + 3} fill="#736E65" fontSize="9" textAnchor="end" className="font-mono">
                {v}
              </text>
            </g>
          ))}

          {/* Planned target dashed line */}
          <path d={targetPath} fill="none" stroke="#C2BEB5" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Actual line */}
          <path d={actualPath} fill="none" stroke="#E7826D" strokeWidth="2.5" />

          {data.map(d => (
            <circle
              key={d.day}
              cx={getX(d.day)}
              cy={getY(d.actual)}
              r={d.day === (state.lastActiveDayNumber || currentDayNumber) ? 4.5 : 3}
              fill={d.actual > 0 ? '#16A34A' : '#E7826D'}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint({ day: d.day, count: d.actual, x: getX(d.day), y: getY(d.actual) })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {hoveredPoint && (
          <div
            className="absolute z-10 px-2.5 py-1 bg-[#292929] text-[#F3EFE6] rounded text-[11px] shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{ left: `${(hoveredPoint.x / width) * 100}%`, top: `${(hoveredPoint.y / height) * 100}%` }}
          >
            Day {hoveredPoint.day}: {hoveredPoint.count} days completed
          </div>
        )}
      </div>
    </div>
  );
};

export const StudyHoursChart: React.FC = () => {
  const { state } = useApp();

  const moduleData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(modNum => {
    const daysInMod = ALL_180_DAYS.filter(d => d.moduleNumber === modNum);
    const targetHours = daysInMod.reduce((sum, d) => sum + d.targetHours, 0);
    const actualSeconds = daysInMod.reduce((sum, d) => sum + (state.studyTimeSeconds[d.dayNumber] || 0), 0);
    const actualHours = Math.round((actualSeconds / 3600) * 10) / 10;
    return {
      module: `M${modNum}`,
      title: daysInMod[0]?.moduleTitle || `Module ${modNum}`,
      target: targetHours,
      actual: actualHours
    };
  });

  const maxVal = Math.max(...moduleData.map(m => Math.max(m.target, m.actual, 55)));

  return (
    <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#292929]">
            Study Hours by Module
          </h3>
          <p className="text-[11px] text-[#736E65]">Target vs Actual Recorded Hours</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-[#736E65]">
            <span className="w-2.5 h-2.5 bg-[#EAE5DC] rounded-sm" /> Target
          </span>
          <span className="flex items-center gap-1.5 text-[#E7826D] font-bold">
            <span className="w-2.5 h-2.5 bg-[#E7826D] rounded-sm" /> Logged
          </span>
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-4 items-end h-40">
        {moduleData.map(item => {
          const targetPct = (item.target / maxVal) * 100;
          const actualPct = (item.actual / maxVal) * 100;

          return (
            <div key={item.module} className="flex flex-col items-center gap-1 h-full justify-end group">
              <div className="w-full flex gap-0.5 items-end justify-center h-28 relative">
                <div
                  className="w-2 bg-[#EAE5DC] rounded-t"
                  style={{ height: `${targetPct}%` }}
                  title={`${item.title}: Target ${item.target}h`}
                />
                <div
                  className="w-2 bg-[#E7826D] rounded-t transition-all"
                  style={{ height: `${Math.max(actualPct > 0 ? 4 : 0, actualPct)}%` }}
                  title={`${item.title}: Actual ${item.actual}h`}
                />
              </div>
              <span className="text-[10px] font-mono text-[#5A5650]">{item.module}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const WeeklyProgressChart: React.FC = () => {
  const { state, getDayStatus } = useApp();

  const weeks = Array.from({ length: 6 }, (_, i) => i + 1).map(wk => {
    const daysInWeek = ALL_180_DAYS.filter(d => d.weekNumber === wk);
    const completedDays = daysInWeek.filter(d => getDayStatus(d.dayNumber) === 'completed').length;
    const pct = Math.round((completedDays / 7) * 100);

    return { week: `W${wk}`, completedDays, pct };
  });

  return (
    <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#292929]">
            Weekly Completion Progress
          </h3>
          <p className="text-[11px] text-[#736E65]">Verified days completed per week</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {weeks.map(w => (
          <div key={w.week} className="flex items-center gap-3 text-xs">
            <span className="font-mono text-[#5A5650] w-8 font-semibold">{w.week}</span>
            <div className="flex-1 h-2.5 bg-[#EAE5DC] rounded-full overflow-hidden border border-[#D5D0C7]">
              <div
                className={`h-full rounded-full transition-all ${
                  w.pct === 100 ? 'bg-[#16A34A]' : w.pct > 0 ? 'bg-[#E7826D]' : 'bg-transparent'
                }`}
                style={{ width: `${w.pct}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-[#5A5650] w-12 text-right tabular-nums">
              {w.completedDays}/7d
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AssessmentPerformanceChart: React.FC = () => {
  const { state } = useApp();
  const submissions = Object.values(state.assessmentSubmissions);

  return (
    <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#292929]">
            Assessment Performance
          </h3>
          <p className="text-[11px] text-[#736E65]">Saturday 3-Hour Exam Results</p>
        </div>
        <span className="text-xs font-mono font-bold text-[#E7826D]">
          {submissions.length} Submitted
        </span>
      </div>

      {submissions.length === 0 ? (
        <div className="h-32 flex flex-col items-center justify-center text-[#736E65] text-xs text-center border border-dashed border-[#D5D0C7] rounded-lg p-4 bg-[#FAF8F5]">
          <p className="font-medium text-[#292929]">No preparation activity yet.</p>
          <p className="text-[11px] text-[#9B968D] mt-1">Start your first weekly assessment on Saturday to see your scores here.</p>
        </div>
      ) : (
        <div className="space-y-2 pt-2">
          {submissions.slice(0, 5).map(sub => (
            <div key={sub.weekNumber} className="flex items-center justify-between text-xs py-1.5 border-b border-[#EAE5DC]">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#292929]">Week {sub.weekNumber}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${sub.passed ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEE2E2] text-[#B91C1C]'}`}>
                  {sub.passed ? 'PASSED' : 'REVISION NEEDED'}
                </span>
              </div>
              <span className="font-mono font-bold text-[#292929] tabular-nums">
                {sub.score} / {sub.maxScore} ({sub.percentage}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
