'use client'

import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import RouteModal from '../components/RouteModal'
import { MapPin, Search, Navigation, Map, Phone } from 'lucide-react'

export default function KuryePage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [showRouteModal, setShowRouteModal] = useState(false)
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)
  const [fromLoading, setFromLoading] = useState(false)
  const [toLoading, setToLoading] = useState(false)

  // Sayfa dışına tıklandığında önerileri kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowFromSuggestions(false)
        setShowToSuggestions(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])


  // OpenStreetMap Nominatim API ile adres arama
  const searchAddress = async (query, setSuggestions, setLoading) => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=tr&limit=5&addressdetails=1`
      )
      const data = await response.json()
      
      const suggestions = data.map(item => ({
        id: item.place_id,
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon
      }))
      
      setSuggestions(suggestions)
    } catch (error) {
      console.error('Adres arama hatası:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  // Nereden arama
  useEffect(() => {
    const timeout = setTimeout(() => {
      searchAddress(from, setFromSuggestions, setFromLoading)
    }, 500)
    return () => clearTimeout(timeout)
  }, [from])

  // Nereye arama
  useEffect(() => {
    const timeout = setTimeout(() => {
      searchAddress(to, setToSuggestions, setToLoading)
    }, 500)
    return () => clearTimeout(timeout)
  }, [to])

  // Mevcut konumu al
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          )
          const data = await response.json()
          
          if (data.display_name) {
            setFrom(data.display_name)
            setShowFromSuggestions(false)
          }
        } catch (error) {
          console.error('Konum çözümleme hatası:', error)
          alert('Konumunuz alınamadı. Lütfen manuel olarak girin.')
        }
      }, (error) => {
        console.error('Konum alma hatası:', error)
        alert('Konumunuza erişim izni verilmedi. Lütfen manuel olarak girin.')
      })
    } else {
      alert('Tarayıcınız konum servisini desteklemiyor.')
    }
  }

  const handleSend = () => {
    if (!from || !to) {
      alert('Lütfen nereden ve nereye bilgilerini doldurun.')
      return
    }
    
    const phone = '905320516678'
    const message = `Merhaba, ${from} konumundan ${to} konumuna gitmek istiyorum.`
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }



  return (
    <>
      <Head>
        <title>Kurye Bul | Hızlı ve Güvenilir Kurye Hizmeti</title>
        <meta name="description" content="Anında kurye bul, adresine en yakın kuryeyi çağır. Hızlı, güvenilir ve kolay kurye hizmetiyle gönderini hemen ulaştır." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Kurye Bul | Hızlı ve Güvenilir Kurye Hizmeti" />
        <meta property="og:description" content="Anında kurye bul, adresine en yakın kuryeyi çağır. Hızlı, güvenilir ve kolay kurye hizmetiyle gönderini hemen ulaştır." />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
        <section className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="Kurye Bul Logo" className="h-auto w-full" />
          </div>
          {/* Form Alanı */}
          <form
            className="space-y-6"
            onSubmit={e => {
              e.preventDefault()
              handleSend()
            }}
            aria-label="Kurye Bulma Formu"
          >
            {/* Nereden */}
            <div className="relative">
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="from-input">
                Nereden <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="from-input"
                  type="text"
                  placeholder="Başlangıç adresinizi yazın..."
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value)
                    setShowFromSuggestions(true)
                  }}
                  onFocus={() => setShowFromSuggestions(true)}
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#74B751] focus:border-transparent transition"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#74B751] text-white p-2 rounded-md hover:bg-[#5a9a3f] transition-colors duration-200"
                  title="Mevcut konumunuzu kullanın"
                >
                  <Navigation className="w-4 h-4" />
                </button>
                {fromLoading && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#74B751]"></div>
                  </div>
                )}
              </div>
              
              {/* Öneriler */}
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <ul className="absolute z-20 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {fromSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="px-4 py-3 hover:bg-[#74B751]/10 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setFrom(suggestion.display_name)
                        setShowFromSuggestions(false)
                      }}
                    >
                      <div className="text-sm text-gray-800">{suggestion.display_name}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Nereye */}
            <div className="relative">
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="to-input">
                Nereye <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="to-input"
                  type="text"
                  placeholder="Varış adresinizi yazın..."
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value)
                    setShowToSuggestions(true)
                  }}
                  onFocus={() => setShowToSuggestions(true)}
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#74B751] focus:border-transparent transition"
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                {toLoading && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#74B751]"></div>
                  </div>
                )}
              </div>
              
              {/* Öneriler */}
              {showToSuggestions && toSuggestions.length > 0 && (
                <ul className="absolute z-20 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {toSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="px-4 py-3 hover:bg-[#74B751]/10 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setTo(suggestion.display_name)
                        setShowToSuggestions(false)
                      }}
                    >
                      <div className="text-sm text-gray-800">{suggestion.display_name}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Rota Göster Butonu */}
            <button
              type="button"
              onClick={() => setShowRouteModal(true)}
              disabled={!from || !to}
              className="w-full bg-[#ED6B1D] text-white py-3 rounded-lg hover:bg-[#d45a1a] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-bold text-lg flex items-center justify-center gap-2"
              aria-disabled={!from || !to}
            >
              <Map className="w-5 h-5" />
              Rotayı Görüntüle
            </button>

            {/* Gönder Butonu */}
            <button
              type="submit"
              disabled={!from || !to}
              className="w-full bg-[#74B751] text-white py-3 rounded-lg hover:bg-[#5a9a3f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-bold text-lg flex items-center justify-center gap-2"
              aria-disabled={!from || !to}
            >
              <Phone className="w-5 h-5" />
              Kurye Bul
            </button>
          </form>

          {/* SEO için ek açıklama */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
                İstanbul ve çevresinde güvenilir, uygun fiyatlı ve anında kurye bulmak için doğru adrestesiniz.
            </p>
          </div>
        </section>
      </main>

      {/* Rota Modal */}
      <RouteModal
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        fromLocation={{ address: from }}
        toLocation={{ address: to }}
      />
    </>
  )
}
