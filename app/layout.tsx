"use client"

import React, { useState } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Sidebar } from "@/components/sidebar"
import { NavHeader } from "@/components/nav-header"
import { usePathname } from "next/navigation"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isAuthPage = pathname.startsWith("/auth")

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {!isAuthPage && (
          <>
            {/* Sidebar */}
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Header */}
            <div className="flex-1 md:ml-64">
              <NavHeader isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </>
        )}

        {/* Page Content */}
        <main className={!isAuthPage ? "flex-1 md:ml-64" : "min-h-screen"}>{children}</main>

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  )
}