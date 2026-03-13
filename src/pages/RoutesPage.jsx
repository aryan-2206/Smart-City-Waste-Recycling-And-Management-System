import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Navigation, Clock, CheckCircle, AlertCircle, Users, Fuel, Route, Phone, MessageSquare } from 'lucide-react';

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
  const navigate = useNavigate();

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
    alert(`Calling driver: ${driverName}`);
  };

  const handleMessageDriver = (driverName) => {
    alert(`Opening message app for driver: ${driverName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Truck Routes</h1>
          <p className="mt-2 text-gray-600">Monitor real-time waste collection routes and truck movements</p>
        </div>
        <div className="flex items-center space-x-3">
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
              <p className="text-2xl font-bold text-green-600">{routes.filter(r => r.status === 'active').length}</p>
            </div>
            <Truck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-blue-600">{routes.filter(r => r.status === 'completed').length}</p>
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
          {routes.map((route) => (
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
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {route.status === 'active' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Route Progress</span>
                      <span>{route.progress}%</span>
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
        /* Map View Placeholder */
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
          <p className="text-gray-500">Interactive map view would be displayed here with real-time truck locations and routes.</p>
          <div className="mt-6 bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-400">Map integration placeholder</p>
          </div>
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
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setSelectedRoute(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
