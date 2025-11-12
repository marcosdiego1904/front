import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Lamp to My Feet - Bible Memorization & Scripture Learning App",
  description:
    "Transform your faith with personalized Bible verse memorization. Learn Scripture through interactive lessons tailored to real-life situations. Strengthen your spiritual journey one verse at a time.",
  keywords: [
    "Bible memorization",
    "Scripture learning",
    "Bible verses",
    "faith building",
    "Christian app",
    "Bible study",
    "spiritual growth",
    "memorize Scripture",
    "Bible learning",
    "faith strengthening",
  ],
  authors: [{ name: "Lamp to My Feet" }],
  creator: "Lamp to My Feet",
  publisher: "Lamp to My Feet",
  metadataBase: new URL("https://lamptomyfeet.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lamptomyfeet.app",
    title: "Lamp to My Feet - Bible Memorization & Scripture Learning",
    description:
      "Transform your faith with personalized Bible verse memorization. Learn Scripture through interactive lessons tailored to real-life situations.",
    siteName: "Lamp to My Feet",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lamp to My Feet - Bible Memorization App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lamp to My Feet - Bible Memorization & Scripture Learning",
    description:
      "Transform your faith with personalized Bible verse memorization. Learn Scripture through interactive lessons.",
    images: ["/og-image.jpg"],
    creator: "@lamptomyfeet",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lamp to My Feet",
    description: "Bible memorization and Scripture learning app for spiritual growth",
    url: "https://lamptomyfeet.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://lamptomyfeet.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lamp to My Feet",
    url: "https://lamptomyfeet.app",
    logo: "https://lamptomyfeet.app/logo.png",
    description: "Helping believers strengthen their faith through Bible memorization",
    sameAs: [
      "https://twitter.com/lamptomyfeet",
      "https://facebook.com/lamptomyfeet",
      "https://instagram.com/lamptomyfeet",
    ],
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-inter: ${inter.style.fontFamily};
}
        `}</style>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
