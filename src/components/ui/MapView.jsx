import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { useEffect } from 'react'

const goldPin = divIcon({
  className: '',
  html: `<div style="
    width:26px;height:26px;border-radius:50% 50% 50% 0;
    background:linear-gradient(135deg,#E2BF66,#A06E1D);
    transform:rotate(-45deg);
    box-shadow:0 2px 6px rgba(20,23,23,0.35);
    border:2px solid #FBF7EC;
  "></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  popupAnchor: [0, -26],
})

function FitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (!points || points.length === 0) return
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 7)
    } else {
      map.fitBounds(points.map((p) => [p.lat, p.lng]), { padding: [40, 40] })
    }
  }, [points, map])
  return null
}

export default function MapView({ points = [], height = 320, zoom = 6, className = '' }) {
  const valid = points.filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number')
  const center = valid.length > 0 ? [valid[0].lat, valid[0].lng] : [-2.5, 34.8]

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-ink-100 ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {valid.map((p, idx) => (
          <Marker key={`${p.name}-${idx}`} position={[p.lat, p.lng]} icon={goldPin}>
            <Popup>
              <div className="text-sm font-semibold text-ink-900">{p.name}</div>
              {p.description && <div className="mt-0.5 text-xs text-ink-500">{p.description}</div>}
            </Popup>
          </Marker>
        ))}
        <FitBounds points={valid} />
      </MapContainer>
    </div>
  )
}
