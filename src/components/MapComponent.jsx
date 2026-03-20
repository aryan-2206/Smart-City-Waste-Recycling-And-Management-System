import { useState, useEffect } from 'react';
import { Truck, MapPin, Navigation, Clock, CheckCircle, AlertTriangle, Users, Fuel, Route, Phone, MessageSquare, Play, Pause, Square, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const MapComponent = ({ route, onLocationClick, isSimulating, onStartRoute, onPauseRoute, onCompleteRoute }) => {
  const [mapZoom, setMapZoom] = useState(12);
  const [selectedStop, setSelectedStop] = useState(null);
  const [showTraffic, setShowTraffic] = useState(true);

  // Simulate truck movement
  const [truckPosition, setTruckPosition] = useState({
    lat: 40.7128,
    lng: -74.0060
  });

  useEffect(() => {
    if (isSimulating && route?.status === 'active') {
      const interval = setInterval(() => {
        setTruckPosition(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001
        }));
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isSimulating, route?.status]);

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 1));
  };

  const handleStopClick = (stop) => {
    setSelectedStop(stop);
    onLocationClick(stop);
  };

  const getStopIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending': return <MapPin className="h-4 w-4 text-red-600" />;
      default: return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStopColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'pending': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`p-2 border rounded ${
              showTraffic ? 'bg-red-500 text-white' : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
            title="Toggle traffic"
          >
            <Route className="h-4 w-4" />
          </button>
          <button
            className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          Zoom: {mapZoom}x | Traffic: {showTraffic ? 'ON' : 'OFF'}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        {/* Static Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
          {/* Grid lines for map effect */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          
          {/* Route Path */}
          {route && (
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 100 150 Q 200 100 300 200 T 500 250"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeDasharray="5,5"
                opacity="0.8"
              />
            </svg>
          )}
          
          {/* Stops */}
          {route?.stops?.map((stop, index) => {
            const positions = [
              { x: 100, y: 150 },  // B-042
              { x: 200, y: 100 },  // B-038
              { x: 300, y: 200 },  // B-051
              { x: 400, y: 180 },  // B-018
              { x: 500, y: 250 },  // B-022
            ];
            
            const pos = positions[index] || { x: 250, y: 200 };
            
            return (
              <div
                key={stop.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                onClick={() => handleStopClick(stop)}
              >
                <div className={`p-2 rounded-full ${getStopColor(stop.status)} shadow-lg`}>
                  {getStopIcon(stop.status)}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                  <div className="font-medium">{stop.id}</div>
                  <div className="text-gray-500">{stop.address}</div>
                  <div className="text-gray-400">{stop.estimatedArrival}</div>
                </div>
              </div>
            );
          })}
          
          {/* Truck Position */}
          {route?.status === 'active' && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-2000"
              style={{ 
                left: `${truckPosition.lat * 10}px`, 
                top: `${truckPosition.lng * 10 + 100}px` 
              }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-blue-500 rounded-full animate-pulse opacity-30"></div>
                <div className="relative bg-blue-600 p-2 rounded-full shadow-lg">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                  <div className="font-medium text-blue-600">{route.truckId}</div>
                  <div className="text-gray-500">{route.driverName}</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Traffic Overlay */}
          {showTraffic && (
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Traffic congestion areas */}
                <rect x="150" y="120" width="60" height="40" fill="#FCA5A5" opacity="0.6" rx="5" />
                <rect x="350" y="160" width="80" height="60" fill="#FCA5A5" opacity="0.6" rx="5" />
                <rect x="50" y="200" width="40" height="30" fill="#FBBF24" opacity="0.6" rx="5" />
                
                <text x="180" y="145" fontSize="10" fill="#92400E" textAnchor="middle">Heavy</text>
                <text x="390" y="195" fontSize="10" fill="#92400E" textAnchor="middle">Moderate</text>
                <text x="70" y="220" fontSize="10" fill="#92400E" textAnchor="middle">Light</text>
              </svg>
            </div>
          )}
        </div>
        
        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow">
          <h4 className="font-medium text-sm mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-xs">Truck</span>
            </div>
          </div>
        </div>
        
        {/* Selected Stop Details */}
        {selectedStop && (
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{selectedStop.id}</h4>
              <button
                onClick={() => setSelectedStop(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <p><strong>Address:</strong> {selectedStop.address}</p>
              <p><strong>Area:</strong> {selectedStop.area}</p>
              <p><strong>Status:</strong> {selectedStop.status}</p>
              <p><strong>ETA:</strong> {selectedStop.estimatedArrival}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Route Controls */}
      {route && (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="font-medium">{route.driverName}</span>
              <span className="text-gray-500">• {route.truckId}</span>
            </div>
            <div className="flex items-center space-x-2">
              {route.status === 'active' && (
                <button
                  onClick={onPauseRoute}
                  className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  title="Pause route"
                >
                  <Pause className="h-4 w-4" />
                </button>
              )}
              {route.status === 'paused' && (
                <button
                  onClick={onStartRoute}
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                  title="Start route"
                >
                  <Play className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={onCompleteRoute}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                title="Complete route"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Progress: {route.progress || 0}% • Distance: {route.totalDistance} • Fuel: {route.fuelUsed}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
