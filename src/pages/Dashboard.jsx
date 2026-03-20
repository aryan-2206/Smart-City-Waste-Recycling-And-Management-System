import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trash2, AlertTriangle, Clock, TrendingUp, MapPin, Users } from 'lucide-react';

// Initial zero stats
const initialStats = [
  { label: 'Total Bins', value: 0, icon: Trash2, color: 'bg-blue-500' },
  { label: 'Reported Full', value: 0, icon: AlertTriangle, color: 'bg-red-500' },
  { label: 'Pending Pickups', value: 0, icon: Clock, color: 'bg-yellow-500' },
  { label: 'Active Trucks', value: 0, icon: Users, color: 'bg-green-500' },
];

// Initial empty data
const initialWeeklyData = [
  { day: 'Mon', collections: 0, reports: 0 },
  { day: 'Tue', collections: 0, reports: 0 },
  { day: 'Wed', collections: 0, reports: 0 },
  { day: 'Thu', collections: 0, reports: 0 },
  { day: 'Fri', collections: 0, reports: 0 },
  { day: 'Sat', collections: 0, reports: 0 },
  { day: 'Sun', collections: 0, reports: 0 },
];

const initialAreaData = [
  { name: 'North Sector', value: 0, color: '#3B82F6' },
  { name: 'East Zone', value: 0, color: '#10B981' },
  { name: 'Central', value: 0, color: '#F59E0B' },
  { name: 'West District', value: 0, color: '#EF4444' },
];

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(initialStats);
  const [weeklyData, setWeeklyData] = useState(initialWeeklyData);
  const [areaData, setAreaData] = useState(initialAreaData);
  const [recentReports, setRecentReports] = useState([]);
  const navigate = useNavigate();

  // Load data from localStorage and update dashboard
  useEffect(() => {
    const loadDashboardData = () => {
      try {
        // Get reports from localStorage
        const storedReports = JSON.parse(localStorage.getItem('wasteReports') || '[]');
        const storedAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const storedFleet = JSON.parse(localStorage.getItem('fleet') || '[]');
        
        // Calculate stats
        const totalBins = Math.max(128, storedReports.length * 10); // Dynamic based on reports
        const reportedFull = storedReports.length;
        const pendingPickups = storedAssignments.filter(a => a.status === 'pending').length;
        const activeTrucks = storedFleet.filter(f => f.status === 'active').length;
        
        // Update stats
        setStats([
          { label: 'Total Bins', value: totalBins, icon: Trash2, color: 'bg-blue-500' },
          { label: 'Reported Full', value: reportedFull, icon: AlertTriangle, color: 'bg-red-500' },
          { label: 'Pending Pickups', value: pendingPickups, icon: Clock, color: 'bg-yellow-500' },
          { label: 'Active Trucks', value: activeTrucks, icon: Users, color: 'bg-green-500' },
        ]);
        
        // Update weekly data based on actual data
        const today = new Date();
        const weekData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayName = days[date.getDay()];
          
          const dayReports = storedReports.filter(r => {
            const reportDate = new Date(r.timestamp || Date.now());
            return reportDate.toDateString() === date.toDateString();
          }).length;
          
          const dayCollections = storedAssignments.filter(a => {
            const assignDate = new Date(a.createdAt || Date.now());
            return assignDate.toDateString() === date.toDateString() && a.status === 'completed';
          }).length;
          
          weekData.push({
            day: dayName,
            collections: dayCollections,
            reports: dayReports
          });
        }
        
        setWeeklyData(weekData);
        
        // Update area data based on reports
        const areaCounts = {
          'North Sector': 0,
          'East Zone': 0,
          'Central': 0,
          'West District': 0
        };
        
        storedReports.forEach(report => {
          if (Object.prototype.hasOwnProperty.call(areaCounts, report.area)) {
            areaCounts[report.area]++;
          }
        });
        
        setAreaData([
          { name: 'North Sector', value: areaCounts['North Sector'], color: '#3B82F6' },
          { name: 'East Zone', value: areaCounts['East Zone'], color: '#10B981' },
          { name: 'Central', value: areaCounts['Central'], color: '#F59E0B' },
          { name: 'West District', value: areaCounts['West District'], color: '#EF4444' },
        ]);
        
        // Update recent reports
        const sortedReports = storedReports
          .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
          .slice(0, 5)
          .map(report => ({
            id: report.binId || `B-${Math.floor(Math.random() * 1000)}`,
            area: report.area || 'Unknown',
            time: report.timestamp ? formatTimeAgo(new Date(report.timestamp)) : 'Just now',
            status: mapReportStatus(report.urgency)
          }));
        
        setRecentReports(sortedReports);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    
    // Initial load
    loadDashboardData();
    
    // Set up interval for real-time updates
    const interval = setInterval(loadDashboardData, 5000); // Update every 5 seconds
    
    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'wasteReports' || e.key === 'assignments' || e.key === 'fleet') {
        loadDashboardData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Helper functions
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  const mapReportStatus = (urgency) => {
    switch (urgency) {
      case 'high': return 'pending';
      case 'medium': return 'assigned';
      case 'low': return 'scheduled';
      default: return 'pending';
    }
  };

  const handleQuickReport = () => {
    navigate('/report');
  };

  const handleViewRoutes = () => {
    navigate('/routes');
  };

  const handleViewAnalytics = () => {
    // For now, show an alert. In a real app, this would navigate to analytics page
    alert('Analytics feature coming soon! This would show detailed waste management analytics.');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Trigger dashboard data reload
      const loadDashboardData = async () => {
        const storedReports = JSON.parse(localStorage.getItem('wasteReports') || '[]');
        const storedAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const storedFleet = JSON.parse(localStorage.getItem('fleet') || '[]');
        
        // Calculate stats
        const totalBins = Math.max(128, storedReports.length * 10);
        const reportedFull = storedReports.length;
        const pendingPickups = storedAssignments.filter(a => a.status === 'pending').length;
        const activeTrucks = storedFleet.filter(f => f.status === 'active').length;
        
        setStats([
          { label: 'Total Bins', value: totalBins, icon: Trash2, color: 'bg-blue-500' },
          { label: 'Reported Full', value: reportedFull, icon: AlertTriangle, color: 'bg-red-500' },
          { label: 'Pending Pickups', value: pendingPickups, icon: Clock, color: 'bg-yellow-500' },
          { label: 'Active Trucks', value: activeTrucks, icon: Users, color: 'bg-green-500' },
        ]);
        
        // Update weekly data
        const today = new Date();
        const weekData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayName = days[date.getDay()];
          
          const dayReports = storedReports.filter(r => {
            const reportDate = new Date(r.timestamp || Date.now());
            return reportDate.toDateString() === date.toDateString();
          }).length;
          
          const dayCollections = storedAssignments.filter(a => {
            const assignDate = new Date(a.createdAt || Date.now());
            return assignDate.toDateString() === date.toDateString() && a.status === 'completed';
          }).length;
          
          weekData.push({
            day: dayName,
            collections: dayCollections,
            reports: dayReports
          });
        }
        
        setWeeklyData(weekData);
        
        // Update area data
        const areaCounts = {
          'North Sector': 0,
          'East Zone': 0,
          'Central': 0,
          'West District': 0
        };
        
        storedReports.forEach(report => {
          if (Object.prototype.hasOwnProperty.call(areaCounts, report.area)) {
            areaCounts[report.area]++;
          }
        });
        
        setAreaData([
          { name: 'North Sector', value: areaCounts['North Sector'], color: '#3B82F6' },
          { name: 'East Zone', value: areaCounts['East Zone'], color: '#10B981' },
          { name: 'Central', value: areaCounts['Central'], color: '#F59E0B' },
          { name: 'West District', value: areaCounts['West District'], color: '#EF4444' },
        ]);
        
        // Update recent reports
        const sortedReports = storedReports
          .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
          .slice(0, 5)
          .map(report => ({
            id: report.binId || `B-${Math.floor(Math.random() * 1000)}`,
            area: report.area || 'Unknown',
            time: report.timestamp ? formatTimeAgo(new Date(report.timestamp)) : 'Just now',
            status: mapReportStatus(report.urgency)
          }));
        
        setRecentReports(sortedReports);
      };
      
      await loadDashboardData();
      addNotification('Dashboard data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      addNotification('Failed to refresh dashboard data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const filteredReports = recentReports.filter(report => {
    const matchesSearch = report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleReportClick = (report) => {
    // Navigate to assignments page and filter by this report
    navigate('/assignments', { state: { filterReportId: report.id } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Waste Management Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor waste collection status and manage city-wide bin operations</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
        >
          {isRefreshing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Refreshing...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh Data
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg text-white ${
              notification.type === 'success' ? 'bg-green-600' : 
              notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: IconComponent, color }) => {
          // `no-unused-vars` can miss JSX component usage, so explicitly reference it.
          void IconComponent;

          return (
            <div key={label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`${color} p-3 rounded-full`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Activity</h2>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="collections" fill="#10B981" name="Collections" />
              <Bar dataKey="reports" fill="#F59E0B" name="Reports" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reports by Area</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={areaData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {areaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bin ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr 
                    key={report.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleReportClick(report)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {report.area}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.status === 'completed' ? 'bg-green-100 text-green-800' :
                        report.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 text-black">Quick Report</h3>
          <p className="text-blue-100 mb-4">Report a full bin immediately</p>
          <button 
            onClick={handleQuickReport}
            className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
          >
            Report Now
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 text-black">View Routes</h3>
          <p className="text-green-100 mb-4">Check active truck routes</p>
          <button 
            onClick={handleViewRoutes}
            className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-50 transition-colors"
          >
            View Routes
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 text-black">Analytics</h3>
          <p className="text-purple-100 mb-4">Detailed waste analytics</p>
          <button 
            onClick={handleViewAnalytics}
            className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-50 transition-colors"
          >
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
