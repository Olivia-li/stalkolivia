"use client"
import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

import { LatLngExpression, Icon, IconOptions, DivIcon } from "leaflet"

const LocationMap = () => {
  const [location, setLocation] = useState<LatLngExpression | undefined>(undefined)
  const [marathonRoute, setMarathonRoute] = useState(null)
  const [lastUpdated, setLastUpdated] = useState<string | undefined>(undefined)
  const markerRef = useRef<any>(null)
  const [icon, setIcon] = useState<Icon<IconOptions> | DivIcon | undefined>(undefined)

  useEffect(() => {
    const L = require("leaflet")

    const newIcon = new L.Icon({
      iconUrl: "/face.png",
      iconSize: [25, 25],
      iconAnchor: [12, 25],
      popupAnchor: [0, -25],
    })
    setIcon(newIcon)
  }, [])

  useEffect(() => {
    if (!markerRef.current) return
    markerRef.current?.openPopup()
  }, [markerRef.current])

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://stalkolivia.ngrok.io/location")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setLocation([data.latitude, data.longitude])

        // Parse the timestamp from the server and the current time
        const serverTime = new Date(data.timestamp)
        const currentTime = new Date()
        // Calculate the difference in milliseconds
        const timeDifference = currentTime.getTime() - serverTime.getTime()
        // Convert the difference to a human-readable format
        const seconds = Math.floor((timeDifference / 1000) % 60)
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
        // Store the result in the state
        setLastUpdated(`${days}d ${hours}h ${minutes}m ${seconds}s ago`)
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
      {typeof window !== "undefined" && location && marathonRoute && (
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
          <Marker ref={markerRef} position={location} icon={icon}>
            {lastUpdated && <Popup>Last updated: {lastUpdated}</Popup>}
          </Marker>
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
