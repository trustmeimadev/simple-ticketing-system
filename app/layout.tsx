"use client"

import React, { useState } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Sidebar } from "@/components/sidebar"
import { NavHeader } from "@/components/nav-header"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>

        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {/* Header */}
          <NavHeader isOpen={isOpen} setIsOpen={setIsOpen} />

          {/* Page Content */}
          <main className="">{children}</main>
        </div>

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  )
}