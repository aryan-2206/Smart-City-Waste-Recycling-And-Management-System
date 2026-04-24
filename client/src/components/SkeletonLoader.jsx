import React from 'react';

/**
 * Reusable skeleton loader system.
 * Components: CardSkeleton, TableRowSkeleton, StatSkeleton, ReportCardSkeleton, LeaderboardSkeleton
 */

const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/10 before:to-transparent before:animate-[shimmer_1.4s_infinite]";

export const SkeletonBlock = ({ className = '' }) => (
  <div className={`bg-slate-200/80 dark:bg-white/5 rounded-lg ${shimmer} ${className}`} />
);

export const StatSkeleton = () => (
  <div className="bg-white dark:bg-[#0B1121] rounded-[0.8rem] p-4 border-2 border-slate-100 dark:border-white/5 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 ${shimmer}`} />
    <div className="flex flex-col gap-2 flex-1">
      <SkeletonBlock className="h-3 w-20" />
      <SkeletonBlock className="h-5 w-14" />
    </div>
  </div>
);

export const ReportCardSkeleton = () => (
  <div className="bg-white dark:bg-[#0B1121] rounded-[1.5rem] p-3 flex flex-col sm:flex-row gap-4 border-2 border-slate-100 dark:border-white/5">
    <SkeletonBlock className="w-full sm:w-[160px] h-[160px] rounded-2xl shrink-0" />
    <div className="flex-1 flex flex-col gap-3 py-1">
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-5 w-20 rounded-full" />
      </div>
      <SkeletonBlock className="h-3 w-32" />
      <SkeletonBlock className="h-3 w-48" />
      <SkeletonBlock className="h-12 w-full rounded-xl" />
      <div className="flex justify-end gap-2 mt-auto">
        <SkeletonBlock className="h-8 w-24 rounded-lg" />
        <SkeletonBlock className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

export const TableRowSkeleton = ({ cols = 6 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <SkeletonBlock className={`h-4 ${i === 0 ? 'w-8' : i === 1 ? 'w-32' : 'w-16'} mx-auto`} />
      </td>
    ))}
  </tr>
);

export const LeaderboardSkeleton = () => (
  <div className="space-y-0 divide-y divide-gray-100 dark:divide-white/5">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-6 py-4">
        <SkeletonBlock className={`w-8 h-8 rounded-full ${shimmer}`} />
        <SkeletonBlock className="w-10 h-10 rounded-full" />
        <SkeletonBlock className="h-4 w-28" />
        <div className="flex-1" />
        <SkeletonBlock className="h-4 w-14" />
        <SkeletonBlock className="h-4 w-14" />
        <SkeletonBlock className="h-2 w-20 rounded-full" />
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => <StatSkeleton key={i} />)}
    </div>
    <div className="bg-white dark:bg-[#0B1121] rounded-[1.2rem] p-6 border-2 border-slate-100 dark:border-white/5">
      <SkeletonBlock className="h-6 w-48 mb-4" />
      <SkeletonBlock className="h-64 w-full rounded-xl" />
    </div>
  </div>
);

// Default export for simple usage
const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  const Component = type === 'stat' ? StatSkeleton :
                    type === 'report' ? ReportCardSkeleton :
                    type === 'leaderboard' ? LeaderboardSkeleton :
                    type === 'dashboard' ? DashboardSkeleton : ReportCardSkeleton;

  if (type === 'dashboard' || type === 'leaderboard') return <Component />;

  return (
    <div className={type === 'stat' ? 'grid grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-4'}>
      {Array.from({ length: count }).map((_, i) => <Component key={i} />)}
    </div>
  );
};

export default SkeletonLoader;
