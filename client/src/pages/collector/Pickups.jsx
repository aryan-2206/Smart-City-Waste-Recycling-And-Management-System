import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Truck, 
    MapPin, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    ChevronRight, 
    Search, 
    Filter,
    Loader2,
    Calendar,
    ArrowLeft,
    Play,
    Check,
    X,
    FileText as FileTextIcon,
    ChevronDown,
    Map
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import useDebounce from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

const CollectorPickups = () => {
    const navigate = useNavigate();
    const locationState = useLocation();
    const { user } = useAuth();

    // Hover styles matching Dashboard
    const cardBaseStyle = {
        transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, border-color 0.28s ease',
    };
    const cardHoverStyle = {
        transform: 'scale(1.01) translateY(-2px)',
        boxShadow: '0 20px 40px -8px rgba(16, 185, 129, 0.12)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
    };

    const [hoveredCard, setHoveredCard] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewingReport, setViewingReport] = useState(null);

    // Sync Filters State
    const queryParams = new URLSearchParams(locationState.search);
    const initialStatus = queryParams.get('status') || 'All';

    const [filters, setFilters] = useState({
        status: initialStatus,
        topic: '', // search query
        from: '',
        to: '',
        timeFilter: 'all',
        urgency: 'All',
        sortBy: 'newest'
    });

    const [expandedReports, setExpandedReports] = useState(new Set());

    const toggleExpandReport = (reportId) => {
        const newExpanded = new Set(expandedReports);
        if (newExpanded.has(reportId)) {
            newExpanded.delete(reportId);
        } else {
            newExpanded.add(reportId);
        }
        setExpandedReports(newExpanded);
    };

    const debouncedSearch = useDebounce(filters.topic, 500);

    useEffect(() => {
        if (user?.zone) {
            fetchPickups();
        }
    }, [filters.status, debouncedSearch, filters.from, filters.to, filters.timeFilter, user?.zone]);

    const fetchPickups = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/reports', {
                headers: { 'x-auth-token': token },
                params: {
                    zone: user.zone,
                    status: filters.status === 'All' ? '' : filters.status,
                    search: debouncedSearch,
                }
            });
            setReports(res.data.reports || []);
        } catch (err) {
            setError('Failed to load pickups. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/reports/${id}/status`, { status }, {
                headers: { 'x-auth-token': token }
            });
            toast.success(`Pickup updated to ${status}`);
            fetchPickups();
            if (viewingReport?._id === id) {
                // Update modal data if open
                setViewingReport(prev => ({ ...prev, status }));
            }
        } catch (err) {
            toast.error('Failed to update status.');
            console.error('Failed to update status:', err);
        }
    };

    const filteredReportsList = useMemo(() => {
        let list = reports.filter(report => {
            const dateObj = new Date(report.createdAt);
            let fromDate = filters.from ? new Date(filters.from) : null;
            let toDate = filters.to ? new Date(filters.to) : null;

            if (filters.timeFilter !== 'all' && !filters.from && !filters.to) {
                const now = new Date();
                if (filters.timeFilter === '7d') fromDate = new Date(now.setDate(now.getDate() - 7));
                if (filters.timeFilter === 'monthly') fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
                if (filters.timeFilter === 'yearly') fromDate = new Date(now.getFullYear(), 0, 1);
            }

            let matchesAll = true;
            if (fromDate) matchesAll = matchesAll && dateObj >= fromDate;
            if (toDate) {
                const end = new Date(toDate);
                end.setHours(23, 59, 59, 999);
                matchesAll = matchesAll && dateObj <= end;
            }

            // Urgency Filter
            if (filters.urgency !== 'All') {
                matchesAll = matchesAll && report.urgency === filters.urgency;
            }

            return matchesAll;
        });

        // Sorting Logic
        const priorityMap = { High: 3, Medium: 2, Low: 1 };
        
        return list.sort((a, b) => {
            if (filters.sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (filters.sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (filters.sortBy === 'priority-high') return priorityMap[b.urgency] - priorityMap[a.urgency];
            if (filters.sortBy === 'priority-low') return priorityMap[a.urgency] - priorityMap[b.urgency];
            return 0;
        });
    }, [reports, filters]);

    const groupReportsByDate = (reportsList) => {
        const groups = {};
        reportsList.forEach(report => {
            const dateStr = new Date(report.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            }).toUpperCase();
            if (!groups[dateStr]) groups[dateStr] = [];
            groups[dateStr].push(report);
        });
        return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    };

    const groupedEntries = groupReportsByDate(filteredReportsList);

    return (
        <div className="space-y-4 max-w-7xl mx-auto animate-fade-in font-sans pb-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/collector/dashboard')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors flex lg:hidden"
                    >
                        <ArrowLeft size={24} className="text-slate-600" />
                    </button>
                    <PageHeader 
                        title="All Pickups"
                        subtitle={`Manage waste collection in ${user?.zone} Zone`}
                        icon={Truck}
                    />
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-3 sm:gap-4 mb-2"
            >
                {/* Search Row */}
                <div className="flex items-center gap-2 w-full">
                    <div className="relative group flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Search area, landmark or description..."
                            value={filters.topic}
                            onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500 text-[13px] font-medium text-slate-700 dark:text-white outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="hidden sm:flex shrink-0 items-center justify-center gap-2 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-lg shadow-lg shadow-emerald-500/20 transition-all cursor-default">
                        <Map size={16} />
                        <span className="text-[12.5px]">Active Zone: {user?.zone}</span>
                    </div>
                </div>

                {/* High-Fidelity Multi-Tier Filter Hub - Synced Mobile/Desktop Views */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-x-2 gap-y-3">
                    {/* TIER 1: Time Controls - Slider on Mobile, Integrated on Desktop */}
                    <div className="flex items-center gap-2 max-sm:w-full max-sm:overflow-x-auto max-sm:pb-1 max-sm:hide-scrollbar shrink-0">
                        {/* Date Block */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            <div className="flex items-center px-2 py-1.5 rounded-lg bg-transparent text-slate-500 border border-slate-200 dark:border-slate-800">
                                <input 
                                    type={filters.from ? "date" : "text"} 
                                    placeholder="DD-MM-YYYY"
                                    onFocus={(e) => (e.target.type = "date")}
                                    onBlur={(e) => !e.target.value && (e.target.type = "text")}
                                    value={filters.from} 
                                    onChange={e => setFilters({ ...filters, from: e.target.value, timeFilter: 'all' })} 
                                    className="bg-transparent border-none text-[12px] font-black focus:ring-0 p-0 w-[95px] outline-none uppercase" 
                                />
                            </div>
                            <div className="flex items-center px-2 py-1.5 rounded-lg bg-transparent text-slate-500 border border-slate-200 dark:border-slate-800">
                                <input 
                                    type={filters.to ? "date" : "text"} 
                                    placeholder="DD-MM-YYYY"
                                    onFocus={(e) => (e.target.type = "date")}
                                    onBlur={(e) => !e.target.value && (e.target.type = "text")}
                                    value={filters.to} 
                                    onChange={e => setFilters({ ...filters, to: e.target.value, timeFilter: 'all' })} 
                                    className="bg-transparent border-none text-[12px] font-black focus:ring-0 p-0 w-[95px] outline-none uppercase" 
                                />
                            </div>
                        </div>

                        {/* Presets Block */}
                        <div className="flex items-center gap-1 shrink-0">
                            {[{ id: '7d', label: 'Last 7 Days' }, { id: 'monthly', label: 'Monthly' }, { id: 'yearly', label: 'Yearly' }].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setFilters({ ...filters, timeFilter: item.id, from: '', to: '' })}
                                    className={`px-3 py-1.5 rounded-lg text-[12px] font-black transition-all whitespace-nowrap ${filters.timeFilter === item.id
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                        : 'bg-white dark:bg-[#0B1121] text-slate-500 border border-slate-200 dark:border-white/10'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TIER 2: Status Selection - Grid/Wrap on Mobile & Desktop */}
                    <div className="flex items-center gap-1 shrink-0 max-sm:w-full max-sm:flex-wrap">
                        {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilters({ ...filters, status })}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-black capitalize transition-all whitespace-nowrap ${filters.status === status
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                    : 'bg-white dark:bg-[#0B1121] text-slate-500 border border-slate-200 dark:border-white/10'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* TIER 3: Operational Routing - Tightly Packed on Mobile & Desktop */}
                    <div className="flex items-center gap-1.5 shrink-0 max-sm:w-full max-sm:flex-wrap">
                        <div className="relative group shrink-0">
                            <select 
                                value={filters.urgency}
                                onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                                className="appearance-none pl-2.5 pr-7 py-1.5 rounded-lg text-[12px] font-black bg-white dark:bg-[#0B1121] text-slate-500 border border-slate-200 dark:border-white/10 focus:ring-1 focus:ring-emerald-500/30 outline-none shadow-sm cursor-pointer"
                            >
                                <option value="All">All Urgency</option>
                                <option value="High">High Only</option>
                                <option value="Medium">Medium Only</option>
                                <option value="Low">Low Only</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative group shrink-0">
                            <select 
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                className="appearance-none pl-2.5 pr-7 py-1.5 rounded-lg text-[12px] font-black bg-white dark:bg-[#0B1121] text-slate-500 border border-slate-200 dark:border-white/10 focus:ring-1 focus:ring-emerald-500/30 outline-none shadow-sm cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="priority-high">Priority (H-L)</option>
                                <option value="priority-low">Priority (L-H)</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        {/* Mobile-only Active Zone Badge - Integrated next to Sort dropdown */}
                        <div className="sm:hidden flex shrink-0 items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white font-black rounded-lg shadow-lg shadow-emerald-500/20">
                            <Map size={12} />
                            <span className="text-[11px] tracking-tight whitespace-nowrap">{user?.zone}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-emerald-500" size={32} />
                    </div>
                ) : groupedEntries.length > 0 ? (
                    <div className="space-y-6">
                        {groupedEntries.map(([date, groupReports]) => (
                            <div key={date}>
                                <div className="flex items-center gap-4 mb-3 px-2">
                                    <div className="bg-slate-50 dark:bg-white/5 px-4 py-1.5 rounded-full flex items-center gap-2 border border-slate-100 dark:border-white/5 shrink-0">
                                        <Calendar size={14} className="text-emerald-500" />
                                        <span className="text-[12px] font-black text-slate-600 dark:text-slate-300 tracking-wider">{date}</span>
                                    </div>
                                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5" />
                                </div>

                                <div className="space-y-4">
                                    {groupReports.map((report, idx) => (
                                        <motion.div
                                            layout
                                            key={report._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                                            className="bg-white dark:bg-[#0B1121] rounded-[1.5rem] p-2 pb-3.5 sm:p-3 sm:pb-4 flex flex-col sm:flex-row gap-4 transition-all border-2 border-slate-100 dark:border-white/5 shadow-sm"
                                            style={{
                                                ...cardBaseStyle,
                                                ...(hoveredCard === report._id ? cardHoverStyle : {})
                                            }}
                                            onMouseEnter={() => setHoveredCard(report._id)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            {/* Left side Image */}
                                            <div className="relative shrink-0">
                                                <div className="w-full sm:w-[120px] h-36 sm:h-[120px] bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-100 dark:border-white/5">
                                                    {report.photo ? (
                                                        <img
                                                            src={report.photo}
                                                            alt="Report"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                            <FileTextIcon size={24} className="opacity-40" />
                                                            <span className="text-[10px] font-black mt-2 uppercase tracking-tighter opacity-40">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right side content */}
                                            <div className="flex-1 min-w-0 flex flex-col">
                                                {/* Header Row */}
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                        <h3 className="text-[1.05rem] font-black text-slate-800 dark:text-white capitalize tracking-tight leading-tight">
                                                            {report.location}
                                                        </h3>
                                                        <div className="hidden sm:block h-4 w-[1.5px] bg-slate-200 dark:bg-white/10" />
                                                        <span className="text-[10.5px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 capitalize">
                                                            {report.garbageType} Waste
                                                        </span>
                                                    </div>
                                                    <div className={`text-[10.5px] font-bold capitalize px-2.5 py-0.5 rounded-full border ${report.status === 'Resolved'
                                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                        : report.status === 'In Progress' 
                                                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                        }`}>
                                                        {report.status}
                                                    </div>
                                                </div>

                                                {/* Metadata */}
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-black text-slate-500 dark:text-slate-400 mb-2">
                                                    <div className="flex items-center gap-1.5 opacity-80">
                                                        <Clock size={11} strokeWidth={3} />
                                                        {new Date(report.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                    </div>
                                                    <div className="w-[1.5px] h-3 bg-slate-200 dark:bg-white/10" />
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={11} strokeWidth={3} className="text-rose-500" />
                                                        <span className="font-bold">{report.landmark || 'No Landmark'}</span>
                                                    </div>
                                                    <div className="w-[1.5px] h-3 bg-slate-200 dark:bg-white/10" />
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 font-black">
                                                        <span className="scale-75">🟡</span>
                                                        <span>{report.urgency} Urgency</span>
                                                    </div>
                                                </div>

                                                {/* Description Box */}
                                                <div className="relative mb-2.5 p-2.5 bg-slate-50 dark:bg-black/10 rounded-xl border border-slate-100 dark:border-white/5 transition-all">
                                                    <div className="relative">
                                                        <p className={`text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line ${expandedReports.has(report._id) ? '' : 'line-clamp-2 pr-16'}`}>
                                                            {report.description}
                                                        </p>
                                                        {!expandedReports.has(report._id) && report.description?.length > 50 && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleExpandReport(report._id);
                                                                }}
                                                                className="absolute bottom-0 right-0 px-2 py-0.5 text-[11px] font-black text-emerald-600 hover:text-emerald-700 transition-all bg-white/90 dark:bg-slate-900/80 rounded-lg shadow-sm border border-slate-100 dark:border-white/10"
                                                            >
                                                                Read more
                                                            </button>
                                                        )}
                                                        {expandedReports.has(report._id) && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleExpandReport(report._id);
                                                                }}
                                                                className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 mt-2 flex items-center justify-end w-full hover:underline transition-all"
                                                            >
                                                                Show less
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Bar */}
                                                <div className="flex items-center justify-end gap-2 mt-auto pt-2.5 border-t border-slate-50 dark:border-white/5">
                                                    {report.status === 'Pending' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleUpdateStatus(report._id, 'In Progress')}
                                                                className="flex items-center gap-1.5 text-[11px] font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-all px-3 py-1.5 rounded-lg active:scale-95 whitespace-nowrap"
                                                            >
                                                                <Play size={12} /> Accept Pickup
                                                            </button>
                                                            <button 
                                                                onClick={() => handleUpdateStatus(report._id, 'Pending')}
                                                                className="flex items-center gap-1.5 text-[11px] font-black text-white bg-rose-600 hover:bg-rose-700 transition-all px-3 py-1.5 rounded-lg active:scale-95 whitespace-nowrap"
                                                            >
                                                                <X size={12} /> Decline
                                                            </button>
                                                        </>
                                                    )}
                                                    {report.status === 'In Progress' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                                                            className="flex items-center gap-1.5 text-[11px] font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-all px-3 py-1.5 rounded-lg active:scale-95"
                                                        >
                                                            <Check size={12} /> Mark as Complete
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setViewingReport(report)}
                                                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[12.5px] font-black rounded-lg shadow-lg shadow-emerald-500/20 transition-all ml-1"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-5 border border-slate-100 dark:border-white/5">
                            <Truck size={28} className="text-slate-300" />
                        </div>
                        <h3 className="text-[1.05rem] font-bold text-slate-600 dark:text-slate-300 tracking-tight">No cleanups found</h3>
                        <p className="text-[0.8125rem] text-slate-400 mt-1 max-w-[250px] mx-auto leading-relaxed">
                            Try adjusting your search terms or filter settings to see more results
                        </p>
                    </div>
                )}
            </div>

            {/* ---------- VIEW PICKUP MODAL (SYNCED WITH CITIZEN) ---------- */}
            <AnimatePresence>
                {viewingReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-white dark:bg-[#0B1121] rounded-2xl w-full max-w-[420px] max-h-[85vh] overflow-hidden shadow-2xl relative border border-slate-100 dark:border-white/5 flex flex-col"
                        >
                            <button
                                onClick={() => setViewingReport(null)}
                                className="absolute top-4 right-4 z-20 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-md text-slate-500 hover:text-emerald-500 border border-slate-100 dark:border-white/10"
                            >
                                <X size={16} />
                            </button>

                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                <div className="w-full h-[220px] rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 shrink-0 mb-6 shadow-inner relative group">
                                    {viewingReport.photo ? (
                                        <img src={viewingReport.photo} alt="Evidence" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                            <FileTextIcon size={40} className="opacity-20 mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No Image provided</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-[1.25rem] font-black text-slate-800 dark:text-white leading-[1.2] tracking-tighter mb-1.5">
                                        {viewingReport.location}
                                    </h2>
                                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-500">
                                        <Clock size={14} className="text-slate-400" />
                                        {new Date(viewingReport.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-5">
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-900 dark:text-white font-black text-[13px]">Garbage Type</p>
                                        <p className="text-slate-700 dark:text-slate-300 font-bold text-[13.5px] text-right">{viewingReport.garbageType} Waste</p>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-900 dark:text-white font-black text-[13px]">City zone</p>
                                        <p className="text-slate-700 dark:text-slate-300 font-bold text-[13.5px] text-right capitalize">{viewingReport.zone} Zone</p>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-900 dark:text-white font-black text-[13px]">Status</p>
                                        <p className={`font-bold text-[13px] capitalize text-right ${viewingReport.status === 'Resolved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {viewingReport.status}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-start gap-4">
                                        <p className="text-slate-900 dark:text-white font-black text-[13px]">Area / Location</p>
                                        <p className="text-slate-700 dark:text-slate-300 font-bold text-[13.5px] text-right leading-tight max-w-[210px]">{viewingReport.location}</p>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-900 dark:text-white font-black text-[13px]">Landmark</p>
                                        <p className="text-slate-700 dark:text-slate-300 font-bold text-[13.5px] text-right">
                                            {viewingReport.landmark ? `near ${viewingReport.landmark}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-900 dark:text-white font-black text-[13px]">Urgency</p>
                                        <p className="text-slate-700 dark:text-slate-300 font-bold text-[13.5px] text-right">
                                            {viewingReport.urgency} Urgency
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-white/5 mb-6">
                                    <p className="text-slate-900 dark:text-white font-black text-[13.5px] mb-1.5">Description:</p>
                                    <p className="text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400 font-semibold whitespace-pre-line pt-2">
                                        {viewingReport.description}
                                    </p>
                                </div>

                                {/* Dynamic Modal Action Button */}
                                <div className="pt-2">
                                    {viewingReport.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleUpdateStatus(viewingReport._id, 'In Progress')}
                                                className="flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[12px] sm:text-[14px] shadow-lg shadow-emerald-500/10 transition-all active:scale-95 whitespace-nowrap"
                                            >
                                                <Play size={16} />
                                                <span className="hidden sm:inline">Accept Pickup</span>
                                                <span className="sm:hidden">Accept</span>
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(viewingReport._id, 'Pending')}
                                                className="flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-[12px] sm:text-[14px] shadow-lg shadow-rose-500/10 transition-all active:scale-95 whitespace-nowrap"
                                            >
                                                <X size={16} />
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                    {viewingReport.status === 'In Progress' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(viewingReport._id, 'Resolved')}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[13px] sm:text-[15px] shadow-xl shadow-emerald-500/10 transition-all active:scale-95"
                                        >
                                            <Check size={18} className="sm:w-5 sm:h-5" />
                                            Mark as Complete
                                        </button>
                                    )}
                                    {viewingReport.status === 'Resolved' && (
                                        <div className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl font-black text-[15px] border-2 border-emerald-500/20">
                                            <CheckCircle2 size={20} />
                                            TASK RESOLVED
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollectorPickups;
