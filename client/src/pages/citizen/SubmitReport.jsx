import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    AlertCircle, 
    Camera, 
    MapPin, 
    Trash2, 
    Send, 
    Info, 
    CheckCircle2,
    FileText,
    ArrowLeft,
    X,
    ChevronDown
} from 'lucide-react';
import axios from 'axios';

const SubmitReport = ({ isEdit = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        garbageType: 'Household',
        location: '',
        landmark: '',
        zone: '',
        description: '',
        urgency: 'Medium',
        photo: null
    });
    
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isEdit && id) {
            fetchReportData();
        }
    }, [isEdit, id]);

    const fetchReportData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/reports/${id}`, {
                headers: { 'x-auth-token': token }
            });
            const { garbageType, location, landmark, zone, description, photo, urgency } = res.data;
            setFormData({ garbageType, location, landmark, zone, description, urgency, photo: null });
            if (photo) setPreview(photo);
        } catch (err) {
            setError('Failed to fetch report data.');
            console.error(err);
        }
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!formData.location || !formData.zone) {
            setError('Please fill in required fields (Location and Zone)');
            setIsSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                ...formData,
                photo: preview
            };

            if (isEdit) {
                await axios.put(`http://localhost:5000/api/reports/${id}`, dataToSend, {
                    headers: { 'x-auth-token': token }
                });
            } else {
                await axios.post('http://localhost:5000/api/reports', dataToSend, {
                    headers: { 'x-auth-token': token }
                });
            }

            setSuccess(true);
            setTimeout(() => navigate('/citizen/my-reports'), 2000);
        } catch (err) {
            console.error('Submission error:', err);
            const message = err.response?.data?.message || err.message || 'Failed to submit report. Please try again.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-50/10 min-h-screen py-10 px-4 flex items-center justify-center">
            <div className="max-w-xl w-full mx-auto">
                <div className="bg-white dark:bg-[#0B1121] rounded-[0.8rem] shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#0B1121]">
                        <h2 className="text-[17px] font-black text-slate-800 dark:text-white tracking-tight">
                            {isEdit ? 'Edit Report' : 'Submit Report'}
                        </h2>
                        <button 
                            onClick={() => navigate('/citizen/my-reports')}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        >
                            <X size={24} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Form Body - Scrollable */}
                    <div className="flex-1 overflow-y-auto max-h-[70vh] custom-scrollbar pl-6 pt-6 pb-6 pr-5">
                        <p className="text-[0.75rem] text-slate-500 mb-6" style={{ fontWeight: 400 }}>
                            * Indicates required
                        </p>

                        <form className="space-y-6">
                            {error && (
                                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center space-x-3 text-rose-600 animate-shake mb-6">
                                    <AlertCircle size={20} />
                                    <p className="font-bold">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center space-x-3 text-emerald-600 mb-6">
                                    <CheckCircle2 size={20} />
                                    <p className="font-bold">
                                        {isEdit ? 'Report updated successfully!' : 'Report submitted successfully!'}
                                    </p>
                                </div>
                            )}

                            {/* Section: Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                {/* Garbage Type */}
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-[0.875rem] text-[#666666] dark:text-slate-400 font-medium ml-0.5">
                                        Garbage type *
                                    </label>
                                    <div className="relative">
                                        <select 
                                            name="garbageType"
                                            value={formData.garbageType}
                                            onChange={onChange}
                                            className="w-full h-[2.5rem] px-3 bg-white dark:bg-slate-900 border border-[#b8b8b8] dark:border-slate-700 rounded-[0.4rem] text-slate-900 dark:text-white text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition-all appearance-none"
                                        >
                                            <option value="Household">Household Waste</option>
                                            <option value="Industrial">Industrial Waste</option>
                                            <option value="Medical">Medical Waste</option>
                                            <option value="Construction">Construction Waste</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                                    </div>
                                </div>

                                {/* City Zone */}
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-[0.875rem] text-[#666666] dark:text-slate-400 font-medium ml-0.5">
                                        City zone *
                                    </label>
                                    <div className="relative">
                                        <select 
                                            name="zone"
                                            required
                                            value={formData.zone}
                                            onChange={onChange}
                                            className="w-full h-[2.5rem] px-3 bg-white dark:bg-slate-900 border border-[#b8b8b8] dark:border-slate-700 rounded-[0.4rem] text-slate-900 dark:text-white text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition-all appearance-none"
                                        >
                                            <option value="">Select Zone</option>
                                            <option value="North">North Zone</option>
                                            <option value="South">South Zone</option>
                                            <option value="East">East Zone</option>
                                            <option value="West">West Zone</option>
                                            <option value="Central">Central Zone</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex flex-col gap-1.5 text-left md:col-span-2">
                                    <label className="text-[0.875rem] text-[#666666] dark:text-slate-400 font-medium ml-0.5">
                                        Area / Location *
                                    </label>
                                    <input 
                                        type="text"
                                        name="location"
                                        placeholder="e.g. MG Road, Near Market"
                                        required
                                        value={formData.location}
                                        onChange={onChange}
                                        className="w-full h-[2.5rem] px-3 bg-white dark:bg-slate-900 border border-[#b8b8b8] dark:border-slate-700 rounded-[0.4rem] text-slate-900 dark:text-white text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition-all"
                                    />
                                </div>

                                {/* Landmark */}
                                <div className="flex flex-col gap-1.5 text-left md:col-span-2">
                                    <label className="text-[0.875rem] text-[#666666] dark:text-slate-400 font-medium ml-0.5">
                                        Landmark (Optional)
                                    </label>
                                    <input 
                                        type="text"
                                        name="landmark"
                                        placeholder="e.g. Near City Bank"
                                        value={formData.landmark}
                                        onChange={onChange}
                                        className="w-full h-[2.5rem] px-3 bg-white dark:bg-slate-900 border border-[#b8b8b8] dark:border-slate-700 rounded-[0.4rem] text-slate-900 dark:text-white text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* Section: Description */}
                            <div className="flex flex-col gap-1.5 text-left mt-4">
                                <label className="text-[0.875rem] text-[#666666] dark:text-slate-400 font-medium ml-0.5">
                                    Description *
                                </label>
                                <textarea 
                                    name="description"
                                    rows="4"
                                    placeholder="Briefly describe the issue..."
                                    value={formData.description}
                                    onChange={onChange}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#b8b8b8] dark:border-slate-700 rounded-[0.4rem] text-slate-900 dark:text-white text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition-all resize-none"
                                />
                            </div>

                            {/* Section: Extra Info */}
                            <div className="mt-8">
                                <h3 className="text-[1.125rem] font-medium text-slate-900 dark:text-white mb-4">Additional Info</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-1.5 text-left">
                                        <label className="text-[0.875rem] text-[#666666] dark:text-slate-400 font-medium ml-0.5">
                                            Urgency level *
                                        </label>
                                        <div className="flex gap-4">
                                            {['Low', 'Medium', 'High'].map((level) => (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, urgency: level})}
                                                    className={`px-4 h-[1.75rem] rounded-full text-[0.75rem] font-bold transition-all ${
                                                        formData.urgency === level 
                                                            ? 'bg-emerald-600 text-white shadow-md'
                                                            : 'bg-white text-slate-600 border border-slate-300 hover:border-slate-400'
                                                    }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5 text-left pt-2">
                                        <label className="text-[0.875rem] text-[#666666] dark:text-slate-400 font-medium ml-0.5">
                                            Photo evidence
                                        </label>
                                        <div className="flex items-start gap-4">
                                            <label className="w-20 h-20 flex flex-col items-center justify-center border border-[#b8b8b8] border-dashed rounded-[0.4rem] cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all group overflow-hidden shrink-0">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={onFileChange}
                                                    className="hidden" 
                                                />
                                                {preview ? (
                                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Camera className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                                )}
                                            </label>
                                            <div className="text-[0.75rem] text-[#666666] dark:text-slate-500 leading-normal bg-slate-50 dark:bg-slate-900/50 p-3 rounded-[0.8rem] border border-slate-100 dark:border-white/5">
                                                <span className="font-bold flex items-center gap-1 mb-1 text-slate-700 dark:text-slate-300">
                                                    <Info size={12} /> Note:
                                                </span>
                                                Photo helps waste collectors identify the issue quickly.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 flex justify-end border-t border-gray-100 dark:border-white/5">
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={isSubmitting}
                            className={`h-[2rem] px-5 rounded-lg font-bold text-[0.8125rem] transition-all transform active:scale-95 shadow-md disabled:opacity-50 ${isEdit ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                        >
                            {isSubmitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Submit Report')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitReport;
