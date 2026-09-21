'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Award, CheckCircle2, Flame, Clock, FileText, ChevronDown, Sparkles } from 'lucide-react';
import { useApexStore, GrowthLedgerEntry } from '@/store/useApexStore';
import { useAuth } from '@/context/AuthContext';

const DAYS_OF_WEEK = ['ALL DAYS', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS_OF_YEAR = [
  'ALL MONTHS',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const HistoricalProgressReport: React.FC = () => {
  const { user } = useAuth();
  const growthLedgerHistory = useApexStore((state) => state.growthLedgerHistory);
  const macroAim = useApexStore((state) => state.macroAim);
  const sideHobbies = useApexStore((state) => state.sideHobbies);
  const newHobbiesToDevelop = useApexStore((state) => state.newHobbiesToDevelop);

  const [selectedDay, setSelectedDay] = useState<string>('ALL DAYS');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL MONTHS');
  const [selectedYear, setSelectedYear] = useState<string>('ALL YEARS');

  const [dbRecords, setDbRecords] = useState<GrowthLedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch timestamped historical records from PostgreSQL or use local state history
    const loadRecords = async () => {
      if (!user) {
        setDbRecords(growthLedgerHistory);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch('/api/daily-records', {
          headers: { Authorization: `Bearer ${user.uid}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.records) && data.records.length > 0) {
            const mapped: GrowthLedgerEntry[] = data.records.map((r: any) => ({
              date: r.date,
              completedQuestsCount: r.completedQuestsCount,
              totalQuestsCount: r.totalQuestsCount,
              consistencyScore: r.consistencyScore,
              statusCode: r.statusCode,
              xpEarned: r.xpEarned,
            }));
            setDbRecords(mapped);
          } else {
            setDbRecords(growthLedgerHistory);
          }
        }
      } catch (err) {
        setDbRecords(growthLedgerHistory);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecords();
  }, [user, growthLedgerHistory]);

  // Combine and filter records by Date, Day, Month, Year
  const filteredRecords = dbRecords.filter((record) => {
    if (!record.date) return false;
    const d = new Date(record.date);

    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = d.toLocaleDateString('en-US', { month: 'long' });
    const yearStr = d.getFullYear().toString();

    if (selectedDay !== 'ALL DAYS' && dayName !== selectedDay) return false;
    if (selectedMonth !== 'ALL MONTHS' && monthName !== selectedMonth) return false;
    if (selectedYear !== 'ALL YEARS' && yearStr !== selectedYear) return false;

    return true;
  });

  const yearsAvailable = Array.from(
    new Set(
      dbRecords
        .map((r) => (r.date ? new Date(r.date).getFullYear().toString() : '2026'))
        .concat(['2026'])
    )
  ).sort();

  const totalFilteredXp = filteredRecords.reduce((acc, r) => acc + (r.xpEarned || 0), 0);
  const avgConsistency =
    filteredRecords.length > 0
      ? Math.round(filteredRecords.reduce((acc, r) => acc + (r.consistencyScore || 0), 0) / filteredRecords.length)
      : 0;

  return (
    <div className="space-y-4 font-mono select-none">
      {/* Header & Filter Controls Bar */}
      <div className="hud-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E1E26]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FFFFFF]" />
            <div>
              <h3 className="text-sm font-extrabold text-[#FFFFFF] text-glow">
                OPERATIONAL HISTORICAL PROGRESS REPORT
              </h3>
              <p className="text-[10px] text-[#8E8E93]">
                Timestamped Reports & Goal Breakdown by Date, Day, Month & Year
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[#8E8E93] bg-[#000000] px-2.5 py-1 rounded border border-[#1E1E26]">
            <Filter className="w-3 h-3 text-[#FFFFFF]" />
            <span>RECORD COUNT: {filteredRecords.length} LOGS</span>
          </div>
        </div>

        {/* Date, Day, Month, Year Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Day Filter */}
          <div>
            <label className="text-[9px] text-[#8E8E93] uppercase font-bold block mb-1">
              FILTER BY DAY OF WEEK
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded px-2.5 py-1.5 text-xs text-[#FFFFFF] outline-none"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="text-[9px] text-[#8E8E93] uppercase font-bold block mb-1">
              FILTER BY MONTH
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded px-2.5 py-1.5 text-xs text-[#FFFFFF] outline-none"
            >
              {MONTHS_OF_YEAR.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="text-[9px] text-[#8E8E93] uppercase font-bold block mb-1">
              FILTER BY YEAR
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded px-2.5 py-1.5 text-xs text-[#FFFFFF] outline-none"
            >
              <option value="ALL YEARS">ALL YEARS</option>
              {yearsAvailable.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Aggregated Filter Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1E1E26] text-xs">
          <div className="p-2 rounded bg-[#000000] border border-[#1E1E26]">
            <span className="text-[9px] text-[#8E8E93] block">TOTAL REPORTED XP</span>
            <span className="font-bold text-[#FFFFFF]">{totalFilteredXp} XP</span>
          </div>
          <div className="p-2 rounded bg-[#000000] border border-[#1E1E26]">
            <span className="text-[9px] text-[#8E8E93] block">AVG CONSISTENCY</span>
            <span className="font-bold text-[#FFFFFF]">{avgConsistency}%</span>
          </div>
          <div className="p-2 rounded bg-[#000000] border border-[#1E1E26] col-span-2 sm:col-span-2">
            <span className="text-[9px] text-[#8E8E93] block">ACTIVE HORIZON TARGET</span>
            <span className="font-bold text-[#FFFFFF] truncate block">{macroAim || 'Full-Stack Developer'}</span>
          </div>
        </div>
      </div>

      {/* User Goals & Hobbies Card */}
      <div className="hud-card p-4 space-y-3">
        <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#1E1E26]">
          <Award className="w-4 h-4 text-[#FFFFFF]" /> ACTIVE USER GOALS & HOBBIES REGISTER
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] space-y-1">
            <span className="text-[10px] text-[#8E8E93] uppercase font-bold block">1. MACRO SUMMIT GOAL</span>
            <p className="font-bold text-[#FFFFFF]">{macroAim || 'Full-Stack Developer & Founder'}</p>
          </div>

          <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] space-y-1">
            <span className="text-[10px] text-[#8E8E93] uppercase font-bold block">2. SIDE HOBBIES</span>
            <p className="font-bold text-[#FFFFFF]">{sideHobbies || 'Guitar, Fitness, Photography'}</p>
          </div>

          <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] space-y-1">
            <span className="text-[10px] text-[#8E8E93] uppercase font-bold block">3. NEW HOBBIES TO DEVELOP</span>
            <p className="font-bold text-[#FFFFFF]">{newHobbiesToDevelop || 'Cybersecurity, Martial Arts, Chess'}</p>
          </div>
        </div>
      </div>

      {/* Timestamped Log Entries List */}
      <div className="hud-card p-4 space-y-3">
        <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center justify-between pb-2 border-b border-[#1E1E26]">
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#FFFFFF]" /> TIMESTAMPED DAILY REPORTS ({filteredRecords.length})
          </span>
          <span className="text-[10px] text-[#8E8E93]">DATE // DAY // MONTH // YEAR</span>
        </h4>

        {filteredRecords.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#8E8E93] bg-[#000000] rounded-lg border border-[#1E1E26]">
            No historical reports match the selected Date, Day, Month, or Year filters.
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredRecords.map((rec) => {
              const d = rec.date ? new Date(rec.date) : new Date();
              const formattedDate = rec.date || d.toISOString().slice(0, 10);
              const dayStr = d.toLocaleDateString('en-US', { weekday: 'long' });
              const monthStr = d.toLocaleDateString('en-US', { month: 'long' });
              const yearStr = d.getFullYear().toString();

              return (
                <div
                  key={formattedDate}
                  className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] hover:border-[#383848] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#18181F] border border-[#383848] flex flex-col items-center justify-center shrink-0 text-[9px] font-bold">
                      <span className="text-[#FFFFFF]">{d.getDate()}</span>
                      <span className="text-[#8E8E93] uppercase">{monthStr.slice(0, 3)}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#FFFFFF]">{formattedDate}</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#18181F] text-[#8E8E93] text-[9px] uppercase border border-[#27272A]">
                          {dayStr}, {yearStr}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8E8E93]">
                        Completed Quests: {rec.completedQuestsCount} / {rec.totalQuestsCount || 5} | Score: {rec.consistencyScore}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        rec.statusCode === 'MASTERED'
                          ? 'bg-[#FFFFFF]/20 text-[#FFFFFF] border-[#FFFFFF]'
                          : rec.statusCode === 'PARTIAL'
                          ? 'bg-[#18181F] text-[#FFFFFF] border-[#383848]'
                          : 'bg-[#000000] text-[#8E8E93] border-[#1E1E26]'
                      }`}
                    >
                      {rec.statusCode || 'MASTERED'}
                    </span>
                    <span className="font-bold text-[#FFFFFF] text-glow-sm">+{rec.xpEarned} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalProgressReport;
