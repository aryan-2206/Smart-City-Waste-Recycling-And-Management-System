import { useState, useEffect } from 'react';
import { Truck, MapPin, Users, Fuel, Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, Plus, Edit2, Eye, Calendar, DollarSign, Activity, Battery, Navigation, Phone, MessageSquare, Filter, Search, Download, BarChart3 } from 'lucide-react';

const Fleet = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample fleet data
  const [fleet, setFleet] = useState([
    {
      id: 1,
      plateNumber: 'TRK-001',
      type: 'Heavy Duty',
      model: 'Volvo FH16',
      year: 2022,
      driver: 'Raj Kumar',
      driverId: 'DRV-001',
      status: 'active',
      location: 'North Sector',
      fuelLevel: 75,
      mileage: 45000,
      lastMaintenance: '2024-02-15',
      nextMaintenance: '2024-05-15',
      maintenanceStatus: 'good',
      capacity: '5 tons',
      currentRoute: 'Route A',
      routeProgress: 65,
      todayCollections: 8,
      monthlyCollections: 180,
      fuelEfficiency: 8.5,
      operatingCost: 450,
      revenue: 1200,
      lastInspection: '2024-03-01',
      insuranceExpiry: '2024-12-31',
      registrationExpiry: '2024-06-30'
    },
    {
      id: 2,
      plateNumber: 'TRK-002',
      type: 'Medium Duty',
      model: 'Tata LPT 1613',
      year: 2021,
      driver: 'Amit Singh',
      driverId: 'DRV-002',
      status: 'maintenance',
      location: 'Workshop',
      fuelLevel: 45,
      mileage: 62000,
      lastMaintenance: '2024-03-10',
      nextMaintenance: '2024-03-25',
      maintenanceStatus: 'due',
      capacity: '3 tons',
      currentRoute: 'N/A',
      routeProgress: 0,
      todayCollections: 0,
      monthlyCollections: 120,
      fuelEfficiency: 7.2,
      operatingCost: 380,
      revenue: 800,
      lastInspection: '2024-02-15',
      insuranceExpiry: '2024-11-30',
      registrationExpiry: '2024-05-31'
    },
    {
      id: 3,
      plateNumber: 'TRK-003',
      type: 'Light Duty',
      model: 'Mahindra Bolero Pikup',
      year: 2023,
      driver: 'Priya Patel',
      driverId: 'DRV-003',
      status: 'active',
      location: 'East Zone',
      fuelLevel: 60,
      mileage: 28000,
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-04-20',
      maintenanceStatus: 'good',
      capacity: '1.5 tons',
      currentRoute: 'Route B',
      routeProgress: 40,
      todayCollections: 6,
      monthlyCollections: 150,
      fuelEfficiency: 12.5,
      operatingCost: 280,
      revenue: 750,
      lastInspection: '2024-03-05',
      insuranceExpiry: '2025-01-31',
      registrationExpiry: '2024-07-31'
    },
    {
      id: 4,
      plateNumber: 'TRK-004',
      type: 'Heavy Duty',
      model: 'Ashok Leyland 4020',
      year: 2020,
      driver: 'Mohammed Ali',
      driverId: 'DRV-004',
      status: 'inactive',
      location: 'Parking Lot',
      fuelLevel: 30,
      mileage: 78000,
      lastMaintenance: '2024-02-28',
      nextMaintenance: '2024-03-15',
      maintenanceStatus: 'overdue',
      capacity: '8 tons',
      currentRoute: 'N/A',
      routeProgress: 0,
      todayCollections: 0,
      monthlyCollections: 90,
      fuelEfficiency: 6.8,
      operatingCost: 520,
      revenue: 0,
      lastInspection: '2024-02-01',
      insuranceExpiry: '2024-10-31',
      registrationExpiry: '2024-04-30'
    },
    {
      id: 5,
      plateNumber: 'TRK-005',
      type: 'Medium Duty',
      model: 'Eicher Pro 3015',
      year: 2022,
      driver: 'Sunita Reddy',
      driverId: 'DRV-005',
      status: 'active',
      location: 'Central',
      fuelLevel: 85,
      mileage: 38000,
      lastMaintenance: '2024-02-25',
      nextMaintenance: '2024-05-25',
      maintenanceStatus: 'good',
      capacity: '4 tons',
      currentRoute: 'Route C',
      routeProgress: 80,
      todayCollections: 10,
      monthlyCollections: 200,
      fuelEfficiency: 9.2,
      operatingCost: 420,
      revenue: 1100,
      lastInspection: '2024-03-10',
      insuranceExpiry: '2024-12-15',
      registrationExpiry: '2024-08-31'
    }
  ]);

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    plateNumber: '',
    type: 'Medium Duty',
    model: '',
    year: new Date().getFullYear(),
    driver: '',
    driverId: '',
    capacity: '',
    insuranceExpiry: '',
    registrationExpiry: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Under Maintenance' }
  ];

  const vehicleTypes = [
    'Light Duty',
    'Medium Duty', 
    'Heavy Duty',
    'Compact',
    'Specialized'
  ];

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const filteredFleet = fleet.filter(vehicle => {
    const matchesSearch = vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive': return <Clock className="h-4 w-4 text-gray-600" />;
      case 'maintenance': return <Wrench className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaintenanceStatusColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'due': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFuelLevelColor = (level) => {
    if (level >= 50) return 'bg-green-500';
    if (level >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleAddVehicle = () => {
    if (!newVehicle.plateNumber || !newVehicle.model || !newVehicle.driver) {
      addNotification('Please fill all required fields', 'error');
      return;
    }

    const vehicle = {
      ...newVehicle,
      id: Date.now(),
      status: 'inactive',
      location: 'Parking Lot',
      fuelLevel: 0,
      mileage: 0,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maintenanceStatus: 'good',
      currentRoute: 'N/A',
      routeProgress: 0,
      todayCollections: 0,
      monthlyCollections: 0,
      fuelEfficiency: 0,
      operatingCost: 0,
      revenue: 0,
      lastInspection: new Date().toISOString().split('T')[0]
    };

    setFleet([...fleet, vehicle]);
    setNewVehicle({
      plateNumber: '',
      type: 'Medium Duty',
      model: '',
      year: new Date().getFullYear(),
      driver: '',
      driverId: '',
      capacity: '',
      insuranceExpiry: '',
      registrationExpiry: ''
    });
    setShowAddModal(false);
    addNotification('Vehicle added successfully!', 'success');
  };

  const handleScheduleMaintenance = (vehicleId) => {
    const vehicle = fleet.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setShowMaintenanceModal(true);
    }
  };

  const handleCallDriver = (driver) => {
    addNotification(`Calling driver: ${driver}`, 'success');
  };

  const handleMessageDriver = (driver) => {
    addNotification(`Opening message app for driver: ${driver}`, 'success');
  };

  // Initialize fleet data in localStorage if not exists
  useEffect(() => {
    const storedFleet = localStorage.getItem('fleet');
    if (!storedFleet) {
      localStorage.setItem('fleet', JSON.stringify(fleet));
    }
  }, []);

  // Save fleet data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fleet', JSON.stringify(fleet));
  }, [fleet]);

  const activeVehicles = fleet.filter(v => v.status === 'active').length;
  const maintenanceVehicles = fleet.filter(v => v.status === 'maintenance').length;
  const totalRevenue = fleet.reduce((sum, v) => sum + v.revenue, 0);
  const totalOperatingCost = fleet.reduce((sum, v) => sum + v.operatingCost, 0);
  const totalCollections = fleet.reduce((sum, v) => sum + v.todayCollections, 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="mt-2 text-gray-600">Monitor and manage your waste collection fleet</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{activeVehicles}</p>
              <p className="text-xs text-gray-500 mt-1">of {fleet.length} total</p>
            </div>
            <Truck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Collections</p>
              <p className="text-2xl font-bold text-gray-900">{totalCollections}</p>
              <p className="text-xs text-gray-500 mt-1">completed</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
              <p className="text-xs text-gray-500 mt-1">daily</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Operating Cost</p>
              <p className="text-2xl font-bold text-gray-900">${totalOperatingCost}</p>
              <p className="text-xs text-gray-500 mt-1">daily</p>
            </div>
            <Activity className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFleet.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vehicle.plateNumber}</p>
                      <p className="text-xs text-gray-500">{vehicle.model} ({vehicle.year})</p>
                      <p className="text-xs text-gray-500">{vehicle.type} - {vehicle.capacity}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vehicle.driver}</p>
                      <p className="text-xs text-gray-500">{vehicle.driverId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(vehicle.status)}
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </div>
                    {vehicle.currentRoute !== 'N/A' && (
                      <p className="text-xs text-gray-500 mt-1">Route: {vehicle.currentRoute}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {vehicle.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getFuelLevelColor(vehicle.fuelLevel)}`}
                          style={{ width: `${vehicle.fuelLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{vehicle.fuelLevel}%</span>
                    </div>
                    <p className="text-xs text-gray-500">{vehicle.mileage.toLocaleString()} km</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Today:</span>
                        <span className="font-medium text-gray-900">{vehicle.todayCollections}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Revenue:</span>
                        <span className="font-medium text-green-600">${vehicle.revenue}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Efficiency:</span>
                        <span className="font-medium text-blue-600">{vehicle.fuelEfficiency} km/L</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMaintenanceStatusColor(vehicle.maintenanceStatus)}`}>
                          {vehicle.maintenanceStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Next: {vehicle.nextMaintenance}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {vehicle.driver && (
                        <>
                          <button
                            onClick={() => handleCallDriver(vehicle.driver)}
                            className="text-green-600 hover:text-green-900"
                            title="Call Driver"
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleMessageDriver(vehicle.driver)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Message Driver"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleScheduleMaintenance(vehicle.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Schedule Maintenance"
                      >
                        <Wrench className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Vehicle</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number *</label>
                    <input
                      type="text"
                      value={newVehicle.plateNumber}
                      onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newVehicle.type}
                      onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {vehicleTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                  <input
                    type="text"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="text"
                      value={newVehicle.capacity}
                      onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                      placeholder="e.g., 5 tons"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver *</label>
                    <input
                      type="text"
                      value={newVehicle.driver}
                      onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver ID</label>
                    <input
                      type="text"
                      value={newVehicle.driverId}
                      onChange={(e) => setNewVehicle({ ...newVehicle, driverId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry</label>
                    <input
                      type="date"
                      value={newVehicle.insuranceExpiry}
                      onChange={(e) => setNewVehicle({ ...newVehicle, insuranceExpiry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Expiry</label>
                    <input
                      type="date"
                      value={newVehicle.registrationExpiry}
                      onChange={(e) => setNewVehicle({ ...newVehicle, registrationExpiry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVehicle}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details - {selectedVehicle.plateNumber}</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vehicle Information</p>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm"><span className="font-medium">Model:</span> {selectedVehicle.model}</p>
                      <p className="text-sm"><span className="font-medium">Type:</span> {selectedVehicle.type}</p>
                      <p className="text-sm"><span className="font-medium">Year:</span> {selectedVehicle.year}</p>
                      <p className="text-sm"><span className="font-medium">Capacity:</span> {selectedVehicle.capacity}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Driver Information</p>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm"><span className="font-medium">Name:</span> {selectedVehicle.driver}</p>
                      <p className="text-sm"><span className="font-medium">ID:</span> {selectedVehicle.driverId}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Performance</p>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm"><span className="font-medium">Today's Collections:</span> {selectedVehicle.todayCollections}</p>
                      <p className="text-sm"><span className="font-medium">Monthly Collections:</span> {selectedVehicle.monthlyCollections}</p>
                      <p className="text-sm"><span className="font-medium">Fuel Efficiency:</span> {selectedVehicle.fuelEfficiency} km/L</p>
                      <p className="text-sm"><span className="font-medium">Revenue:</span> ${selectedVehicle.revenue}</p>
                      <p className="text-sm"><span className="font-medium">Operating Cost:</span> ${selectedVehicle.operatingCost}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Maintenance</p>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm"><span className="font-medium">Last Maintenance:</span> {selectedVehicle.lastMaintenance}</p>
                      <p className="text-sm"><span className="font-medium">Next Maintenance:</span> {selectedVehicle.nextMaintenance}</p>
                      <p className="text-sm"><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMaintenanceStatusColor(selectedVehicle.maintenanceStatus)}`}>
                          {selectedVehicle.maintenanceStatus}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Documents</p>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm"><span className="font-medium">Last Inspection:</span> {selectedVehicle.lastInspection}</p>
                      <p className="text-sm"><span className="font-medium">Insurance Expiry:</span> {selectedVehicle.insuranceExpiry}</p>
                      <p className="text-sm"><span className="font-medium">Registration Expiry:</span> {selectedVehicle.registrationExpiry}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Status</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedVehicle.status)}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedVehicle.status)}`}>
                          {selectedVehicle.status}
                        </span>
                      </div>
                      <p className="text-sm"><span className="font-medium">Location:</span> {selectedVehicle.location}</p>
                      <p className="text-sm"><span className="font-medium">Fuel Level:</span> {selectedVehicle.fuelLevel}%</p>
                      <p className="text-sm"><span className="font-medium">Mileage:</span> {selectedVehicle.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleScheduleMaintenance(selectedVehicle.id);
                    setSelectedVehicle(null);
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Schedule Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fleet;
