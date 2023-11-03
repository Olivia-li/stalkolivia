"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, GeoJSON } from "react-leaflet"
import L, { LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"

// Custom marker icon
const minimalMarkerIcon = new L.Icon({
  iconUrl: "/face.png",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
})

const LocationMap = () => {
  const [location, setLocation] = useState<LatLngExpression | undefined>(undefined)
  const [marathonRoute, setMarathonRoute] = useState(null)

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://stalkolivia.ngrok.io/location")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setLocation([data.latitude, data.longitude])
      } catch (error) {
        console.error("Failed to fetch location:", error)
      }
    }

    const fetchMarathonRoute = async () => {
      try {
        const response = await fetch("/tracks.geojson") 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMarathonRoute(data)
      } catch (error) {
        console.error("Failed to fetch marathon route:", error)
      }
    }

    fetchLocation()
    fetchMarathonRoute()
    const interval = setInterval(fetchLocation, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {location && marathonRoute && (
        <MapContainer
          center={location}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
          />
          <Marker position={location} icon={minimalMarkerIcon} />
          <GeoJSON
            data={marathonRoute}
            style={() => ({
              color: "#ff7800",
              weight: 5,
              opacity: 0.65,
            })}
          />
        </MapContainer>
      )}
    </div>
  )
}

export default LocationMap
