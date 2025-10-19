import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { CartProvider } from "@/hooks/use-cart"
import ParallaxBackground from "@/components/parallax-background"
import Script from "next/script"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Rense Off - Premium Cleaning Products",
  description:
    "Premium cleaning products for your home - handwash, floor cleaner, laundry detergent, and dishwash solutions",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body className="font-sans antialiased">
        <ParallaxBackground />
        <div className="relative z-10">
          <CartProvider>{children}</CartProvider>
        </div>
      </body>
    </html>
  )
}
