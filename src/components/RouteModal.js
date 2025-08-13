'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Navigation, X } from 'lucide-react'

// Leaflet bileşenlerini dinamik olarak import ediyoruz
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

export default function RouteModal({ isOpen, onClose, fromLocation, toLocation }) {
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && fromLocation?.address && toLocation?.address) {
      // Adresleri koordinatlara çevir
      fetchRoute()
    }
  }, [isOpen, fromLocation, toLocation])

  // Leaflet marker ikonları için düzenleme
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L) {
      delete window.L.Icon.Default.prototype._getIconUrl
      window.L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/dist/images/marker-shadow.png',
      })
    }
  }, [])

  const fetchRoute = async () => {
    setLoading(true)
    try {
      // Önce adresleri koordinatlara çevir
      const fromResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fromLocation.address)}&countrycodes=tr&limit=1`
      )
      const fromData = await fromResponse.json()
      
      const toResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(toLocation.address)}&countrycodes=tr&limit=1`
      )
      const toData = await toResponse.json()
      
      if (fromData[0] && toData[0]) {
        const fromCoords = { lat: parseFloat(fromData[0].lat), lng: parseFloat(fromData[0].lon) }
        const toCoords = { lat: parseFloat(toData[0].lat), lng: parseFloat(toData[0].lon) }
        
        // Rota hesapla
        const routeResponse = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${fromCoords.lng},${fromCoords.lat};${toCoords.lng},${toCoords.lat}?overview=full&geometries=geojson`
        )
        const routeData = await routeResponse.json()
        
        if (routeData.routes && routeData.routes[0]) {
          setRoute({
            ...routeData.routes[0],
            fromCoords,
            toCoords
          })
        }
      }
    } catch (error) {
      console.error('Rota alınamadı:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const center = route?.fromCoords && route?.toCoords 
    ? [(route.fromCoords.lat + route.toCoords.lat) / 2, (route.fromCoords.lng + route.toCoords.lng) / 2]
    : [41.0082, 28.9784] // İstanbul merkezi

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm md:max-w-2xl lg:max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Rota Görüntüle</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48 md:h-64">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="bg-[#74B751]/10 p-3 md:p-4 rounded-lg border border-[#74B751]/20">
                  <h3 className="font-semibold text-[#74B751] mb-2 text-sm md:text-base flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Nereden
                  </h3>
                  <p className="text-xs md:text-sm text-[#74B751] break-words">{fromLocation?.address || 'Adres girilmedi'}</p>
                </div>
                <div className="bg-[#ED6B1D]/10 p-3 md:p-4 rounded-lg border border-[#ED6B1D]/20">
                  <h3 className="font-semibold text-[#ED6B1D] mb-2 text-sm md:text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Nereye
                  </h3>
                  <p className="text-xs md:text-sm text-[#ED6B1D] break-words">{toLocation?.address || 'Adres girilmedi'}</p>
                </div>
              </div>
              
              {route && (
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                    <div>
                      <div className="text-lg md:text-2xl font-bold text-[#74B751]">
                        {Math.round(route.distance / 1000 * 10) / 10}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">km</div>
                    </div>
                    <div>
                      <div className="text-lg md:text-2xl font-bold text-[#ED6B1D]">
                        {Math.round(route.duration / 60)}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">dakika</div>
                    </div>
                    <div>
                      <div className="text-lg md:text-2xl font-bold text-[#74B751]">
                        {Math.round(route.distance / 1000 * 6)}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">₺</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="h-64 md:h-96 w-full border border-gray-300 rounded-lg overflow-hidden">
                <MapContainer
                  center={center}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                  className="touch-manipulation"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {route?.fromCoords && (
                    <Marker 
                      position={[route.fromCoords.lat, route.fromCoords.lng]}
                      icon={window.L?.divIcon({
                        className: 'custom-div-icon',
                        html: '<div class="bg-green-500 w-6 h-6 rounded-full border-2 border-white shadow-lg"></div>',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                      })}
                    />
                  )}
                  
                  {route?.toCoords && (
                    <Marker 
                      position={[route.toCoords.lat, route.toCoords.lng]}
                      icon={window.L?.divIcon({
                        className: 'custom-div-icon',
                        html: '<div class="bg-blue-500 w-6 h-6 rounded-full border-2 border-white shadow-lg"></div>',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                      })}
                    />
                  )}
                  
                  {route && route.geometry && (
                    <Polyline
                      positions={route.geometry.coordinates.map(coord => [coord[1], coord[0]])}
                      color="#3B82F6"
                      weight={4}
                      opacity={0.8}
                    />
                  )}
                </MapContainer>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end p-4 md:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-[#ED6B1D] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-[#d45a1a] transition-colors text-sm md:text-base font-medium"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
} 