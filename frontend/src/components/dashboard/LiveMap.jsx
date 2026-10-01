import { useEffect } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Layers, LocateFixed, Minus, Plus } from 'lucide-react'
import { blockedRoads, hospitals, incidents, rescueTeams } from '../../data/mockData'
import StatusBadge from '../common/StatusBadge'

const markerIcon = (color, type = 'incident') => L.divIcon({ className: '', html: `<span class="map-marker marker-${color} marker-${type}"></span>`, iconSize: [24, 24], iconAnchor: [12, 12] })

function MapControls() {
  const map = useMap()
  return <div className="map-controls"><button onClick={() => map.zoomIn()} aria-label="Zoom in"><Plus size={16} /></button><button onClick={() => map.zoomOut()} aria-label="Zoom out"><Minus size={16} /></button><button onClick={() => map.locate()} aria-label="Locate"><LocateFixed size={15} /></button></div>
}

export default function LiveMap({ compact = false }) {
  useEffect(() => {}, [])
  return <div className={`map-card ${compact ? 'map-compact' : ''}`}>
    <div className="map-heading"><div><h3>Live incident map</h3><span className="muted">Real-time operations overview</span></div><button className="map-layer-button"><Layers size={15} /> Layers</button></div>
    <div className="map-wrap"><MapContainer center={[28.6139, 77.209]} zoom={12} scrollWheelZoom={false} zoomControl={false} attributionControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {incidents.map((incident) => <Marker key={incident.id} position={incident.coordinates} icon={markerIcon(incident.severity, 'incident')}><Popup><strong>{incident.id}</strong><br />{incident.type}<br /><StatusBadge tone={incident.severity}>{incident.severity}</StatusBadge></Popup></Marker>)}
      {hospitals.map((hospital) => <Marker key={hospital.id} position={hospital.coordinates} icon={markerIcon('green', 'hospital')}><Popup><strong>{hospital.name}</strong><br />{hospital.beds} available beds</Popup></Marker>)}
      {rescueTeams.map((team) => <Marker key={team.id} position={[28.60 + (team.id.charCodeAt(5) % 5) / 100, 77.20 + (team.id.charCodeAt(6) % 6) / 100]} icon={markerIcon('blue', 'team')}><Popup><strong>{team.name}</strong><br />{team.status}</Popup></Marker>)}
      {blockedRoads.map((road) => <Polyline key={road.name} positions={road.coordinates} pathOptions={{ color: '#dc4b4b', weight: 5, dashArray: '8 7' }} />)}
      <MapControls />
    </MapContainer><div className="map-legend"><span><i className="legend-dot legend-red" /> Active incident</span><span><i className="legend-dot legend-blue" /> Response team</span><span><i className="legend-dot legend-green" /> Hospital</span><span><i className="legend-line" /> Blocked road</span></div></div>
  </div>
}
