import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FileText, 
    Search, 
    Filter, 
    Trash2, 
    AlertCircle, 
    MapPin, 
    Clock, 
    CheckCircle2, 
    ArrowLeft,
    Loader2,
    X,
    ChevronDown,
    LayoutGrid,
    Calendar,
    ChevronLeft,
    ChevronRight,
    FileText as FileTextIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import toast from 'react-hot-toast';

const AdminReports = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Parse status from URL query params
    const queryParams = new URLSearchParams(location.search);
    const initialStatus = queryParams.get('status') || 'All';
    
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [urgencyFilter, setUrgencyFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [zoneFilter, setZoneFilter] = useState('');
    
    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);

    // Sync filter state with URL changes
    useEffect(() => {
        const status = new URLSearchParams(location.search).get('status');
        if (status) {
            setStatusFilter(status);
        }
    }, [location.search]);

    useEffect(() => {
        fetchReports();
    }, [statusFilter, urgencyFilter, zoneFilter, page]);

    const fetchReports = async () => {
        const startTime = Date.now();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/reports`, {
                headers: { 'x-auth-token': token },
                params: {
                    status: statusFilter,
                    urgency: urgencyFilter,
                    zone: zoneFilter,
                    search: searchTerm,
                    page,
                    limit: 10
                }
            });
            setReports(res.data.reports);
            setTotalPages(res.data.totalPages);
            setTotalReports(res.data.totalReports);
        } catch (err) {
            setError('Failed to load reports. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [viewingReport, setViewingReport] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Touch handlers for swipe
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (viewingReport?.photos?.length > 1) {
            if (isLeftSwipe) {
                setActiveImageIndex((prev) => (prev < viewingReport.photos.length - 1 ? prev + 1 : 0));
            }
            if (isRightSwipe) {
                setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : viewingReport.photos.length - 1));
            }
        }
    };

    const handleViewReport = (report) => {
        setViewingReport(report);
        setActiveImageIndex(0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this report permanently?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/reports/${id}`, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Report deleted successfully');
            fetchReports();
        } catch (err) {
            toast.error('Failed to delete report.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => navigate('/admin/dashboard')}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-slate-600" />
                    </button>
                    <PageHeader 
                        title="All City Reports" 
                        subtitle={`Manage and monitor all garbage issues (${totalReports} total)`} 
                        icon={LayoutGrid}
                    />
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="glass-card p-8 rounded-[2.5rem] bg-white/70 backdrop-blur-md border border-white/40 shadow-xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Search location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchReports()}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>

                    <div className="relative">
                        <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select 
                            value={urgencyFilter}
                            onChange={(e) => setUrgencyFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700"
                        >
                            <option value="All">All Urgency</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>

                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Filter by Zone..."
                            value={zoneFilter}
                            onChange={(e) => setZoneFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            {reports.length > 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-widest">Location</th>
                                <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-widest">Zone</th>
                                <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-widest">Urgency</th>
                                <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {reports.map((report) => (
                                <tr key={report._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-rose-500">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <span className="font-extrabold text-slate-800 block">{report.area || report.location}</span>
                                                <span className="text-slate-400 text-xs font-bold">{report.location} • {report.garbageType}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black text-xs">{report.zone}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                report.urgency === 'High' ? 'bg-rose-500' : report.urgency === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`} />
                                            <span className="font-bold text-slate-700">{report.urgency}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                            report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                                            report.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            {report.status === 'Resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                            {report.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right flex items-center justify-end gap-3">
                                        <button 
                                            onClick={() => handleViewReport(report)}
                                            className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all"
                                            title="View Details"
                                        >
                                            <FileTextIcon size={20} />
                                        </button>
                                        <select 
                                            value={report.status}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;
                                                const token = localStorage.getItem('token');
                                                try {
                                                    await axios.put(`/api/reports/${report._id}/status`, { status: newStatus }, {
                                                        headers: { 'x-auth-token': token }
                                                    });
                                                    toast.success('Status updated');
                                                    fetchReports();
                                                } catch (err) {
                                                    toast.error('Failed to update status');
                                                }
                                            }}
                                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                        <button 
                                            onClick={() => handleDelete(report._id)}
                                            className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Simple Pagination */}
                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-slate-500 font-bold">Page {page} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:border-indigo-300 disabled:opacity-50 transition-all"
                            >
                                Previous
                            </button>
                            <button 
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
                    <X size={48} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-black text-xl">No reports found matching your filters.</p>
                </div>
            )}
            <AnimatePresence>
                {viewingReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-center justify-center lg:pl-64 p-4 pt-20 sm:pt-4 bg-black/60 backdrop-blur-[2px]"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-white rounded-2xl w-full max-w-[420px] max-h-[80vh] sm:max-h-[85vh] overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col"
                        >
                            <button
                                onClick={() => {
                                    setViewingReport(null);
                                    setActiveImageIndex(0);
                                }}
                                className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full hover:bg-white transition-all shadow-md text-slate-500 hover:text-indigo-600 border border-slate-100"
                            >
                                <X size={16} />
                            </button>

                            <div className="p-2.5 pb-8 overflow-y-auto custom-scrollbar flex-1">
                                <div 
                                    className="relative group/modalimg w-full h-[190px] sm:h-[220px] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 mb-4 sm:mb-6 shadow-inner"
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                >
                                    {(viewingReport.photos && viewingReport.photos.length > 0) || viewingReport.image ? (
                                        <>
                                            <img 
                                                src={viewingReport.photos && viewingReport.photos.length > 0 ? viewingReport.photos[activeImageIndex] : viewingReport.image} 
                                                alt={`Evidence ${activeImageIndex + 1}`} 
                                                className="w-full h-full object-cover transition-all duration-500" 
                                            />
                                            
                                            {/* Navigation Arrows */}
                                            {viewingReport.photos && viewingReport.photos.length > 1 && (
                                                <>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : viewingReport.photos.length - 1));
                                                        }}
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all opacity-0 group-hover/modalimg:opacity-100"
                                                    >
                                                        <ChevronLeft size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveImageIndex((prev) => (prev < viewingReport.photos.length - 1 ? prev + 1 : 0));
                                                        }}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all opacity-0 group-hover/modalimg:opacity-100"
                                                    >
                                                        <ChevronRight size={16} />
                                                    </button>

                                                    {/* Pagination Dots */}
                                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                                                        {viewingReport.photos.map((_, i) => (
                                                            <div 
                                                                key={i} 
                                                                className={`w-1.5 h-1.5 rounded-full transition-all ${activeImageIndex === i ? 'bg-indigo-500 w-3' : 'bg-white/60'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                            <FileTextIcon size={40} className="opacity-20 mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No Image provided</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-[1.25rem] font-black text-slate-800 leading-[1.2] tracking-tighter mb-1.5">
                                        {viewingReport.area || viewingReport.location}
                                    </h2>
                                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-500">
                                        <Clock size={14} className="text-slate-400" />
                                        {new Date(viewingReport.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-5 text-slate-600 dark:text-slate-400">
                                    <div className="flex items-start gap-4">
                                        <p className="text-slate-900 font-black text-[13px] w-[95px] shrink-0">Report ID</p>
                                        <p className="text-slate-700 font-bold text-[11.5px] flex-1">#{viewingReport._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <p className="text-slate-900 font-black text-[13px] w-[95px] shrink-0">Garbage Type</p>
                                        <p className="text-slate-700 font-bold text-[11.5px] flex-1">{viewingReport.garbageType} Waste</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <p className="text-slate-900 font-black text-[13px] w-[95px] shrink-0">City zone</p>
                                        <p className="text-slate-700 font-bold text-[11.5px] flex-1 capitalize">{viewingReport.zone} Zone</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <p className="text-slate-900 font-black text-[13px] w-[95px] shrink-0">Status</p>
                                        <p className={`font-bold text-[11.5px] capitalize flex-1 ${viewingReport.status === 'Resolved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {viewingReport.status}
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <p className="text-slate-900 font-black text-[13px] w-[95px] shrink-0">Coordinates</p>
                                        <div className="flex-1 flex items-center gap-2">
                                            <p className="text-slate-700 font-bold text-[11.5px] leading-tight">{viewingReport.location}</p>
                                            <a 
                                                href={`https://www.google.com/maps/search/?api=1&query=${viewingReport.location}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors"
                                                title="Open in Google Maps"
                                            >
                                                <MapPin size={14} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <p className="text-slate-900 font-black text-[13px] w-[95px] shrink-0">Landmark</p>
                                        <p className="text-slate-700 font-bold text-[11.5px] flex-1">
                                            {viewingReport.landmark ? `near ${viewingReport.landmark}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <p className="text-slate-900 font-black text-[13px] w-[95px] shrink-0">City</p>
                                        <p className="text-slate-700 font-bold text-[11.5px] flex-1">{viewingReport.city || 'Pune'}</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <p className="text-slate-900 font-black text-[13px] w-[95px] shrink-0">Area</p>
                                        <p className="text-slate-700 font-bold text-[11.5px] flex-1">{viewingReport.area || 'N/A'}</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <p className="text-slate-900 font-black text-[13px] w-[95px] shrink-0">Urgency</p>
                                        <p className={`font-bold text-[11.5px] flex-1 ${viewingReport.urgency === 'High' ? 'text-rose-600' : viewingReport.urgency === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            {viewingReport.urgency} Urgency
                                        </p>
                                    </div>
                                    {viewingReport.contactNumber && (
                                        <div className="flex items-start gap-4">
                                            <p className="text-slate-900 font-black text-[13px] w-[95px] shrink-0">Contact</p>
                                            <p className="text-slate-700 font-bold text-[11.5px] flex-1">{viewingReport.contactNumber}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-100 mb-6">
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
        </div>
    );
};

export default AdminReports;
