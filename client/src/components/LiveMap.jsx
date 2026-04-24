import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Truck, MapPin, AlertCircle, CheckCircle2, Clock, Navigation2, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSSE from '../hooks/useSSE';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Priority-colored pickup icons
const makePickupIcon = (urgency) => {
  const colors = { High: 'red', Medium: 'orange', Low: 'green' };
  const color = colors[urgency] || 'blue';
  return new L.DivIcon({
    className: '',
    html: `
      <div style="position:relative;width:32px;height:32px">
        <div style="position:absolute;inset:0;border-radius:50%;background:${color === 'red' ? '#ef4444' : color === 'orange' ? '#f97316' : '#10b981'};opacity:0.25;animation:pulse 2s infinite"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:${color === 'red' ? '#ef4444' : color === 'orange' ? '#f97316' : '#10b981'};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>
      </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Animated truck icon for collector
const truckIconHtml = `
  <div style="position:relative;width:40px;height:40px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3))">
    <div style="position:absolute;inset:0;border-radius:12px;background:linear-gradient(135deg,#10b981,#059669);border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:20px">🚛</div>
    <div style="position:absolute;inset:-4px;border-radius:16px;border:2px solid rgba(16,185,129,0.4);animation:pulse 2s infinite"></div>
  </div>`;

const collectorIcon = new L.DivIcon({
  className: '',
  html: truckIconHtml,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Auto-recenter map
const RecenterAutomatically = ({ center }) => {
  const map = useMap();
  const prevCenter = useRef(null);
  useEffect(() => {
    if (center && JSON.stringify(center) !== JSON.stringify(prevCenter.current)) {
      map.flyTo(center, 13, { duration: 1.2 });
      prevCenter.current = center;
    }
  }, [center, map]);
  return null;
};

const urgencyRing = { High: '#ef444480', Medium: '#f9731680', Low: '#10b98180' };
const urgencyColor = { High: '#ef4444', Medium: '#f97316', Low: '#10b981' };

const LiveMap = ({ reports = [], collectorLocation, zone, className = '' }) => {
  const defaultCenter = [18.5204, 73.8567];
  const [liveCollectorLoc, setLiveCollectorLoc] = useState(collectorLocation || null);
  const [recentUpdate, setRecentUpdate] = useState(null);

  // Subscribe to SSE for live collector location updates
  const { connected } = useSSE('/api/sse', {
    zone,
    onEvent: useCallback((type, data) => {
      if (type === 'collector_location_update') {
        setLiveCollectorLoc([data.lat, data.lng]);
      }
      if (type === 'report_status_update') {
        setRecentUpdate(data);
        setTimeout(() => setRecentUpdate(null), 3000);
      }
    }, []),
  });

  // Sync external collectorLocation prop
  useEffect(() => {
    if (collectorLocation) setLiveCollectorLoc(collectorLocation);
  }, [collectorLocation]);

  const pendingReports = reports.filter(r => r.status === 'Pending');
  const inProgressReports = reports.filter(r => r.status === 'In Progress');

  const getReportCoords = (report) => {
    if (report.lat && report.lng) return [report.lat, report.lng];
    // Scatter around default center for demo (in real app geocoding would be used)
    const seed = report._id ? report._id.charCodeAt(0) + report._id.charCodeAt(1) : Math.random() * 100;
    return [
      defaultCenter[0] + ((seed % 13) - 6) * 0.008,
      defaultCenter[1] + ((seed % 11) - 5) * 0.009,
    ];
  };

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden ${className}`}>
      {/* SSE Connection Indicator */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-lg">
        {connected ? (
          <><Wifi size={11} className="text-emerald-500 animate-pulse" /><span className="text-[10px] font-black text-emerald-600">LIVE</span></>
        ) : (
          <><WifiOff size={11} className="text-red-400" /><span className="text-[10px] font-black text-red-400">OFFLINE</span></>
        )}
      </div>

      {/* Live update toast */}
      <AnimatePresence>
        {recentUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-12 right-3 z-[1000] px-3 py-2 rounded-xl bg-emerald-500 text-white text-[11px] font-black shadow-lg"
          >
            ⚡ {recentUpdate.area} → {recentUpdate.status}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] flex flex-col gap-1 px-3 py-2 rounded-xl backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-lg">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"/><span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">High Priority ({reports.filter(r=>r.urgency==='High').length})</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500"/><span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Medium Priority ({reports.filter(r=>r.urgency==='Medium').length})</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"/><span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Low Priority ({reports.filter(r=>r.urgency==='Low').length})</span></div>
        {liveCollectorLoc && <div className="flex items-center gap-1.5"><span className="text-[12px]">🚛</span><span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Your Location</span></div>}
      </div>

      <MapContainer
        center={liveCollectorLoc || defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {liveCollectorLoc && (
          <>
            <RecenterAutomatically center={liveCollectorLoc} />
            <Marker position={liveCollectorLoc} icon={collectorIcon}>
              <Popup>
                <div className="font-bold text-emerald-700 text-sm">🚛 Collector Location</div>
                <div className="text-xs text-slate-500 mt-1">Live tracking active</div>
              </Popup>
            </Marker>
            {/* Coverage radius */}
            <Circle
              center={liveCollectorLoc}
              radius={800}
              pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.05, weight: 1.5, dashArray: '6 4' }}
            />
          </>
        )}

        {reports.map((report) => {
          const coords = getReportCoords(report);
          const icon = makePickupIcon(report.urgency);
          return (
            <Marker key={report._id} position={coords} icon={icon}>
              <Popup>
                <div className="flex flex-col gap-1 min-w-[180px] p-1">
                  <h3 className="font-black text-slate-800 capitalize text-sm leading-tight">{report.area || report.location}</h3>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{report.garbageType} Waste</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      report.urgency === 'High' ? 'bg-red-100 text-red-700' :
                      report.urgency === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>{report.urgency}</span>
                  </div>
                  <div className={`text-[10px] font-bold mt-1 px-2 py-1 rounded-lg ${
                    report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
                    report.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>{report.status}</div>
                  {report.landmark && <div className="text-[10px] text-slate-500">📍 {report.landmark}</div>}
                  <div className="text-[10px] text-slate-400 mt-1">{new Date(report.createdAt).toLocaleDateString()}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Pulse animation CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LiveMap;
