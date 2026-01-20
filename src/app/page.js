'use client'

import HomeTemplate from '../components/HomeTemplate'
import Head from 'next/head'

export default function KuryePage() {
  return (
    <>
      <Head>
        <title>Kurye Bul | Hızlı ve Güvenilir Kurye Hizmeti</title>
        <meta name="description" content="Anında kurye bul, adresine en yakın kuryeyi çağır. Hızlı, güvenilir ve kolay kurye hizmetiyle gönderini hemen ulaştır." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Kurye Bul | Hızlı ve Güvenilir Kurye Hizmeti" />
        <meta property="og:description" content="Anında kurye bul, adresine en yakın kuryeyi çağır. Hızlı, güvenilir ve kolay kurye hizmetiyle gönderini hemen ulaştır." />
      </Head>
      <HomeTemplate />
    </>
  )
}
