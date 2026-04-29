import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Clock, CheckCircle2, Flame, TrendingUp, Zap, ArrowRight, MapPin, BarChart2 } from 'lucide-react';

const PriorityBoard = ({ reports = [], onReportClick }) => {
  const [focusedColumn, setFocusedColumn] = useState(null);

  const highPriority = reports.filter(r => r.urgency === 'High');
  const medPriority  = reports.filter(r => r.urgency === 'Medium');
  const lowPriority  = reports.filter(r => r.urgency === 'Low');

  const totalReports = reports.length || 1;
  const highPct  = Math.round((highPriority.length / totalReports) * 100);
  const medPct   = Math.round((medPriority.length / totalReports) * 100);
  const lowPct   = Math.round((lowPriority.length / totalReports) * 100);

  const columns = [
    {
      key: 'High',
      title: 'Critical',
      subtitle: 'Immediate action needed',
      icon: Flame,
      items: highPriority,
      pct: highPct,
      accent: '#ef4444',
      bgGrad: 'from-red-500/10 to-red-500/0',
      borderClass: 'border-l-red-500',
      badgeBg: 'bg-red-500',
      badgeText: 'text-white',
      headerBg: 'bg-red-50 dark:bg-red-950/20',
      statusColor: 'text-red-600 dark:text-red-400',
      glow: '0 0 30px -5px rgba(239,68,68,0.15)',
      pulse: true,
    },
    {
      key: 'Medium',
      title: 'Moderate',
      subtitle: 'Schedule soon',
      icon: TrendingUp,
      items: medPriority,
      pct: medPct,
      accent: '#f97316',
      bgGrad: 'from-orange-500/10 to-orange-500/0',
      borderClass: 'border-l-orange-500',
      badgeBg: 'bg-orange-500',
      badgeText: 'text-white',
      headerBg: 'bg-orange-50 dark:bg-orange-950/20',
      statusColor: 'text-orange-600 dark:text-orange-400',
      glow: '0 0 30px -5px rgba(249,115,22,0.12)',
    },
    {
      key: 'Low',
      title: 'Routine',
      subtitle: 'Regular schedule',
      icon: CheckCircle2,
      items: lowPriority,
      pct: lowPct,
      accent: '#10b981',
      bgGrad: 'from-emerald-500/10 to-emerald-500/0',
      borderClass: 'border-l-emerald-500',
      badgeBg: 'bg-emerald-500',
      badgeText: 'text-white',
      headerBg: 'bg-emerald-50 dark:bg-emerald-950/20',
      statusColor: 'text-emerald-600 dark:text-emerald-400',
      glow: '0 0 30px -5px rgba(16,185,129,0.12)',
    },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Summary Bar */}
      <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#0B1121] rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
        <BarChart2 size={16} className="text-slate-400 shrink-0" />
        <div className="flex-1 flex gap-1 h-2 rounded-full overflow-hidden">
          {highPriority.length > 0 && <div style={{ width: `${highPct}%`, background: '#ef4444' }} className="h-full rounded-full transition-all duration-700" />}
          {medPriority.length > 0 && <div style={{ width: `${medPct}%`, background: '#f97316' }} className="h-full rounded-full transition-all duration-700" />}
          {lowPriority.length > 0 && <div style={{ width: `${lowPct}%`, background: '#10b981' }} className="h-full rounded-full transition-all duration-700" />}
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black">
          <span className="text-red-500">{highPriority.length}H</span>
          <span className="text-orange-500">{medPriority.length}M</span>
          <span className="text-emerald-500">{lowPriority.length}L</span>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {columns.map((col, colIdx) => {
          const Icon = col.icon;
          const isFocused = focusedColumn === col.key;
          return (
            <motion.div
              key={col.key}
              layout
              className="flex flex-col rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              style={{ boxShadow: isFocused ? col.glow : undefined }}
              onMouseEnter={() => setFocusedColumn(col.key)}
              onMouseLeave={() => setFocusedColumn(null)}
            >
              {/* Column Header */}
              <div className={`${col.headerBg} px-4 py-3 border-b border-slate-100 dark:border-white/5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ background: col.accent + '20', color: col.accent }} className="p-1.5 rounded-lg">
                      <Icon size={15} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-800 dark:text-white leading-tight">{col.title}</h3>
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">{col.subtitle}</p>
                    </div>
                  </div>
                  <div className={`flex items-center justify-center min-w-[28px] h-7 px-2 ${col.badgeBg} ${col.badgeText} rounded-full text-xs font-black shadow-sm`}>
                    {col.items.length}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${col.pct}%` }}
                    transition={{ duration: 0.8, delay: colIdx * 0.1, ease: 'easeOut' }}
                    style={{ background: col.accent }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2.5 p-3 overflow-y-auto custom-scrollbar flex-1 min-h-[300px] bg-slate-50/50 dark:bg-slate-900/30">
                <AnimatePresence mode="popLayout">
                  {col.items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-32 text-slate-400 opacity-60"
                    >
                      <CheckCircle2 size={22} className="mb-2" />
                      <p className="text-xs font-bold">All clear!</p>
                    </motion.div>
                  ) : (
                    col.items.map((report, idx) => (
                      <motion.div
                        layout
                        key={report._id}
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: idx * 0.04 }}
                        onClick={() => onReportClick && onReportClick(report)}
                        className={`bg-white dark:bg-[#0B1121] p-3 rounded-xl shadow-sm border-l-[3px] ${col.borderClass} cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group`}
                      >
                        {/* Urgency pulse for high priority */}
                        {col.key === 'High' && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Critical</span>
                          </div>
                        )}

                        <h4 className="font-black text-[13px] text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors capitalize leading-tight">
                          {report.area || report.location}
                        </h4>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {report.description || 'No description provided.'}
                        </p>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-50 dark:border-white/5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                              {report.garbageType}
                            </span>
                            {report.landmark && (
                              <span className="flex items-center gap-0.5 text-[9px] font-bold text-slate-400">
                                <MapPin size={8} />{report.landmark}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-slate-400 shrink-0">
                            <Clock size={9} />
                            {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className={`mt-2 flex items-center justify-between`}>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            report.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600' :
                            'bg-amber-100 dark:bg-amber-950/30 text-amber-600'
                          }`}>{report.status}</span>
                          <ArrowRight size={11} className={`${col.statusColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PriorityBoard;
