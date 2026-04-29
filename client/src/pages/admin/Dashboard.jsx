import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Wallet, Trophy, Zap, RefreshCcw, TrendingUp, Users as UsersIcon, Truck, FileText, CheckCircle2, Clock,
    Map, Flame, AlertTriangle, Wifi, WifiOff
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import useSSE from '../../hooks/useSSE';
import { StatSkeleton } from '../../components/SkeletonLoader';

/* ─────────────────────────────────────────────────────────────────
   HoverCard & StatCard Components (Premium Sync)
───────────────────────────────────────────────────────────────── */
const cardBaseStyle = {
    transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, border-color 0.28s ease',
};
const cardHoverStyle = {
    transform: 'scale(1.04) translateY(-4px)',
    boxShadow: '0 20px 40px -8px rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
};

const HoverCard = ({ children, className, delay, rKey }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <motion.div
            key={rKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay || 0, ease: 'easeOut' }}
            className={className}
            style={{ ...cardBaseStyle, ...(hovered ? cardHoverStyle : {}) }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </motion.div>
    );
};

const StatCard = ({ label, value, icon: Icon, colorClass, delay, rKey, subValue }) => {
    return (
        <HoverCard
            rKey={rKey}
            delay={delay}
            className="glass-card bg-white dark:bg-[#0B1121] border-2 border-slate-100 dark:border-white/5 rounded-[0.8rem] sm:p-4 p-3 flex flex-col justify-center shadow-lg h-full min-h-[70px] sm:min-h-[85px] transition-all duration-300"
        >
            <div className="flex items-center gap-2 sm:gap-3">
                <div className={`sm:w-10 sm:h-10 w-8 h-8 rounded-full ${colorClass.replace('text-', 'bg-')}/10 flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={`${colorClass} sm:w-5 sm:h-5 w-4 h-4`} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="sm:text-[15px] text-[10px] font-black text-gray-500 dark:text-gray-400 leading-none mb-1 sm:mb-1.5 truncate">{label}</p>
                    <div className="flex items-baseline gap-1 sm:gap-1.5">
                        <h3 className="sm:text-xl text-[15px] font-black text-[#1a202c] dark:text-white leading-tight">
                            {value}
                        </h3>
                        {subValue && (
                            <span className="sm:text-[10px] text-[8px] font-bold text-emerald-600 dark:text-emerald-400">
                                {subValue}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </HoverCard>
    );
};

/* ─────────────────────────────────────────────────────────────────
   CustomTooltip Component (Premium Admin UI)
───────────────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;

    const Row = ({ label, value, color }) => (
        <div className="flex items-center justify-between gap-6 py-1">
            <span className="text-[13px] font-bold" style={{ color }}>{label}:</span>
            <span className="text-[13px] font-black text-gray-700 dark:text-gray-200">{value}</span>
        </div>
    );

    return (
        <div className="relative bg-white dark:bg-[#0d1a2e] border border-gray-200 dark:border-gray-700 px-5 py-4 rounded-xl shadow-2xl min-w-[200px] animate-scale-in">
            {/* Arrow */}
            <div className="absolute w-3 h-3 bg-white dark:bg-[#0d1a2e] border-b border-l border-gray-200 dark:border-gray-700 -bottom-[7px] left-3 rotate-[-45deg]" />

            {/* Period Header */}
            <p className="text-[14px] font-black text-emerald-500 tracking-wider mb-2 pb-1.5 border-b border-slate-50 dark:border-white/5">
                {label}
            </p>

            <div className="space-y-0.5">
                <Row label="Total Reports" value={d.total ?? 0} color="#6366f1" />
                <Row label="Total Badges" value={d.badges ?? 0} color="#f59e0b" />

                {/* Second Separator exactly like image */}
                <div className="border-t border-slate-50 dark:border-white/5 my-2.5" />

                <Row label="Resolved" value={d.resolved ?? 0} color="#10b981" />
                <Row label="In Progress" value={d.inProgress ?? 0} color="#3b82f6" />
                <Row label="Pending" value={d.pending ?? 0} color="#f97316" />
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────
   Zone Heatmap Component
───────────────────────────────────────────────────────────────── */
const ZoneHeatmap = ({ reports = [] }) => {
    const zoneSummary = useMemo(() => {
        const map = {};
        reports.forEach(r => {
            const z = (r.zone || 'Unknown').toUpperCase();
            if (!map[z]) map[z] = { total: 0, resolved: 0, pending: 0, inProgress: 0, high: 0 };
            map[z].total++;
            if (r.status === 'Resolved') map[z].resolved++;
            else if (r.status === 'In Progress') map[z].inProgress++;
            else map[z].pending++;
            if (r.urgency === 'High') map[z].high++;
        });
        return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
    }, [reports]);

    if (zoneSummary.length === 0) return (
        <div className="flex items-center justify-center h-32 text-slate-400 text-sm font-medium">No zone data available yet.</div>
    );

    const maxTotal = Math.max(...zoneSummary.map(([, v]) => v.total), 1);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {zoneSummary.map(([zone, stats], idx) => {
                const intensity = stats.total / maxTotal;
                const bg = `rgba(16,185,129,${0.05 + intensity * 0.35})`;
                const border = `rgba(16,185,129,${0.15 + intensity * 0.4})`;
                const isHot = stats.high > 0;
                return (
                    <motion.div
                        key={zone}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        className="zone-heatmap-cell relative rounded-2xl p-4 border cursor-default group"
                        style={{ background: bg, borderColor: border }}
                        title={`Zone ${zone}: ${stats.total} reports, ${stats.resolved} resolved`}
                    >
                        {isHot && (
                            <span className="absolute top-2 right-2 text-xs animate-urgency-pulse" title="High urgency reports">
                                🔥
                            </span>
                        )}
                        <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">{zone}</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white mb-1">{stats.total}</p>
                        <div className="flex flex-col gap-0.5 text-[9px] font-bold">
                            <span className="text-emerald-600">✓ {stats.resolved}</span>
                            <span className="text-blue-500">↻ {stats.inProgress}</span>
                            <span className="text-amber-500">◷ {stats.pending}</span>
                        </div>
                        {/* Heat bar */}
                        <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div style={{ width: `${intensity * 100}%`, background: isHot ? '#ef4444' : '#10b981' }} className="h-full rounded-full transition-all duration-700" />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [allReports, setAllReports] = useState([]);
    const [timeframe, setTimeframe] = useState('7D');
    const [escalating, setEscalating] = useState(false);
    const [liveUpdates, setLiveUpdates] = useState([]);
    const activeModule = sessionStorage.getItem('adminModule') || 'citizen';

    // SSE real-time connection
    const { connected } = useSSE('/api/sse', {
        onEvent: useCallback((type, eventData) => {
            if (type === 'report_status_update') {
                setLiveUpdates(prev => [eventData, ...prev].slice(0, 5));
                // Also refresh dashboard data
                fetchAdminData();
            }
            if (type === 'escalation_run') {
                toast.success(`⚡ Auto-escalated ${eventData.escalated} reports to High urgency`);
                fetchAdminData();
            }
        }, []),
    });

    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [dashRes, reportsRes] = await Promise.all([
                axios.get(`/api/dashboard/admin`, { headers: { 'x-auth-token': token } }),
                axios.get(`/api/reports`, { headers: { 'x-auth-token': token }, params: { limit: 200 } })
            ]);
            setData(dashRes.data);
            setAllReports(reportsRes.data?.reports || []);
        } catch (err) {
            console.error('Admin Data Fetch Failed:', err);
        }
    };

    const handleEscalate = async () => {
        setEscalating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/reports/escalate', {}, { headers: { 'x-auth-token': token } });
            toast.success(res.data.message);
            fetchAdminData();
        } catch (err) {
            toast.error('Escalation failed');
        } finally {
            setEscalating(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
        const interval = setInterval(() => fetchAdminData(), 30000);
        return () => clearInterval(interval);
    }, [activeModule]);

    const stats = useMemo(() => {
        if (!data) return null;
        return activeModule === 'citizen' ? data.citizenStats : data.mitraStats;
    }, [data, activeModule]);

    const growthData = useMemo(() => {
        if (!data) return [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const today = new Date();

        const rawDaily = activeModule === 'citizen' ? data.citizenGrowth : data.mitraGrowth;
        const rawMonthly = activeModule === 'citizen' ? data.citizenMonthly : data.mitraMonthly;
        const rawYearly = activeModule === 'citizen' ? data.citizenYearly : data.mitraYearly;

        let result = [];
        if (timeframe === '7D') {
            result = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(today);
                d.setDate(today.getDate() - (6 - i));
                const key = d.toLocaleDateString('en-CA'); // YYYY-MM-DD local format

                const found = rawDaily?.find(r => r.name === key) || {
                    score: 0,
                    total: 0,
                    resolved: 0,
                    inProgress: 0,
                    pending: 0,
                    badges: 0
                };
                return {
                    name: dayNames[d.getDay()],
                    score: found.score,
                    total: found.total,
                    resolved: found.resolved,
                    inProgress: found.inProgress,
                    pending: found.pending,
                    badges: found.badges
                };
            });
        } else if (timeframe === '1M') {
            const year = today.getFullYear();
            result = monthNames.map((name, m) => {
                const monthKey = `${year}-${String(m + 1).padStart(2, '0')}`;
                const found = rawMonthly?.find(r => r.name === monthKey);
                return {
                    name,
                    score: found?.score ?? 0,
                    total: found?.total || 0,
                    resolved: found?.resolved || 0,
                    inProgress: found?.inProgress || 0,
                    pending: found?.pending || 0
                };
            });
        } else if (timeframe === '1Y') {
            const currentYear = today.getFullYear();
            result = [currentYear - 2, currentYear - 1, currentYear].map(yr => {
                const yrStr = String(yr);
                const found = rawYearly?.find(r => r.name === yrStr);
                return {
                    name: yrStr,
                    score: found?.score ?? 0,
                    total: found?.total || 0,
                    resolved: found?.resolved || 0,
                    inProgress: found?.inProgress || 0,
                    pending: found?.pending || 0
                };
            });
        }

        return result;
    }, [data, timeframe, activeModule]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-10">
            <PageHeader
                title={activeModule === 'citizen' ? 'Citizen Dashboard' : 'Swachhta Mitra Dashboard'}
                subtitle={`Overview of all ${activeModule} module metrics and system performance.`}
                icon={activeModule === 'citizen' ? UsersIcon : Truck}
                right={
                    <div className="flex items-center gap-2">
                        {/* SSE Live indicator */}
                        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black border ${
                            connected ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                            {connected ? <Wifi size={11} className="animate-pulse" /> : <WifiOff size={11} />}
                            {connected ? 'LIVE' : 'OFFLINE'}
                        </div>
                        {/* Escalation trigger */}
                        <button
                            onClick={handleEscalate}
                            disabled={escalating}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[11px] font-black rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Flame size={12} />{escalating ? 'Escalating...' : 'Run Escalation'}
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {activeModule === 'citizen' ? (
                    <>
                        <StatCard label="Total Citizen" value={stats?.totalUsers || 0} icon={UsersIcon} colorClass="text-indigo-600" delay={0} rKey="total-citizen" />
                        <StatCard label={<>Total <span className="hidden sm:inline">Impact </span>Score</>} value={stats?.totalScore || 0} icon={Wallet} colorClass="text-emerald-500" delay={0.05} rKey="total-impact" />
                        <StatCard label={<>Daily <span className="hidden sm:inline">Impact </span>Score</>} value={stats?.dailyScore || 0} icon={Zap} colorClass="text-amber-500" delay={0.1} rKey="daily-impact" />
                        <StatCard label="Total Badges" value={stats?.totalBadges || 0} icon={Trophy} colorClass="text-amber-500" delay={0.15} rKey="total-badges" />
                        <StatCard label="Total Reports" value={stats?.totalReports || 0} icon={FileText} colorClass="text-slate-600" delay={0.2} rKey="total-reports" />
                        <StatCard label="Resolved" value={stats?.resolved || 0} icon={CheckCircle2} colorClass="text-emerald-500" delay={0.25} rKey="resolved" />
                        <StatCard label="In Progress" value={stats?.inProgress || 0} icon={RefreshCcw} colorClass="text-blue-500" delay={0.3} rKey="in-progress" />
                        <StatCard label="Pending" value={stats?.pending || 0} icon={Clock} colorClass="text-amber-500" delay={0.35} rKey="pending" />
                    </>
                ) : (
                    <>
                        <StatCard label={<>Total <span className="hidden sm:inline">Swachhta </span>Mitra</>} value={stats?.totalUsers || 0} icon={Truck} colorClass="text-emerald-600" delay={0} rKey="total-mitra" />
                        <StatCard label={<>Total <span className="hidden sm:inline">Operation </span>Score</>} value={stats?.totalScore || 0} icon={Wallet} colorClass="text-blue-600" delay={0.05} rKey="total-op-score" />
                        <StatCard label={<>Daily <span className="hidden sm:inline">Performance </span>Score</>} value={stats?.dailyScore || 0} icon={Zap} colorClass="text-amber-500" delay={0.1} rKey="daily-perf" />
                        <StatCard label="Total Reports" value={stats?.totalReports || 0} icon={FileText} colorClass="text-slate-600" delay={0.15} rKey="total-reports-mitra" />
                        <StatCard label="Total Badges" value={stats?.totalBadges || 0} icon={Trophy} colorClass="text-amber-500" delay={0.2} rKey="total-badges-mitra" />
                        <StatCard label="Resolved" value={stats?.resolved || 0} icon={CheckCircle2} colorClass="text-emerald-500" delay={0.25} rKey="resolved-mitra" />
                        <StatCard label="In Progress" value={stats?.inProgress || 0} icon={RefreshCcw} colorClass="text-blue-500" delay={0.3} rKey="in-progress-mitra" />
                        <StatCard label="Pending" value={stats?.pending || 0} icon={Clock} colorClass="text-amber-500" delay={0.35} rKey="pending-mitra" />
                    </>
                )}
            </div>

            {/* ── Momentum Graph (Citizen Exact Replica) ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="glass-card bg-white dark:bg-[#0B1121] border-2 border-gray-50 dark:border-white/5 rounded-[1.2rem] p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-emerald-500/20"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3 relative">
                        <div className="p-2 bg-emerald-50 rounded-xl dark:bg-emerald-950/20 text-emerald-600">
                            <TrendingUp size={18} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-[17px] font-black text-gray-800 dark:text-gray-200 tracking-tight">Overall Impact Momentum</h2>
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-white/5 rounded-2xl">
                        {[
                            { id: '7D', label: 'Last 7 Days' },
                            { id: '1M', label: 'Monthly' },
                            { id: '1Y', label: 'Yearly' }
                        ].map(pill => (
                            <button
                                key={pill.id}
                                onClick={() => setTimeframe(pill.id)}
                                className={`px-5 py-2 rounded-xl text-[11px] font-black tracking-wide transition-all ${timeframe === pill.id
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                    }`}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-64 sm:h-72 md:h-80 w-full">
                    {growthData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAdminImpact" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.4} />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis
                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={40}
                                    domain={[0, 'auto']}
                                />
                                <Tooltip
                                    content={(props) => (
                                        <CustomTooltip
                                            {...props}
                                            overallStats={stats}
                                        />
                                    )}
                                    cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={4} fill="url(#colorAdminImpact)" activeDot={{ r: 8, fill: '#10b981', stroke: '#fff', strokeWidth: 3 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-300 font-black tracking-widest text-[10px] italic">Awaiting synchronized metrics...</div>
                    )}
                </div>
            </motion.div>

            {/* Zone Heatmap */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="glass-card bg-white dark:bg-[#0B1121] border-2 border-gray-50 dark:border-white/5 rounded-[1.2rem] p-6 sm:p-8 shadow-xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-xl dark:bg-emerald-950/20 text-emerald-600">
                            <Map size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-[17px] font-black text-gray-800 dark:text-gray-200 tracking-tight">Zone Performance Heatmap</h2>
                            <p className="text-[11px] text-gray-400 mt-0.5">Heat intensity = report volume · 🔥 = High-urgency active</p>
                        </div>
                    </div>
                    {/* Live updates ticker */}
                    <AnimatePresence>
                        {liveUpdates.length > 0 && (
                            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                                className="hidden lg:flex flex-col gap-1 max-w-[220px]">
                                {liveUpdates.slice(0,2).map((u, i) => (
                                    <div key={i} className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-lg truncate">
                                        ⚡ {u.area} → {u.status}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <ZoneHeatmap reports={allReports} />
            </motion.div>
        </div>
    );
};

export default AdminDashboard;