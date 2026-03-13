import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Camera, Clock, CheckCircle, Search } from 'lucide-react';

const areas = [
  'North Sector',
  'East Zone', 
  'Central',
  'West District',
  'South End',
  'Industrial Area',
  'Commercial District',
  'Residential North',
  'Residential South'
];

const wasteTypes = [
  { value: 'mixed', label: 'Mixed Waste', color: 'bg-gray-500' },
  { value: 'dry', label: 'Dry Waste', color: 'bg-blue-500' },
  { value: 'wet', label: 'Wet Waste', color: 'bg-green-500' },
  { value: 'recyclable', label: 'Recyclable', color: 'bg-yellow-500' },
  { value: 'hazardous', label: 'Hazardous', color: 'bg-red-500' },
];

const urgencyLevels = [
  { value: 'low', label: 'Low - Can wait 24h', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium - Within 12h', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High - Within 6h', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent - Immediate', color: 'bg-red-100 text-red-800' },
];

export default function ReportBin() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    binId: '',
    area: '',
    wasteType: 'mixed',
    urgency: 'medium',
    description: '',
    reporterName: '',
    reporterContact: '',
    location: '',
    hasPhoto: false
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAreas, setFilteredAreas] = useState(areas);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAreaSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFormData(prev => ({ ...prev, area: query }));
    
    if (query) {
      const filtered = areas.filter(area => 
        area.toLowerCase().includes(query)
      );
      setFilteredAreas(filtered);
      setShowAreaDropdown(true);
    } else {
      setFilteredAreas(areas);
      setShowAreaDropdown(false);
    }
  };

  const selectArea = (area) => {
    setFormData(prev => ({ ...prev, area }));
    setSearchQuery(area);
    setShowAreaDropdown(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.binId.trim()) {
      newErrors.binId = 'Bin ID is required';
    } else if (!/^B-\d{3}$/.test(formData.binId.trim())) {
      newErrors.binId = 'Bin ID must be in format B-XXX (e.g., B-042)';
    }
    
    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.reporterName.trim()) {
      newErrors.reporterName = 'Your name is required';
    }
    
    if (!formData.reporterContact.trim()) {
      newErrors.reporterContact = 'Contact number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.reporterContact.trim())) {
      newErrors.reporterContact = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage
      const reports = JSON.parse(localStorage.getItem('wasteReports') || '[]');
      const newReport = {
        id: `R-${Date.now()}`,
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      reports.push(newReport);
      localStorage.setItem('wasteReports', JSON.stringify(reports));
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      binId: '',
      area: '',
      wasteType: 'mixed',
      urgency: 'medium',
      description: '',
      reporterName: '',
      reporterContact: '',
      location: '',
      hasPhoto: false
    });
    setSearchQuery('');
    setSubmitted(false);
    navigate('/dashboard');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, hasPhoto: true }));
      // In a real app, you would upload the file here
      console.log('Photo uploaded:', file.name);
    }
  };

  const handleEmergencyCall = () => {
    // In a real app, this would initiate a call or open dialer
    alert('Calling emergency hotline: 1800-WASTE-01');
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Report Submitted Successfully!</h2>
          <p className="text-green-700 mb-6">
            Your report for bin <span className="font-semibold">{formData.binId}</span> has been received. 
            A collection truck will be assigned shortly and you'll receive updates on the status.
          </p>
          <div className="bg-white rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Report Details:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Bin ID:</span> {formData.binId}</p>
              <p><span className="font-medium">Area:</span> {formData.area}</p>
              <p><span className="font-medium">Waste Type:</span> {wasteTypes.find(t => t.value === formData.wasteType)?.label}</p>
              <p><span className="font-medium">Urgency:</span> {urgencyLevels.find(u => u.value === formData.urgency)?.label}</p>
            </div>
          </div>
          <button 
            onClick={resetForm}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Report Another Bin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Report a Full Bin</h1>
        <p className="mt-2 text-gray-600">Help us keep the city clean by reporting overflowing waste bins</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bin ID */}
              <div>
                <label htmlFor="binId" className="block text-sm font-medium text-gray-700 mb-2">
                  Bin ID *
                </label>
                <div className="relative">
                  <input
                    id="binId"
                    name="binId"
                    type="text"
                    placeholder="e.g., B-042, BIN-128"
                    value={formData.binId}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.binId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.binId && (
                  <p className="mt-1 text-sm text-red-600">{errors.binId}</p>
                )}
              </div>

              {/* Area */}
              <div className="relative">
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Area *
                </label>
                <div className="relative">
                  <input
                    id="area"
                    name="area"
                    type="text"
                    placeholder="Search or select area..."
                    value={searchQuery}
                    onChange={handleAreaSearch}
                    onFocus={() => setShowAreaDropdown(true)}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.area ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                )}
                
                {/* Area Dropdown */}
                {showAreaDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredAreas.map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => selectArea(area)}
                        className="w-full px-4 py-2 text-left hover:bg-green-50 focus:bg-green-50 focus:outline-none"
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Waste Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {wasteTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                        formData.wasteType === type.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="wasteType"
                        value={type.value}
                        checked={formData.wasteType === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-3 h-3 rounded-full ${type.color} mr-2`}></div>
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <div className="space-y-2">
                  {urgencyLevels.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                        formData.urgency === level.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={level.value}
                        checked={formData.urgency === level.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-3 h-3 rounded-full ${level.color.split(' ')[0].replace('bg-', 'bg-')} mr-3`}></div>
                      <span className="text-sm font-medium">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Location Details */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Location Details
                </label>
                <textarea
                  id="location"
                  name="location"
                  rows={3}
                  placeholder="e.g., Near the main entrance, next to the parking lot..."
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Any additional information about the bin condition..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Reporter Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    id="reporterName"
                    name="reporterName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.reporterName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.reporterName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.reporterName && (
                    <p className="mt-1 text-sm text-red-600">{errors.reporterName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="reporterContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    id="reporterContact"
                    name="reporterContact"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.reporterContact}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.reporterContact ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.reporterContact && (
                    <p className="mt-1 text-sm text-red-600">{errors.reporterContact}</p>
                  )}
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Photo (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Quick Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Look for the bin ID on the container</li>
              <li>• Select the correct waste type for proper sorting</li>
              <li>• Mark as urgent if bin is overflowing</li>
              <li>• Add photos for faster processing</li>
            </ul>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Reports in Your Area</h3>
            <div className="space-y-3">
              {[
                { id: 'B-038', area: 'North Sector', time: '10 mins ago', status: 'pending' },
                { id: 'B-076', area: 'East Zone', time: '1 hour ago', status: 'assigned' },
                { id: 'B-021', area: 'Central', time: '2 hours ago', status: 'completed' },
              ].map((report) => (
                <div key={report.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{report.id}</p>
                    <p className="text-gray-500">{report.area}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500">{report.time}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      report.status === 'completed' ? 'bg-green-100 text-green-800' :
                      report.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-2">Emergency Hotline</h3>
            <p className="text-red-800 text-sm mb-3">
              For hazardous waste or emergency situations
            </p>
            <p className="text-2xl font-bold text-red-600 cursor-pointer hover:text-red-700 transition-colors" onClick={handleEmergencyCall}>1800-WASTE-01</p>
          </div>
        </div>
      </div>
    </div>
  );
}
