import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Truck, AlertTriangle, TrendingUp, MapPin, Clock, CheckCircle, Activity, DollarSign, FileText, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDrivers: 0,
    totalTrucks: 0,
    pendingReports: 0,
    completedCollections: 0,
    revenue: 0,
    activeRoutes: 0,
    systemEfficiency: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAdminData = () => {
      try {
        const reports = JSON.parse(localStorage.getItem('wasteReports') || '[]');
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const fleet = JSON.parse(localStorage.getItem('fleet') || '[]');

        setStats({
          totalUsers: 150, // Mock data
          activeDrivers: fleet.filter(f => f.status === 'active').length,
          totalTrucks: fleet.length,
          pendingReports: reports.filter(r => r.status === 'pending').length,
          completedCollections: assignments.filter(a => a.status === 'completed').length,
          revenue: fleet.reduce((sum, f) => sum + f.revenue, 0),
          activeRoutes: assignments.filter(a => a.status === 'active').length,
          systemEfficiency: 85 // Mock efficiency percentage
        });

        // Mock recent activity
        setRecentActivity([
          { id: 1, type: 'report', message: 'New bin report from North Sector', time: '2 mins ago', icon: AlertTriangle },
          { id: 2, type: 'assignment', message: 'Driver assigned to Route A', time: '5 mins ago', icon: Users },
          { id: 3, type: 'collection', message: 'Collection completed in East Zone', time: '10 mins ago', icon: CheckCircle },
          { id: 4, type: 'alert', message: 'Low fuel alert for TRK-002', time: '15 mins ago', icon: Activity },
        ]);

        // Mock system alerts
        setSystemAlerts([
          { id: 1, type: 'urgent', message: '3 bins reported as overflowing', time: '1 min ago' },
          { id: 2, type: 'warning', message: '2 trucks require maintenance', time: '5 mins ago' },
          { id: 3, type: 'info', message: 'System backup completed successfully', time: '1 hour ago' },
        ]);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };

    loadAdminData();
    const interval = setInterval(loadAdminData, 10000);
    return () => clearInterval(interval);
  }, []);

  const performanceData = [
    { name: 'Mon', collections: 45, efficiency: 82 },
    { name: 'Tue', collections: 52, efficiency: 88 },
    { name: 'Wed', collections: 38, efficiency: 79 },
    { name: 'Thu', collections: 65, efficiency: 91 },
    { name: 'Fri', collections: 48, efficiency: 85 },
    { name: 'Sat', collections: 35, efficiency: 78 },
    { name: 'Sun', collections: 25, efficiency: 72 },
  ];

  const areaDistribution = [
    { name: 'North Sector', value: 35, color: '#3B82F6' },
    { name: 'East Zone', value: 28, color: '#10B981' },
    { name: 'Central', value: 22, color: '#F59E0B' },
    { name: 'West District', value: 15, color: '#EF4444' },
  ];

  const quickActions = [
    { title: 'Assign Drivers', description: 'Manage driver assignments', icon: Users, path: '/assignments', color: 'bg-blue-500' },
    { title: 'Manage Fleet', description: 'Monitor truck fleet', icon: Truck, path: '/fleet', color: 'bg-green-500' },
    { title: 'View Reports', description: 'Check bin reports', icon: FileText, path: '/report', color: 'bg-yellow-500' },
    { title: 'System Settings', description: 'Configure system', icon: Settings, path: '/settings', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">System overview and management controls</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            System Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Drivers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeDrivers}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trucks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalTrucks}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-full">
              <Truck className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Efficiency</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.systemEfficiency}%</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="collections" stroke="#10B981" strokeWidth={2} name="Collections" />
              <Line type="monotone" dataKey="efficiency" stroke="#F59E0B" strokeWidth={2} name="Efficiency %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Area Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Collection Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={areaDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {areaDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'alert' ? 'bg-red-100' :
                      activity.type === 'assignment' ? 'bg-blue-100' :
                      activity.type === 'collection' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        activity.type === 'alert' ? 'text-red-600' :
                        activity.type === 'assignment' ? 'text-blue-600' :
                        activity.type === 'collection' ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h2>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'urgent' ? 'bg-red-50 border-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(action.path)}
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
