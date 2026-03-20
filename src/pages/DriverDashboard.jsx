import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Clock, CheckCircle, AlertTriangle, Phone, MessageSquare, Fuel, Wrench, DollarSign, TrendingUp } from 'lucide-react';

export default function DriverDashboard() {
  const [driverInfo, setDriverInfo] = useState({
    name: 'Raj Kumar',
    id: 'DRV-001',
    truckId: 'TRK-001',
    licenseNumber: 'DRV-001',
    phone: '+1-555-0101',
    status: 'active'
  });

  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [todayStats, setTodayStats] = useState({
    completedCollections: 0,
    pendingCollections: 0,
    fuelUsed: 0,
    revenue: 0,
    distance: 0
  });

  const [truckStatus, setTruckStatus] = useState({
    fuelLevel: 75,
    mileage: 45000,
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-05-15',
    status: 'active'
  });

  const [routeProgress, setRouteProgress] = useState({
    routeName: 'Route A',
    totalStops: 12,
    completedStops: 8,
    progress: 65,
    estimatedTime: '2 hours 30 mins'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadDriverData = () => {
      try {
        // Get current user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (user.role === 'driver') {
          setDriverInfo({
            name: user.name || 'Raj Kumar',
            id: user.id || 'DRV-001',
            truckId: user.truckId || 'TRK-001',
            licenseNumber: user.licenseNumber || 'DRV-001',
            phone: user.phone || '+1-555-0101',
            status: 'active'
          });

          // Get driver's assignments
          const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
          const driverAssignment = assignments.find(a => a.driverId === user.id && a.status === 'active');
          
          if (driverAssignment) {
            setCurrentAssignment(driverAssignment);
            setRouteProgress({
              routeName: driverAssignment.route || 'Route A',
              totalStops: driverAssignment.stops?.length || 12,
              completedStops: driverAssignment.completedStops || 8,
              progress: driverAssignment.progress || 65,
              estimatedTime: driverAssignment.estimatedTime || '2 hours 30 mins'
            });
          }

          // Get truck information
          const fleet = JSON.parse(localStorage.getItem('fleet') || '[]');
          const driverTruck = fleet.find(f => f.plateNumber === (user.truckId || 'TRK-001'));
          
          if (driverTruck) {
            setTruckStatus({
              fuelLevel: driverTruck.fuelLevel || 75,
              mileage: driverTruck.mileage || 45000,
              lastMaintenance: driverTruck.lastMaintenance || '2024-02-15',
              nextMaintenance: driverTruck.nextMaintenance || '2024-05-15',
              status: driverTruck.status || 'active'
            });

            setTodayStats({
              completedCollections: driverTruck.todayCollections || 8,
              pendingCollections: driverTruck.todayCollections ? 12 - driverTruck.todayCollections : 4,
              fuelUsed: 25,
              revenue: driverTruck.revenue || 1200,
              distance: 45
            });
          }
        }
      } catch (error) {
        console.error('Error loading driver data:', error);
      }
    };

    loadDriverData();
    const interval = setInterval(loadDriverData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartRoute = () => {
    if (currentAssignment) {
      // Update assignment status to active
      const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
      const updatedAssignments = assignments.map(a => 
        a.id === currentAssignment.id 
          ? { ...a, status: 'active', startTime: new Date().toISOString() }
          : a
      );
      localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
      setCurrentAssignment({ ...currentAssignment, status: 'active' });
    }
  };

  const handleCompleteStop = (stopId) => {
    // Simulate completing a stop
    const newProgress = Math.min(100, routeProgress.progress + (100 / routeProgress.totalStops));
    setRouteProgress({
      ...routeProgress,
      completedStops: routeProgress.completedStops + 1,
      progress: newProgress
    });

    // Update today's stats
    setTodayStats({
      ...todayStats,
      completedCollections: todayStats.completedCollections + 1,
      pendingCollections: Math.max(0, todayStats.pendingCollections - 1)
    });
  };

  const handleEmergencyReport = () => {
    navigate('/report', { 
      state: { 
        isEmergency: true, 
        driverId: driverInfo.id,
        truckId: driverInfo.truckId 
      } 
    });
  };

  const quickActions = [
    { title: 'Start Route', description: 'Begin your assigned route', icon: Truck, action: handleStartRoute, color: 'bg-green-500' },
    { title: 'Emergency Report', description: 'Report urgent issue', icon: AlertTriangle, action: handleEmergencyReport, color: 'bg-red-500' },
    { title: 'Contact Dispatch', description: 'Call dispatch center', icon: Phone, action: () => {}, color: 'bg-blue-500' },
    { title: 'Truck Status', description: 'View vehicle details', icon: Wrench, action: () => navigate('/fleet'), color: 'bg-yellow-500' },
  ];

  const upcomingStops = [
    { id: 1, location: 'North Sector - Bin B-042', address: '123 Main St', status: 'completed', time: '09:15 AM' },
    { id: 2, location: 'North Sector - Bin B-018', address: '456 Oak Ave', status: 'completed', time: '09:45 AM' },
    { id: 3, location: 'East Zone - Bin B-091', address: '789 Pine Rd', status: 'in-progress', time: '10:15 AM' },
    { id: 4, location: 'East Zone - Bin B-076', address: '321 Elm St', status: 'pending', time: '10:45 AM' },
    { id: 5, location: 'Central - Bin B-033', address: '654 Maple Dr', status: 'pending', time: '11:15 AM' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {driverInfo.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            driverInfo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {driverInfo.status === 'active' ? 'On Duty' : 'Off Duty'}
          </span>
        </div>
      </div>

      {/* Driver Info & Truck Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Driver ID:</span>
              <span className="text-sm font-medium">{driverInfo.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">License:</span>
              <span className="text-sm font-medium">{driverInfo.licenseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Truck:</span>
              <span className="text-sm font-medium">{driverInfo.truckId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Phone:</span>
              <span className="text-sm font-medium">{driverInfo.phone}</span>
            </div>
          </div>
        </div>

        {/* Truck Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Truck Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Fuel Level</span>
                <span className="text-sm font-medium">{truckStatus.fuelLevel}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    truckStatus.fuelLevel >= 50 ? 'bg-green-500' :
                    truckStatus.fuelLevel >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${truckStatus.fuelLevel}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Mileage:</span>
              <span className="text-sm font-medium">{truckStatus.mileage.toLocaleString()} km</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Next Maintenance:</span>
              <span className="text-sm font-medium">{truckStatus.nextMaintenance}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                truckStatus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {truckStatus.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Assignment */}
      {currentAssignment && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Assignment</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Route:</span>
                  <p className="font-medium">{routeProgress.routeName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Progress:</span>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{routeProgress.completedStops} of {routeProgress.totalStops} stops</span>
                      <span className="text-sm font-medium">{routeProgress.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${routeProgress.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Estimated Time:</span>
                  <p className="font-medium">{routeProgress.estimatedTime}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Upcoming Stops</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {upcomingStops.map((stop) => (
                  <div 
                    key={stop.id} 
                    className={`p-3 rounded-lg border ${
                      stop.status === 'completed' ? 'bg-green-50 border-green-200' :
                      stop.status === 'in-progress' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{stop.location}</p>
                        <p className="text-xs text-gray-500">{stop.address}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{stop.time}</span>
                        {stop.status === 'pending' && (
                          <button
                            onClick={() => handleCompleteStop(stop.id)}
                            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{todayStats.completedCollections}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{todayStats.pendingCollections}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fuel Used</p>
              <p className="text-2xl font-bold text-blue-600">{todayStats.fuelUsed}L</p>
            </div>
            <Fuel className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-purple-600">${todayStats.revenue}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
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
