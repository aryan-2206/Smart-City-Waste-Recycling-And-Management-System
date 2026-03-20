import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, MapPin, Clock, CheckCircle, TrendingUp, FileText, Phone, MessageSquare, Calendar, BarChart3 } from 'lucide-react';

export default function UserDashboard() {
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    id: 'user-001',
    email: 'user@wastemanagement.com',
    phone: '+1-555-0102',
    address: '123 Main St, City'
  });

  const [userStats, setUserStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0,
    thisMonthReports: 0
  });

  const [recentReports, setRecentReports] = useState([]);
  const [driverStatus, setDriverStatus] = useState([]);
  const [areaStats, setAreaStats] = useState({
    northSector: 0,
    eastZone: 0,
    central: 0,
    westDistrict: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      try {
        // Get current user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (user.role === 'user') {
          setUserInfo({
            name: user.name || 'John Doe',
            id: user.id || 'user-001',
            email: user.email || 'user@wastemanagement.com',
            phone: user.phone || '+1-555-0102',
            address: user.address || '123 Main St, City'
          });

          // Get user's reports
          const reports = JSON.parse(localStorage.getItem('wasteReports') || '[]');
          const userReports = reports.filter(r => r.reporterEmail === user.email);
          
          setUserStats({
            totalReports: userReports.length,
            pendingReports: userReports.filter(r => r.status === 'pending').length,
            completedReports: userReports.filter(r => r.status === 'completed').length,
            thisMonthReports: userReports.filter(r => {
              const reportDate = new Date(r.timestamp);
              const now = new Date();
              return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
            }).length
          });

          // Get recent reports with status updates
          const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
          const reportsWithStatus = userReports.map(report => {
            const assignment = assignments.find(a => a.binId === report.binId);
            return {
              ...report,
              assignmentStatus: assignment?.status || 'unassigned',
              driverName: assignment?.driverName || 'Unassigned',
              estimatedTime: assignment?.estimatedTime || 'Pending assignment'
            };
          }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

          setRecentReports(reportsWithStatus);

          // Calculate area statistics
          const areaCounts = {
            northSector: userReports.filter(r => r.area === 'North Sector').length,
            eastZone: userReports.filter(r => r.area === 'East Zone').length,
            central: userReports.filter(r => r.area === 'Central').length,
            westDistrict: userReports.filter(r => r.area === 'West District').length
          };
          setAreaStats(areaCounts);

          // Mock driver status for assigned reports
          const driverStatusData = [
            { name: 'Raj Kumar', status: 'On Route', truck: 'TRK-001', eta: '2 hours' },
            { name: 'Amit Singh', status: 'Available', truck: 'TRK-002', eta: 'Available' },
            { name: 'Priya Patel', status: 'On Break', truck: 'TRK-003', eta: '30 mins' },
          ];
          setDriverStatus(driverStatusData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
    const interval = setInterval(loadUserData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNewReport = () => {
    navigate('/report');
  };

  const handleViewReport = (reportId) => {
    // Navigate to report details or show modal
    navigate('/report', { state: { reportId } });
  };

  const handleContactDriver = (driverName) => {
    // Simulate contacting driver
    alert(`Contacting ${driverName}...`);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const quickActions = [
    { title: 'Report Bin', description: 'Report a full bin', icon: FileText, action: handleNewReport, color: 'bg-green-500' },
    { title: 'View Reports', description: 'See your report history', icon: BarChart3, action: () => scrollToSection('user-recent-reports'), color: 'bg-blue-500' },
    { title: 'Track Driver', description: 'Check driver status', icon: MapPin, action: () => scrollToSection('user-driver-status'), color: 'bg-yellow-500' },
    {
      title: 'Emergency',
      description: 'Report urgent issue',
      icon: AlertTriangle,
      action: () => navigate('/report', { state: { isEmergency: true } }),
      color: 'bg-red-500'
    },
  ];

  const _reportHistory = [
    { id: 1, binId: 'B-042', area: 'North Sector', date: '2024-03-20', status: 'completed', driver: 'Raj Kumar' },
    { id: 2, binId: 'B-018', area: 'East Zone', date: '2024-03-19', status: 'in-progress', driver: 'Amit Singh' },
    { id: 3, binId: 'B-091', area: 'Central', date: '2024-03-18', status: 'pending', driver: 'Unassigned' },
    { id: 4, binId: 'B-076', area: 'West District', date: '2024-03-17', status: 'completed', driver: 'Priya Patel' },
    { id: 5, binId: 'B-033', area: 'North Sector', date: '2024-03-16', status: 'completed', driver: 'Raj Kumar' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {userInfo.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Active User
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="text-sm text-gray-600">Name:</span>
            <p className="font-medium">{userInfo.name}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Email:</span>
            <p className="font-medium">{userInfo.email}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Phone:</span>
            <p className="font-medium">{userInfo.phone}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Address:</span>
            <p className="font-medium">{userInfo.address}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.totalReports}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{userStats.pendingReports}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-full">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{userStats.completedReports}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{userStats.thisMonthReports}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports & Driver Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div id="user-recent-reports" className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Recent Reports</h2>
            <div className="space-y-3">
              {recentReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No reports yet. Click "Report Bin" to get started!</p>
                </div>
              ) : (
                recentReports.map((report) => (
                  <div 
                    key={report.id} 
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewReport(report.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {report.binId} - {report.area}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(report.timestamp).toLocaleDateString()} • {report.urgency} priority
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          report.assignmentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                          report.assignmentStatus === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          report.assignmentStatus === 'assigned' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.assignmentStatus || 'Pending'}
                        </span>
                      </div>
                    </div>
                    {report.driverName && (
                      <div className="mt-2 text-xs text-gray-600">
                        Driver: {report.driverName} • ETA: {report.estimatedTime}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Driver Status */}
        <div id="user-driver-status" className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver Status</h2>
            <div className="space-y-3">
              {driverStatus.map((driver, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.truck}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        driver.status === 'On Route' ? 'bg-green-100 text-green-800' :
                        driver.status === 'Available' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {driver.status}
                      </span>
                      <button
                        onClick={() => handleContactDriver(driver.name)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Contact driver"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleContactDriver(driver.name)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Message driver"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    ETA: {driver.eta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Area Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reports by Area</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{areaStats.northSector}</p>
            <p className="text-sm text-gray-600">North Sector</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{areaStats.eastZone}</p>
            <p className="text-sm text-gray-600">East Zone</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{areaStats.central}</p>
            <p className="text-sm text-gray-600">Central</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{areaStats.westDistrict}</p>
            <p className="text-sm text-gray-600">West District</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} rounded-lg shadow p-6 text-white hover:opacity-90 transition-opacity`}
            >
              <Icon className="h-8 w-8 mb-3" />
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
