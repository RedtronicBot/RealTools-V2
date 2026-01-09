import type { LatLngTuple } from "leaflet"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet/dist/leaflet.css"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import { useRealtData } from "../../hooks/useRealtData"
import { useTokenStore } from "../../store/TokenStore"
import type { RealtToken } from "../../types"
import "./leaflet-icon"
import LocationPanel from "./LocationPanel"
import { getPropertyIcon } from "./mapIcons"

const position: LatLngTuple = [18.808779, -52.150144]
const LeafletMap = () => {
  const { token } = useTokenStore()
  const { gnosisToken, realtToken, isLoading } = useRealtData(token)
  const [selectedLocation, setSelectedLocation] = useState<RealtToken | null>(null)
  const addressToDate = new Map(
    gnosisToken?.location?.filter((g) => g?.contractAddress && g?.date).map((g) => [g.contractAddress.toLowerCase(), new Date(g.date)]),
  )
  if (isLoading)
    return (
      <div className="bg-primary flex min-h-dvh flex-wrap items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <LoaderCircle size={64} className="animate-spin text-white" />
          <p className="text-xl text-white">Chargement</p>
        </div>
      </div>
    )
  return (
    <div className="h-screen w-full">
      <MapContainer center={position} zoom={3} className="h-full w-full">
        <TileLayer attribution="OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerClusterGroup>
          {realtToken
            ?.filter((location) => {
              const address = location.ethereumContract?.toLowerCase() || location.gnosisContract?.toLowerCase()

              return !!address && location.coordinate.lat !== "0.000000" && location.coordinate.lng !== "0.000000" && addressToDate.has(address)
            })
            .map((location, index) => (
              <Marker
                key={index}
                position={[Number(location.coordinate.lat), Number(location.coordinate.lng)]}
                icon={getPropertyIcon(location.propertyTypeName)}
                eventHandlers={{ click: () => setSelectedLocation(location) }}
              ></Marker>
            ))}
        </MarkerClusterGroup>
      </MapContainer>
      {selectedLocation && (
        <LocationPanel location={selectedLocation} gnosisToken={gnosisToken ?? { location: [], rmm: [] }} onClose={() => setSelectedLocation(null)} />
      )}
    </div>
  )
}

export default LeafletMap
