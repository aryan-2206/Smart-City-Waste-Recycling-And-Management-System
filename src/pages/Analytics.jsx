import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Download, Filter, BarChart3, PieChartIcon, Activity, Users, Truck, AlertTriangle, CheckCircle, Clock, DollarSign, Leaf, Recycle } from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Sample data for analytics
  const monthlyData = [
    { month: 'Jan', collections: 1240, reports: 89, efficiency: 92, cost: 45000 },
    { month: 'Feb', collections: 1180, reports: 76, efficiency: 88, cost: 42000 },
    { month: 'Mar', collections: 1350, reports: 95, efficiency: 94, cost: 48000 },
    { month: 'Apr', collections: 1420, reports: 102, efficiency: 96, cost: 51000 },
    { month: 'May', collections: 1380, reports: 98, efficiency: 93, cost: 49000 },
    { month: 'Jun', collections: 1450, reports: 105, efficiency: 97, cost: 52000 },
  ];

  const wasteTypeData = [
    { type: 'Organic', amount: 4500, percentage: 35, color: '#10B981' },
    { type: 'Recyclable', amount: 3800, percentage: 30, color: '#3B82F6' },
    { type: 'Hazardous', amount: 1200, percentage: 9, color: '#EF4444' },
    { type: 'Electronic', amount: 800, percentage: 6, color: '#8B5CF6' },
    { type: 'Construction', amount: 1500, percentage: 12, color: '#F59E0B' },
    { type: 'Other', amount: 1000, percentage: 8, color: '#6B7280' },
  ];

  const areaPerformance = [
    { area: 'North Sector', efficiency: 94, collections: 450, complaints: 8, responseTime: 2.1 },
    { area: 'East Zone', efficiency: 89, collections: 380, complaints: 12, responseTime: 2.8 },
    { area: 'Central', efficiency: 96, collections: 520, complaints: 5, responseTime: 1.8 },
    { area: 'West District', efficiency: 91, collections: 410, complaints: 10, responseTime: 2.4 },
    { area: 'South End', efficiency: 87, collections: 340, complaints: 15, responseTime: 3.1 },
  ];

  const fleetUtilization = [
    { truck: 'TRK-001', utilization: 85, routes: 12, fuel: 450, maintenance: 'Good' },
    { truck: 'TRK-002', utilization: 92, routes: 14, fuel: 380, maintenance: 'Excellent' },
    { truck: 'TRK-003', utilization: 78, routes: 10, fuel: 520, maintenance: 'Fair' },
    { truck: 'TRK-004', utilization: 88, routes: 13, fuel: 410, maintenance: 'Good' },
    { truck: 'TRK-005', utilization: 95, routes: 15, fuel: 350, maintenance: 'Excellent' },
  ];

  const environmentalImpact = [
    { metric: 'CO2 Saved', value: 2450, unit: 'tons', change: 12, icon: Leaf },
    { metric: 'Trees Saved', value: 892, unit: 'trees', change: 8, icon: Recycle },
    { metric: 'Water Saved', value: 156000, unit: 'gallons', change: 15, icon: Activity },
    { metric: 'Energy Recycled', value: 34000, unit: 'kWh', change: 20, icon: DollarSign },
  ];

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleExport = (format) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addNotification(`Analytics data exported as ${format.toUpperCase()} successfully!`, 'success');
    }, 1500);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    addNotification('Analytics data refreshed successfully!', 'success');
  };

  return (
    <div className="space-y-6">
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="mt-2 text-gray-600">Comprehensive waste management analytics and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Refreshing...
              </>
            ) : (
              'Refresh Data'
            )}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {environmentalImpact.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${item.change > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Icon className={`h-6 w-6 ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div className={`flex items-center text-sm ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {Math.abs(item.change)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {item.value.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">{item.unit}</p>
              <p className="text-xs text-gray-500 mt-1">{item.metric}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="collections" stackId="1" stroke="#10B981" fill="#10B981" name="Collections" />
              <Area type="monotone" dataKey="reports" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Reports" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Waste Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Waste Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={wasteTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {wasteTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Area Performance Comparison</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="text-green-600 hover:text-green-800 flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="text-green-600 hover:text-green-800 flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Export PDF
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={areaPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="area" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="efficiency" fill="#10B981" name="Efficiency %" />
            <Bar dataKey="collections" fill="#3B82F6" name="Collections" />
            <Bar dataKey="complaints" fill="#EF4444" name="Complaints" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fleet Utilization */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Fleet Utilization</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Routes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel (L)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fleetUtilization.map((truck, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{truck.truck}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            truck.utilization >= 90 ? 'bg-green-600' :
                            truck.utilization >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${truck.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{truck.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truck.routes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truck.fuel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truck.maintenance}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      truck.utilization >= 90 ? 'bg-green-100 text-green-800' :
                      truck.utilization >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {truck.utilization >= 90 ? 'Optimal' : truck.utilization >= 80 ? 'Good' : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cost" stroke="#EF4444" strokeWidth={2} name="Operating Cost ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Efficiency Metrics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={areaPerformance}>
              <PolarGrid />
              <PolarAngleAxis dataKey="area" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Efficiency" dataKey="efficiency" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
