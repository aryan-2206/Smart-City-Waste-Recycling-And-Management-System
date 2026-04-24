import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Medal, Crown, Zap,
    CheckSquare, RefreshCw, Info,
    Search, TrendingUp,
    ArrowUpDown, User as UserIcon,
    Star, FileText, CheckCircle2, Award, Flame, MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PageHeader from '../components/PageHeader';
import SkeletonLoader from '../components/SkeletonLoader';
import { toast } from 'react-hot-toast';

const UserAvatar = ({ name, avatar, size = "w-10 h-10", className = "" }) => (
    <div className={`${size} rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-emerald-500 font-black shrink-0 ${className}`}>
        {avatar ? <img src={avatar} className="w-full h-full object-cover" alt={name} /> : (name ? name.charAt(0).toUpperCase() : '?')}
    </div>
);

// Animated number counter
const AnimatedNumber = ({ value }) => {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        let start = 0;
        const end = Number(value) || 0;
        if (start === end) { setDisplay(end); return; }
        const step = Math.ceil(end / 30);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setDisplay(end); clearInterval(timer); }
            else setDisplay(start);
        }, 20);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{display}</span>;
};

// Podium component
const Podium = ({ top3 }) => {
    if (!top3 || top3.length < 3) return null;

    const podiumConfig = [
        { rank: 2, user: top3[1], height: 'h-24', color: 'from-slate-300 to-slate-400', crown: '🥈', delay: 0.2, textColor: 'text-slate-600' },
        { rank: 1, user: top3[0], height: 'h-36', color: 'from-amber-400 to-yellow-500', crown: '🥇', delay: 0,   textColor: 'text-amber-700' },
        { rank: 3, user: top3[2], height: 'h-16', color: 'from-orange-400 to-amber-500', crown: '🥉', delay: 0.3, textColor: 'text-orange-700' },
    ];

    return (
        <div className="relative flex items-end justify-center gap-3 pt-8 pb-0 mb-6">
            {/* Crown for #1 */}
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 20 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl z-10"
            >
                👑
            </motion.div>

            {podiumConfig.map(({ rank, user, height, color, crown, delay, textColor }, i) => (
                <motion.div
                    key={rank}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay, type: 'spring', stiffness: 300, damping: 24 }}
                    className="flex flex-col items-center gap-2"
                >
                    {/* Avatar */}
                    <div className="relative">
                        <UserAvatar
                            name={user.name}
                            avatar={user.avatar}
                            size={rank === 1 ? 'w-14 h-14' : 'w-11 h-11'}
                            className={rank === 1 ? 'border-amber-400 border-[3px] shadow-lg shadow-amber-400/30' : ''}
                        />
                        <span className="absolute -top-2 -right-2 text-base">{crown}</span>
                    </div>

                    {/* Name + Score */}
                    <div className="text-center max-w-[80px]">
                        <p className={`text-[10px] font-black line-clamp-1 ${rank === 1 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>
                            {user.name?.split(' ')[0]}
                        </p>
                        <p className={`text-[12px] font-black ${rank === 1 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {user.totalScore}pts
                        </p>
                    </div>

                    {/* Podium bar */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: delay + 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                        style={{ transformOrigin: 'bottom' }}
                        className={`w-20 ${height} bg-gradient-to-t ${color} rounded-t-xl shadow-lg flex items-start justify-center pt-2`}
                    >
                        <span className={`text-base font-black ${textColor}`}>#{rank}</span>
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
};

export const Leaderboard = () => {
    const { user: currentUser } = useAuth();
    const { theme } = useTheme();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showPodium, setShowPodium] = useState(true);
    const [filters, setFilters] = useState({
        searchTerm: '',
        timeFilter: 'all',
        sortBy: 'latest',
        zone: 'All'
    });

    const isDark = theme === 'dark';

    const filterOpts = [
        { id: 'all', label: 'All Rankers' },
        { id: 'top10', label: 'Top 10' },
        { id: 'top50', label: 'Top 50' },
    ];

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get('/api/leaderboard');
            setLeaderboard(res.data || []);
        } catch (error) {
            console.error('Failed to fetch leaderboard data', error);
            toast.error('Failed to sync live rankings');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchLeaderboard();
        setRefreshKey(prev => prev + 1);
        setTimeout(() => setIsRefreshing(false), 300);
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const filteredLeaderboard = useMemo(() => {
        let result = leaderboard.filter(u => u.role !== 'admin');

        if (filters.searchTerm) {
            const query = filters.searchTerm.toLowerCase().trim();
            result = result.filter(u => u.name.toLowerCase().includes(query));
        }

        if (filters.zone !== 'All') {
            result = result.filter(u => (u.zone || '').toLowerCase() === filters.zone.toLowerCase());
        }

        if (filters.timeFilter === 'top10') result = result.slice(0, 10);
        else if (filters.timeFilter === 'top50') result = result.slice(0, 50);

        if (filters.sortBy === 'oldest') result = [...result].reverse();

        return result;
    }, [leaderboard, filters]);

    // Unique zones from leaderboard
    const zones = useMemo(() => {
        const z = [...new Set(leaderboard.map(u => u.zone).filter(Boolean))];
        return ['All', ...z];
    }, [leaderboard]);

    const top3 = filteredLeaderboard.slice(0, 3);
    const rest = showPodium ? filteredLeaderboard.slice(3) : filteredLeaderboard;

    if (loading) {
        return (
            <div className="space-y-6 max-w-[1440px] mx-auto px-[12px] md:px-[40px] lg:px-[60px] pt-24 min-h-screen">
                <SkeletonLoader type="leaderboard" count={1} />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10 max-w-[1440px] mx-auto px-[12px] md:px-[40px] lg:px-[60px] pt-24 min-h-screen bg-white dark:bg-[#0B1121] transition-colors">
            {/* Header */}
            <PageHeader
                icon={Trophy}
                title="Global Leaderboard"
                subtitle="Top performers and consistency across the entire platform."
                right={
                    <div className="flex items-center gap-2">
                        <motion.div
                            key={refreshKey}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="hidden lg:flex items-center gap-3 px-6 py-2.5 bg-emerald-600 rounded-full shadow-lg shadow-emerald-600/25 border border-transparent hover:border-white/50 transition-all cursor-default relative overflow-hidden min-w-[220px]"
                        >
                            <div className="absolute inset-0 opacity-[0.1] pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '12px 12px' }}>
                            </div>
                            <div className="relative z-10 w-full text-center sm:text-left">
                                <p className="text-[10px] font-bold text-white/90 tracking-wide uppercase">Top Contributors</p>
                                <div className="flex items-baseline gap-1.5 justify-center sm:justify-start">
                                    <span className="text-3xl font-black tabular-nums text-white leading-tight">
                                        <AnimatedNumber value={filteredLeaderboard.length} />
                                    </span>
                                    <span className="text-[11px] font-black text-white/80 uppercase">Active</span>
                                </div>
                                <p className="text-[9px] font-semibold text-white/60 italic mt-0.5 whitespace-nowrap">Actively competing for Rank 1</p>
                            </div>
                        </motion.div>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className={`shrink-0 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-500 hover:text-emerald-500 transition-all hover:shadow-md ${isRefreshing ? 'cursor-not-allowed opacity-50' : ''}`}
                            title="Refresh Data"
                        >
                            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : 'hover:scale-110'} />
                        </button>
                    </div>
                }
            />

            <motion.div
                key={refreshKey}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
            >
                {/* Filter Bar */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-center gap-2">
                        <div className="relative flex-1 group">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isRefreshing ? 'text-emerald-500 animate-pulse' : 'text-gray-400'}`} size={16} />
                            <input
                                type="text"
                                placeholder="Search by contributor name..."
                                value={filters.searchTerm}
                                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                                className="w-full pl-11 pr-4 h-[38px] bg-transparent border-2 border-gray-100 dark:border-gray-800 rounded-xl focus:border-emerald-500 text-[13px] text-gray-900 dark:text-white outline-none transition-all placeholder-gray-400 shadow-sm"
                            />
                        </div>
                        <button
                            onClick={() => setFilters(prev => ({ ...prev, sortBy: prev.sortBy === 'latest' ? 'oldest' : 'latest' }))}
                            className="flex items-center gap-1.5 px-4 h-[38px] rounded-xl text-[10px] font-black capitalize transition-all bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-500 hover:text-emerald-500 shadow-sm shrink-0"
                        >
                            <ArrowUpDown size={11} className="text-emerald-500" />
                            {filters.sortBy === 'latest' ? 'Newest' : 'Oldest'}
                        </button>
                        <button
                            onClick={() => setShowPodium(!showPodium)}
                            className={`flex items-center gap-1.5 px-4 h-[38px] rounded-xl text-[10px] font-black transition-all border-2 shadow-sm shrink-0 ${showPodium ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500 hover:text-amber-500'}`}
                        >
                            <Crown size={11} />
                            Podium
                        </button>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-wrap">
                        {filterOpts.map(pill => (
                            <button
                                key={pill.id}
                                onClick={() => setFilters(prev => ({ ...prev, timeFilter: pill.id }))}
                                className={`px-3.5 py-1.5 rounded-lg text-[11px] font-black capitalize transition-all whitespace-nowrap ${filters.timeFilter === pill.id
                                    ? 'bg-emerald-600 text-white shadow-lg border-none'
                                    : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-gray-100 dark:border-gray-800'
                                }`}
                            >
                                {pill.label}
                            </button>
                        ))}

                        {/* Zone Filter */}
                        <div className="flex items-center gap-1 ml-auto">
                            <MapPin size={12} className="text-emerald-500 shrink-0" />
                            {zones.map(z => (
                                <button
                                    key={z}
                                    onClick={() => setFilters(prev => ({ ...prev, zone: z }))}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black capitalize transition-all whitespace-nowrap ${filters.zone === z
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-transparent text-gray-500 border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {z === 'All' ? 'All Zones' : `${z} Zone`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Podium Section */}
                <AnimatePresence>
                    {showPodium && filteredLeaderboard.length >= 3 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/10 rounded-3xl border border-amber-200/50 dark:border-amber-800/20 overflow-hidden"
                        >
                            <div className="px-6 pt-4 pb-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown size={16} className="text-amber-500" />
                                    <h3 className="text-[13px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider">Top 3 Champions</h3>
                                </div>
                                <Podium top3={filteredLeaderboard.slice(0, 3)} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Table */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1250px]">
                        <thead className="text-center">
                            <tr className="bg-emerald-500/10 dark:bg-emerald-500/5 border-b-2 border-gray-800/20 dark:border-white/30">
                                <th className="px-3 py-3 text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-20">Rank</th>
                                <th className="px-[15px] py-3 text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20">Contributor</th>
                                <th className="px-5 py-3 text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20">Role</th>
                                <th className="px-5 py-3 text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20">Total Score</th>
                                <th className="px-5 py-3 text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20">Daily Score</th>
                                <th className="px-5 py-3 text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20">Reports</th>
                                <th className="px-5 py-3 text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20">Resolved</th>
                                <th className="px-5 py-3 text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20">Badges</th>
                                <th className="px-5 py-3 text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center">Success Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/10 dark:divide-white/20">
                            <AnimatePresence mode='popLayout'>
                                {(showPodium ? rest : filteredLeaderboard).map((u, i) => {
                                    const displayRank = showPodium ? i + 4 : i + 1;
                                    const isMe = u.id === currentUser?.id;
                                    const isTop3 = displayRank <= 3;
                                    return (
                                        <motion.tr
                                            key={u.id || i}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2, delay: i * 0.03 }}
                                            className={`hover:bg-[#47C4B7]/5 transition-colors group ${isMe ? 'bg-emerald-500/5' : ''}`}
                                        >
                                            <td className="px-5 py-3 text-center border-r border-gray-800/10 dark:border-white/20">
                                                <div className="flex flex-col items-center justify-center">
                                                    {displayRank <= 3 ? (
                                                        <span className="text-lg">{['🥇','🥈','🥉'][displayRank - 1]}</span>
                                                    ) : (
                                                        <span className="text-xs font-black text-gray-800 dark:text-gray-200">{String(displayRank).padStart(2, '0')}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-[15px] py-3 border-r border-gray-800/10 dark:border-white/20">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar name={u.name} avatar={u.avatar} size="w-9 h-9" className={displayRank === 1 ? 'border-amber-400' : ''} />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-white whitespace-nowrap flex items-center gap-2">
                                                            {u.name}
                                                            {isMe && <span className="px-2 py-0.5 bg-emerald-500 text-[9px] text-white rounded-full">YOU</span>}
                                                        </span>
                                                        {u.zone && <span className="text-[10px] text-gray-400 capitalize">{u.zone} Zone</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center border-r border-gray-800/10 dark:border-white/20">
                                                <span className={`text-[11px] font-black capitalize tracking-wider ${
                                                    u.role === 'admin' ? 'text-purple-600' :
                                                    u.role === 'Swachhta Mitra' ? 'text-blue-600' : 'text-emerald-600'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center border-r border-gray-800/10 dark:border-white/20">
                                                <span className="text-sm font-black text-amber-600 dark:text-amber-500">
                                                    <AnimatedNumber value={u.totalScore} />
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center border-r border-gray-800/10 dark:border-white/20">
                                                <span className="text-sm font-black text-emerald-600">{u.dailyScore > 0 ? `+${u.dailyScore}` : '0'}</span>
                                            </td>
                                            <td className="px-6 py-3 text-center border-r border-gray-800/10 dark:border-white/20">
                                                <span className="text-sm font-black text-slate-700 dark:text-slate-200">{u.totalReports}</span>
                                            </td>
                                            <td className="px-6 py-3 text-center border-r border-gray-800/10 dark:border-white/20 font-black text-emerald-500">
                                                <span className="text-sm font-black">{u.resolvedReports}</span>
                                            </td>
                                            <td className="px-6 py-3 text-center border-r border-gray-800/10 dark:border-white/20">
                                                <span className="text-sm font-black text-gray-800 dark:text-gray-200">{u.badgeCount}</span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="w-24 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${u.successRate}%` }}
                                                            transition={{ duration: 0.8, delay: i * 0.02 }}
                                                            className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                                                        />
                                                    </div>
                                                    <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase">{u.successRate}%</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {filteredLeaderboard.length === 0 && (
                        <div className="py-24 text-center">
                            <Info size={40} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-sm font-bold text-gray-400 italic">No contributors found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Leaderboard;
