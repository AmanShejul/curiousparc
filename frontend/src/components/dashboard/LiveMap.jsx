import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Layers, LocateFixed, Minus, Plus } from 'lucide-react'
import { useEmergencyStore } from '../../store/emergencyStore'

const markerIcon = (color, type = 'incident') => L.divIcon({ className: '', html: `<span class="map-marker marker-${color} marker-${type}"></span>`, iconSize: [24, 24], iconAnchor: [12, 12] })

function MapControls() {
  const map = useMap()
  return <div className="map-controls"><button onClick={() => map.zoomIn()} aria-label="Zoom in"><Plus size={16} /></button><button onClick={() => map.zoomOut()} aria-label="Zoom out"><Minus size={16} /></button><button onClick={() => map.locate()} aria-label="Locate"><LocateFixed size={15} /></button></div>
}

export default function LiveMap({ compact = false, state: providedState }) {
  const storedState = useEmergencyStore((store) => store.emergencyState)
  const state = providedState || storedState
  const incidents = state?.incidents || []
  const hospitals = state?.hospitals || []
  const teams = state?.teams || []
  const roads = state?.roads || []
  return <div className={`map-card ${compact ? 'map-compact' : ''}`}>
    <div className="map-heading"><div><h3>Live incident map</h3><span className="muted">Real-time operations overview</span></div><button className="map-layer-button"><Layers size={15} /> Layers</button></div>
    <div className="map-wrap"><MapContainer center={[18.59, 73.85]} zoom={12} scrollWheelZoom={false} zoomControl={false} attributionControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {incidents.filter((incident) => incident.coords).map((incident) => <Marker key={incident.id} position={[incident.coords.lat, incident.coords.lng]} icon={markerIcon(incident.severity === 'HIGH' || incident.severity === 'CRITICAL' ? 'red' : 'orange', 'incident')}><Popup><strong>{incident.locationName}</strong><br />{incident.type} · {incident.affectedPeople} affected</Popup></Marker>)}
      {hospitals.filter((hospital) => hospital.lat != null && hospital.lng != null).map((hospital) => <Marker key={hospital.id} position={[hospital.lat, hospital.lng]} icon={markerIcon('green', 'hospital')}><Popup><strong>{hospital.name}</strong><br />{hospital.capacityUsedPct ?? hospital.capacityPct}% capacity used</Popup></Marker>)}
      {teams.filter((team) => team.lat != null && team.lng != null).map((team) => <Marker key={team.id} position={[team.lat, team.lng]} icon={markerIcon('blue', 'team')}><Popup><strong>{team.name}</strong><br />{team.status}</Popup></Marker>)}
      {roads.filter((road) => road.coords?.length > 1).map((road) => <Polyline key={road.id} positions={road.coords.map((point) => [point.lat, point.lng])} pathOptions={{ color: road.status === 'BLOCKED' ? '#dc4b4b' : '#48a16c', weight: 5, dashArray: road.status === 'BLOCKED' ? '8 7' : undefined }} />)}
      <MapControls />
    </MapContainer><div className="map-legend"><span><i className="legend-dot legend-red" /> Active incident</span><span><i className="legend-dot legend-blue" /> Response team</span><span><i className="legend-dot legend-green" /> Hospital</span><span><i className="legend-line" /> Blocked road</span><span><i className="legend-line legend-open-line" /> Open road</span></div></div>
  </div>
}
