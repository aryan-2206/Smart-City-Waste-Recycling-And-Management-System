import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Navigation, Clock, CheckCircle, AlertCircle, Users, Fuel, Route, Phone, MessageSquare, Play, Pause, Square } from 'lucide-react';
import MapComponent from '../components/MapComponent';

const routes = [
  {
    id: 1,
    driver: 'Driver 07',
    driverName: 'Raj Kumar',
    truckId: 'TRK-007',
    status: 'active',
    currentStop: 'B-042',
    nextStop: 'B-038',
    stops: [
      { id: 'B-042', area: 'North Sector', address: 'Main Market', status: 'in-progress', estimatedArrival: 'Now' },
      { id: 'B-038', area: 'North Sector', address: 'Shopping Complex', status: 'pending', estimatedArrival: '15 mins' },
      { id: 'B-051', area: 'North Sector', address: 'Residential Area', status: 'pending', estimatedArrival: '30 mins' }
    ],
    totalDistance: '12 km',
    totalTime: '~45 min',
    fuelUsed: '8L',
    capacity: '65%',
    progress: 33
  },
  {
    id: 2,
    driver: 'Driver 03',
    driverName: 'Amit Singh',
    truckId: 'TRK-003',
    status: 'active',
    currentStop: 'B-018',
    nextStop: 'B-022',
    stops: [
      { id: 'B-018', area: 'East Zone', address: 'Commercial Complex', status: 'completed', estimatedArrival: 'Completed' },
      { id: 'B-022', area: 'East Zone', address: 'Office Park', status: 'in-progress', estimatedArrival: 'Now' }
    ],
    totalDistance: '6 km',
    totalTime: '~25 min',
    fuelUsed: '4L',
    capacity: '40%',
    progress: 50
  },
  {
    id: 3,
    driver: 'Driver 12',
    driverName: 'Priya Patel',
    truckId: 'TRK-012',
    status: 'completed',
    currentStop: null,
    nextStop: null,
    stops: [
      { id: 'B-091', area: 'Central', address: 'City Center', status: 'completed', estimatedArrival: 'Completed' },
      { id: 'B-088', area: 'Central', address: 'Mall Area', status: 'completed', estimatedArrival: 'Completed' },
      { id: 'B-095', area: 'Central', address: 'Bus Station', status: 'completed', estimatedArrival: 'Completed' }
    ],
    totalDistance: '18 km',
    totalTime: '1h',
    fuelUsed: '12L',
    capacity: '85%',
    progress: 100
  },
  {
    id: 4,
    driver: 'Driver 05',
    driverName: 'Mohammed Ali',
    truckId: 'TRK-005',
    status: 'scheduled',
    currentStop: null,
    nextStop: 'B-076',
    stops: [
      { id: 'B-076', area: 'West District', address: 'Industrial Area', status: 'scheduled', estimatedArrival: '2:00 PM' },
      { id: 'B-082', area: 'West District', address: 'Factory Zone', status: 'scheduled', estimatedArrival: '2:30 PM' },
      { id: 'B-089', area: 'West District', address: 'Warehouse District', status: 'scheduled', estimatedArrival: '3:00 PM' }
    ],
    totalDistance: '15 km',
    totalTime: '~1h 30min',
    fuelUsed: '0L',
    capacity: '0%',
    progress: 0
  }
];

const statusColors = {
  'scheduled': 'bg-gray-100 text-gray-800',
  'active': 'bg-green-100 text-green-800',
  'completed': 'bg-blue-100 text-blue-800',
  'delayed': 'bg-red-100 text-red-800'
};

const stopStatusColors = {
  'scheduled': 'bg-gray-100 text-gray-700',
  'pending': 'bg-yellow-100 text-yellow-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'completed': 'bg-green-100 text-green-700'
};

export default function RoutesPage() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [isSimulating, setIsSimulating] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [routeUpdates, setRouteUpdates] = useState(routes);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setRouteUpdates(prevRoutes => 
          prevRoutes.map(route => {
            if (route.status === 'active' && route.progress < 100) {
              const newProgress = Math.min(route.progress + Math.random() * 10, 100);
              const completedStops = Math.floor((newProgress / 100) * route.stops.length);
              
              return {
                ...route,
                progress: newProgress,
                stops: route.stops.map((stop, index) => {
                  if (index < completedStops) {
                    return { ...stop, status: 'completed', estimatedArrival: 'Completed' };
                  } else if (index === completedStops && newProgress < 100) {
                    return { ...stop, status: 'in-progress', estimatedArrival: 'Now' };
                  } else if (index === completedStops + 1 && newProgress < 100) {
                    return { ...stop, status: 'pending', estimatedArrival: `${Math.floor(Math.random() * 30 + 5)} mins` };
                  }
                  return stop;
                }),
                status: newProgress >= 100 ? 'completed' : 'active',
                currentStop: newProgress < 100 ? route.stops[completedStops]?.id : null,
                nextStop: newProgress < 100 ? route.stops[completedStops + 1]?.id : null,
                capacity: `${Math.floor(newProgress)}%`
              };
            }
            return route;
          })
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isSimulating]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'active': return <Truck className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'delayed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStopStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-3 w-3" />;
      case 'pending': return <MapPin className="h-3 w-3" />;
      case 'in-progress': return <Navigation className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const handleCallDriver = (driverName) => {
    addNotification(`Calling driver: ${driverName}`, 'info');
    // In a real app, this would open phone dialer
    window.open(`tel:+1234567890`); // Placeholder phone number
  };

  const handleMessageDriver = (driverName) => {
    addNotification(`Opening message app for driver: ${driverName}`, 'info');
    // In a real app, this would open messaging app
    alert(`Message interface for ${driverName} would open here`);
  };

  const handleStartRoute = (routeId) => {
    setRouteUpdates(prevRoutes =>
      prevRoutes.map(route =>
        route.id === routeId
          ? { ...route, status: 'active', progress: 0 }
          : route
      )
    );
    addNotification('Route started successfully!', 'success');
  };

  const handlePauseRoute = (routeId) => {
    setRouteUpdates(prevRoutes =>
      prevRoutes.map(route =>
        route.id === routeId
          ? { ...route, status: 'delayed' }
          : route
      )
    );
    addNotification('Route paused', 'warning');
  };

  const handleCompleteRoute = (routeId) => {
    setRouteUpdates(prevRoutes =>
      prevRoutes.map(route =>
        route.id === routeId
          ? { 
              ...route, 
              status: 'completed', 
              progress: 100,
              stops: route.stops.map(stop => ({ ...stop, status: 'completed', estimatedArrival: 'Completed' }))
            }
          : route
      )
    );
    addNotification('Route completed successfully!', 'success');
  };

  const handleCreateNewRoute = () => {
    navigate('/assignments');
  };

  const generateMapVisualization = () => {
    return (
      <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
        {/* Simulated map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
          {/* Grid lines to simulate map */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Route paths and truck positions */}
        <svg className="absolute inset-0 w-full h-full">
          {routeUpdates.filter(r => r.status !== 'scheduled').map((route, routeIndex) => {
            const startX = 50 + (routeIndex * 150);
            const startY = 50;
            const endX = startX + 200;
            const endY = startY + 150;
            
            return (
              <g key={route.id}>
                {/* Route path */}
                <path
                  d={`M ${startX} ${startY} Q ${startX + 100} ${startY + 75} ${endX} ${endY}`}
                  stroke={route.status === 'completed' ? '#10b981' : route.status === 'active' ? '#3b82f6' : '#6b7280'}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={route.status === 'delayed' ? '5,5' : '0'}
                />
                
                {/* Truck position */}
                {route.status === 'active' && (
                  <circle
                    cx={startX + (route.progress / 100) * 200}
                    cy={startY + (route.progress / 100) * 150}
                    r="8"
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <animate
                      attributeName="r"
                      values="8;10;8"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                
                {/* Stop markers */}
                {route.stops.map((stop, index) => {
                  const x = startX + (index / (route.stops.length - 1)) * 200;
                  const y = startY + (index / (route.stops.length - 1)) * 150;
                  
                  return (
                    <circle
                      key={stop.id}
                      cx={x}
                      cy={y}
                      r="6"
                      fill={stop.status === 'completed' ? '#10b981' : stop.status === 'in-progress' ? '#3b82f6' : '#6b7280'}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Active Truck</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Completed Stop</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Pending Stop</span>
            </div>
          </div>
        </div>
        
        {/* Real-time updates indicator */}
        {isSimulating && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            Live Tracking
          </div>
        )}
      </div>
    );
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
              notification.type === 'error' ? 'bg-red-600' : 
              notification.type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Truck Routes</h1>
          <p className="mt-2 text-gray-600">Monitor real-time waste collection routes and truck movements</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
              isSimulating 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Simulation
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Simulation
              </>
            )}
          </button>
          <button
            onClick={handleCreateNewRoute}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Create New Route
          </button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Map View
            </button>
          </div>
        </div>
      </div>

      {/* Route Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Routes</p>
              <p className="text-2xl font-bold text-green-600">{routeUpdates.filter(r => r.status === 'active').length}</p>
            </div>
            <Truck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-blue-600">{routeUpdates.filter(r => r.status === 'completed').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Distance</p>
              <p className="text-2xl font-bold text-purple-600">51 km</p>
            </div>
            <Route className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fuel Used</p>
              <p className="text-2xl font-bold text-orange-600">24L</p>
            </div>
            <Fuel className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Routes List */}
      {viewMode === 'list' ? (
        <div className="space-y-6">
          {routeUpdates.map((route) => (
            <div key={route.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Route Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{route.driverName}</h3>
                      <p className="text-sm text-gray-500">{route.driver} • {route.truckId}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[route.status]}`}>
                      {getStatusIcon(route.status)}
                      <span className="ml-1">{route.status.charAt(0).toUpperCase() + route.status.slice(1)}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-semibold text-gray-900">{route.totalDistance}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Est. Time</p>
                      <p className="font-semibold text-gray-900">{route.totalTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-semibold text-gray-900">{route.capacity}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleCallDriver(route.driverName)}
                        className="p-2 text-blue-600 hover:text-blue-800" 
                        title="Call Driver"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleMessageDriver(route.driverName)}
                        className="p-2 text-green-600 hover:text-green-800" 
                        title="Message Driver"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setSelectedRoute(route)}
                        className="p-2 text-gray-600 hover:text-gray-800" 
                        title="View Details"
                      >
                        <Navigation className="h-4 w-4" />
                      </button>
                      {route.status === 'scheduled' && (
                        <button 
                          onClick={() => handleStartRoute(route.id)}
                          className="p-2 text-green-600 hover:text-green-800" 
                          title="Start Route"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      {route.status === 'active' && (
                        <button 
                          onClick={() => handlePauseRoute(route.id)}
                          className="p-2 text-yellow-600 hover:text-yellow-800" 
                          title="Pause Route"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      )}
                      {(route.status === 'active' || route.status === 'delayed') && (
                        <button 
                          onClick={() => handleCompleteRoute(route.id)}
                          className="p-2 text-blue-600 hover:text-blue-800" 
                          title="Complete Route"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {route.status === 'active' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Route Progress</span>
                      <span>{Math.floor(route.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${route.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Route Stops */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Collection Stops</h4>
                  {route.currentStop && (
                    <div className="text-sm">
                      <span className="text-gray-500">Current: </span>
                      <span className="font-medium text-blue-600">{route.currentStop}</span>
                      {route.nextStop && (
                        <>
                          <span className="text-gray-500 mx-2">→</span>
                          <span className="font-medium text-gray-600">Next: {route.nextStop}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {route.stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stopStatusColors[stop.status]}`}>
                          {getStopStatusIcon(stop.status)}
                        </div>
                        {index < route.stops.length - 1 && (
                          <div className={`w-0.5 h-8 ml-4 ${
                            stop.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{stop.id}</p>
                            <p className="text-sm text-gray-500">{stop.address}, {stop.area}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stopStatusColors[stop.status]}`}>
                              {stop.status.charAt(0).toUpperCase() + stop.status.slice(1).replace('-', ' ')}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">{stop.estimatedArrival}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Map View */
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Route Map</h3>
            <p className="text-gray-500">Real-time visualization of active collection routes</p>
          </div>
          {selectedRoute && (
            <MapComponent
              route={selectedRoute}
              onLocationClick={(stop) => {
                console.log('Location clicked:', stop);
                // Handle location click - could show details or navigate
              }}
              isSimulating={isSimulating}
              onStartRoute={() => handleStartRoute(selectedRoute.id)}
              onPauseRoute={() => handlePauseRoute(selectedRoute.id)}
              onCompleteRoute={() => handleCompleteRoute(selectedRoute.id)}
            />
          )}
        </div>
      )}

      {/* Route Detail Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Route Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Driver</p>
                  <p className="text-sm text-gray-900">{selectedRoute.driverName} ({selectedRoute.driver})</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Truck</p>
                  <p className="text-sm text-gray-900">{selectedRoute.truckId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Route Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedRoute.status]}`}>
                    {selectedRoute.status.charAt(0).toUpperCase() + selectedRoute.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Stops</p>
                  <p className="text-sm text-gray-900">{selectedRoute.stops.length} bins</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Distance</p>
                  <p className="text-sm text-gray-900">{selectedRoute.totalDistance}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Progress</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${selectedRoute.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{Math.floor(selectedRoute.progress)}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <div className="space-x-2">
                  <button 
                    onClick={() => handleCallDriver(selectedRoute.driverName)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Call Driver
                  </button>
                  <button 
                    onClick={() => handleMessageDriver(selectedRoute.driverName)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Message
                  </button>
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={() => setSelectedRoute(null)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                  >
                    Close
                  </button>
                  {selectedRoute.status === 'scheduled' && (
                    <button 
                      onClick={() => {
                        handleStartRoute(selectedRoute.id);
                        setSelectedRoute(null);
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Start Route
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
