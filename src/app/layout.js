import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Kurye Bu - Anında Kurye Hizmeti',
  description: 'Anında kurye bul, adresine en yakın kuryeyi çağır. Hızlı, güvenilir ve kolay kurye hizmetiyle gönderini hemen ulaştır.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content="kurye, anında kurye, hızlı kurye, güvenilir kurye, kurye hizmeti, gönderi, teslimat" />
        <meta name="author" content="Kurye Bu" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kuryebu.com" />
        <meta property="og:image" content="https://kuryebu.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="https://kuryebu.com/og-image.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'DeliveryService',
              'name': 'Kurye Bul',
              'image': 'https://kuryebu.com/logo.svg',
              'url': 'https://kuryebu.com',
              'telephone': '+905518930451',
              'priceRange': '$$',
              'address': {
                '@type': 'PostalAddress',
                'addressLocality': 'İstanbul',
                'addressCountry': 'TR'
              },
              'geo': {
                '@type': 'GeoCircle',
                'geoMidpoint': {
                  '@type': 'GeoCoordinates',
                  'latitude': 41.0082,
                  'longitude': 28.9784
                },
                'geoRadius': '50000'
              },
              'areaServed': {
                '@type': 'City',
                'name': 'İstanbul'
              },
              'sameAs': [
                'https://www.facebook.com/kuryebu',
                'https://www.instagram.com/kuryebu',
                'https://twitter.com/kuryebu'
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
