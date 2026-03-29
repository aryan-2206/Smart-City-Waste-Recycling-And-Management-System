import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Trash2,
    Edit,
    Clock,
    CheckCircle2,
    AlertCircle,
    MapPin,
    Calendar,
    ArrowLeft,
    Loader2,
    X,
    Filter,
    Search,
    ChevronDown,
    RotateCw,
    FileText as FileTextIcon,
    PlusCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useDebounce from '../../hooks/useDebounce';
import PageHeader from '../../components/PageHeader';
import toast from 'react-hot-toast';

const MyReports = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const locationState = useLocation();

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

    // Core Data
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    // Deletion Modal State
    const [deletingReportId, setDeletingReportId] = useState(null);

    const handleConfirmDelete = async () => {
        if (!deletingReportId) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`http://localhost:5000/api/reports/${deletingReportId}`, {
                headers: { 'x-auth-token': token }
            });
            setReports(reports.filter(r => r._id !== deletingReportId));
            setDeletingReportId(null);
            toast.success('Report deleted successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete report.');
        }
    };

    const [expandedReports, setExpandedReports] = useState(new Set());
    const [viewingReport, setViewingReport] = useState(null);

    const toggleExpandReport = (reportId) => {
        setExpandedReports(prev => {
            const next = new Set(prev);
            if (next.has(reportId)) next.delete(reportId);
            else next.add(reportId);
            return next;
        });
    };

    const debouncedSearch = useDebounce(filters.topic, 500);

    useEffect(() => {
        fetchReports();
    }, [filters.status, debouncedSearch, filters.from, filters.to, filters.timeFilter]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/reports', {
                headers: { 'x-auth-token': token },
                params: {
                    status: filters.status === 'All' ? '' : filters.status,
                    search: debouncedSearch,
                }
            });
            setReports(res.data.reports || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch reports.');
        } finally {
            setLoading(false);
        }
    };

    const filteredReports = useMemo(() => {
        let result = reports.filter(report => {
            const dateObj = new Date(report.createdAt);
            let fromDate = filters.from ? new Date(filters.from) : null;
            let toDate = filters.to ? new Date(filters.to) : null;

            if (filters.timeFilter !== 'all' && !filters.from && !filters.to) {
                const now = new Date();
                if (filters.timeFilter === '7d') fromDate = new Date(now.setDate(now.getDate() - 7));
                if (filters.timeFilter === 'monthly') fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
                if (filters.timeFilter === 'yearly') fromDate = new Date(now.getFullYear(), 0, 1);
            }

            let dateMatch = true;
            if (fromDate) dateMatch = dateMatch && dateObj >= fromDate;
            if (toDate) {
                const end = new Date(toDate);
                end.setHours(23, 59, 59, 999);
                dateMatch = dateMatch && dateObj <= end;
            }

            // Status Match (already partially filtered by API but client-side check is safer)
            const statusMatch = filters.status === 'All' || report.status === filters.status;

            // Urgency Match
            const urgencyMatch = filters.urgency === 'All' || report.urgency === filters.urgency;

            return dateMatch && statusMatch && urgencyMatch;
        });

        // Advanced Sorting
        return result.sort((a, b) => {
            if (filters.sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (filters.sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);

            const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
            if (filters.sortBy === 'priority-high') return (priorityMap[b.urgency] || 0) - (priorityMap[a.urgency] || 0);
            if (filters.sortBy === 'priority-low') return (priorityMap[a.urgency] || 0) - (priorityMap[b.urgency] || 0);
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

    const groupedEntries = groupReportsByDate(filteredReports);

    return (
        <div className="space-y-4 max-w-7xl mx-auto animate-fade-in font-sans">
            <PageHeader
                title="All Record"
                subtitle="View and manage your entire report history"
                icon={FileTextIcon}
            />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-3 sm:gap-4 mb-2"
            >
                {/* Search Bar Row */}
                <div className="flex items-center gap-2 w-full">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Search area, landmark or description..."
                            value={filters.topic}
                            onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500 text-[13px] font-medium text-slate-700 dark:text-white outline-none transition-all placeholder-slate-400 shadow-sm"
                        />
                    </div>
                    {/* Add Button - Integrated Laptop Spot */}
                    <button
                        onClick={() => navigate('/citizen/report')}
                        className="hidden sm:flex shrink-0 items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-95 group"
                    >
                        <PlusCircle size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-[13px]">Add Record</span>
                    </button>
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

                    {/* TIER 3: Operational Routing - Dropdowns + Mobile Add Button */}
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
                        {/* Mobile Add Button - Integrated Tier 3 */}
                        <button
                            onClick={() => navigate('/citizen/report')}
                            className="sm:hidden flex shrink-0 items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white font-black rounded-lg shadow-lg shadow-emerald-500/20 active:scale-95 transition-all outline-none"
                        >
                            <PlusCircle size={14} />
                            <span className="text-[11.5px]">Add</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="min-h-[550px]">
                {groupedEntries.length > 0 ? (
                    <div className="space-y-6">
                        {groupedEntries.map(([date, groupReports]) => (
                            <div key={date}>
                                <div className="flex items-center gap-4 mb-3 px-2">
                                    <div className="bg-[#f1f5f9] px-4 py-1.5 rounded-full flex items-center gap-2 border border-slate-100/50 shrink-0">
                                        <Calendar size={14} className="text-[#10b981]" />
                                        <span className="text-[12px] font-black text-[#1a3353] tracking-wider">{date}</span>
                                    </div>
                                    <div className="h-[1px] flex-1 bg-slate-100/50" />
                                </div>

                                <div className="space-y-4">
                                    {groupReports.map((report, idx) => (
                                        <motion.div
                                            layout
                                            key={report._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                                            className="bg-white dark:bg-[#0B1121] rounded-[1.5rem] p-2 pb-3.5 sm:p-3 sm:pb-4 flex flex-col sm:flex-row gap-4 transition-all border-2 border-slate-100 dark:border-white/5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]"
                                            style={{
                                                ...cardBaseStyle,
                                                ...(hoveredCard === report._id ? cardHoverStyle : {})
                                            }}
                                            onMouseEnter={() => setHoveredCard(report._id)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            {/* Left side Image */}
                                            <div className="relative shrink-0">
                                                <div className="w-full sm:w-[120px] h-36 sm:h-[120px] bg-[#f8fafc] rounded-2xl overflow-hidden shadow-inner border border-slate-50">
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
                                                {/* LAPTOP HEADER ROW */}
                                                <div className="hidden sm:flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-[1.05rem] font-black text-[#1a202c] capitalize tracking-tight leading-tight">
                                                            {report.location}
                                                        </h3>
                                                        <div className="h-4 w-[1.5px] bg-slate-200" />
                                                        <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-500/10 capitalize shadow-sm">
                                                            {report.garbageType} Waste
                                                        </span>
                                                    </div>
                                                    <div className={`text-[10.5px] font-bold capitalize px-2.5 py-0.5 rounded-full shadow-sm border ${report.status === 'Resolved'
                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/50'
                                                        : 'bg-amber-50 text-amber-800 border-amber-200/50'
                                                        }`}>
                                                        {report.status}
                                                    </div>
                                                </div>

                                                {/* MOBILE HEADER ROW */}
                                                <div className="flex sm:hidden flex-col gap-3 mb-3">
                                                    <h3 className="text-[1.05rem] font-black text-[#1a202c] capitalize tracking-tight leading-tight">
                                                        {report.location}
                                                    </h3>
                                                    <div className="flex justify-between items-center w-full">
                                                        <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100">
                                                            <p className="text-[10.5px] font-black capitalize text-emerald-700">
                                                                {report.garbageType} Waste
                                                            </p>
                                                        </div>
                                                        <div className={`px-2.5 py-1 rounded-lg border text-[10.5px] font-black capitalize ${report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                            }`}>
                                                            {report.status}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* METADATA ROW - LAPTOP */}
                                                <div className="hidden sm:flex items-center gap-3 text-[10.5px] font-black text-[#1e293b] mb-1.5">
                                                    <div className="flex items-center gap-1.5 opacity-80">
                                                        <Clock size={11} strokeWidth={3} />
                                                        {new Date(report.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                    </div>
                                                    <div className="w-[1.5px] h-3 bg-slate-200" />
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={11} strokeWidth={3} className="text-[#10b981]" />
                                                        <span className="capitalize">{report.zone} Zone</span>
                                                        {report.landmark && (
                                                            <div className="flex items-center gap-1.5 ml-4">
                                                                <MapPin size={11} strokeWidth={3} className="text-[#10b981]" />
                                                                <span className="font-bold opacity-70">Near {report.landmark}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="w-[1.5px] h-3 bg-slate-200" />
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-100/50 text-amber-800">
                                                        <span className="scale-75">🟡</span>
                                                        <span className="font-black">{report.urgency} Urgency</span>
                                                    </div>
                                                </div>

                                                {/* METADATA ROWS - MOBILE */}
                                                <div className="flex sm:hidden flex-col gap-1 mb-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1 text-[10.5px] font-black text-[#1e293b] opacity-80">
                                                            <Clock size={11} strokeWidth={3} />
                                                            {new Date(report.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                        </div>
                                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-100/50 text-[10px] font-black text-amber-800">
                                                            <span className="scale-75">🟡</span>
                                                            <span>{report.urgency} Urgency</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                        <div className="flex items-center gap-1 text-[10.5px] font-black text-[#1e293b]">
                                                            <MapPin size={11} strokeWidth={3} className="text-[#10b981]" />
                                                            <span className="capitalize">{report.zone} Zone</span>
                                                        </div>
                                                        {report.landmark && (
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-[#1e293b] opacity-80">
                                                                <MapPin size={10} strokeWidth={3} className="text-[#10b981]" />
                                                                <span>Near {report.landmark}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="relative mb-0 p-2.5 bg-white/40 dark:bg-black/10 rounded-xl border border-white/60 dark:border-white/5 transition-all">
                                                    <div className="relative">
                                                        <p className={`text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium whitespace-pre-line ${expandedReports.has(report._id) ? '' : 'line-clamp-2 pr-16'}`}>
                                                            {report.description}
                                                        </p>
                                                        {!expandedReports.has(report._id) && report.description?.length > 50 && (
                                                            <button
                                                                onClick={() => toggleExpandReport(report._id)}
                                                                className="absolute bottom-0 right-0 px-2 py-0.5 text-[11.5px] font-black text-[#10b981] hover:text-[#059669] transition-all bg-white/80 dark:bg-black/40 rounded-lg shadow-sm border border-slate-100/50"
                                                            >
                                                                Read more
                                                            </button>
                                                        )}
                                                        {expandedReports.has(report._id) && (
                                                            <button
                                                                onClick={() => toggleExpandReport(report._id)}
                                                                className="text-[11.5px] font-black text-[#10b981] hover:text-[#059669] mt-2 flex items-center justify-end w-full hover:underline transition-all"
                                                            >
                                                                Show less
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end gap-3 mt-auto pt-2.5 border-t border-slate-50">
                                                    {report.status === 'Pending' && (
                                                        <div className="flex items-center gap-2 pr-2 border-r border-slate-100">
                                                            <button
                                                                onClick={() => navigate(`/citizen/edit-report/${report._id}`)}
                                                                className="p-2 text-slate-600 hover:text-[#10b981] hover:bg-slate-50 rounded-xl transition-all"
                                                                title="Edit Report"
                                                            >
                                                                <Edit size={16} strokeWidth={2.5} />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingReportId(report._id)}
                                                                className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                                title="Delete Report"
                                                            >
                                                                <Trash2 size={16} strokeWidth={2.5} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => setViewingReport(report)}
                                                        className="px-2.5 py-1 sm:px-4 sm:py-1.5 bg-[#10b981] hover:bg-[#059669] text-white text-[11px] sm:text-[12.5px] font-black rounded-lg shadow-lg shadow-emerald-500/20 transition-all ml-1"
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
                        <div className="w-16 h-16 bg-slate-50/80 rounded-full flex items-center justify-center mb-5 border border-slate-100/50">
                            <FileTextIcon size={28} className="text-slate-300" />
                        </div>
                        <h3 className="text-[1.05rem] font-bold text-slate-600 tracking-tight">No records found</h3>
                        <p className="text-[0.8125rem] text-slate-400 mt-1 max-w-[250px] mx-auto leading-relaxed">
                            Try adjusting your search terms or filter settings to see more results
                        </p>
                    </div>
                )}
            </div>

            {/* ---------- VIEW REPORT MODAL ---------- */}
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
                            className="bg-white rounded-2xl w-full max-w-[420px] max-h-[85vh] overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col"
                        >
                            <button
                                onClick={() => setViewingReport(null)}
                                className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full hover:bg-white transition-all shadow-md text-slate-500 hover:text-[#10b981] border border-slate-100"
                            >
                                <X size={16} />
                            </button>

                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                <div className="w-full h-[220px] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 mb-6 shadow-inner">
                                    {viewingReport.photo ? (
                                        <img src={viewingReport.photo} alt="Evidence" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                            <FileTextIcon size={40} className="opacity-20 mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No Evidence Found</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-[1.25rem] font-black text-[#1a202c] leading-[1.2] tracking-tighter mb-1.5">
                                        {viewingReport.location}
                                    </h2>
                                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-500">
                                        <Clock size={14} className="text-slate-400" />
                                        {new Date(viewingReport.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-5">
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-900 font-black text-[13px]">Garbage Type</p>
                                        <p className="text-slate-700 font-bold text-[13.5px] text-right">{viewingReport.garbageType} Waste</p>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-900 font-black text-[13px]">City zone</p>
                                        <p className="text-slate-700 font-bold text-[13.5px] text-right capitalize">{viewingReport.zone} Zone</p>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-900 font-black text-[13px]">Status</p>
                                        <p className={`font-bold text-[13px] capitalize text-right ${viewingReport.status === 'Resolved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {viewingReport.status}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-start gap-4">
                                        <p className="text-slate-900 font-black text-[13px]">Area / Location</p>
                                        <p className="text-slate-700 font-bold text-[13.5px] text-right leading-tight max-w-[210px]">{viewingReport.location}</p>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-900 font-black text-[13px]">Landmark</p>
                                        <p className="text-slate-700 font-bold text-[13.5px] text-right">
                                            {viewingReport.landmark ? `near ${viewingReport.landmark}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-900 font-black text-[13px]">Urgency</p>
                                        <p className="text-slate-700 font-bold text-[13.5px] text-right">
                                            {viewingReport.urgency} Urgency
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-slate-900 font-black text-[13.5px] mb-1.5">Description:</p>
                                    <p className="text-[13.5px] leading-relaxed text-slate-500 font-semibold whitespace-pre-line pt-2">
                                        {viewingReport.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---------- DELETE CONFIRMATION MODAL ---------- */}
            <AnimatePresence>
                {deletingReportId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 w-full max-w-[340px] shadow-2xl text-center border border-slate-100"
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-5 border border-red-100">
                                <Trash2 size={28} />
                            </div>

                            <h3 className="text-[1.125rem] font-black text-slate-800 mb-2 tracking-tight">Delete Report?</h3>
                            <p className="text-[13px] font-medium text-slate-500 mb-8 leading-relaxed">
                                This report will be permanently removed from your history.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeletingReportId(null)}
                                    className="flex-1 py-3.5 text-[14px] font-bold bg-[#f8fafc] text-slate-600 rounded-xl hover:bg-slate-100 transition-all border border-slate-100"
                                >
                                    No, keep it
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 py-3.5 text-[14px] font-bold bg-[#10b981] text-white rounded-xl hover:bg-[#059669] shadow-lg shadow-emerald-500/20 transition-all"
                                >
                                    Yes, delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyReports;
