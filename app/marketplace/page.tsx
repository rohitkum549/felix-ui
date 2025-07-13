"use client"

import { Marketplace } from "@/components/marketplace/marketplace"
import { useEffect } from "react"

export default function MarketplacePage() {
  // Set page title on mount
  useEffect(() => {
    document.title = "Felix Platform - Service Marketplace"
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <Marketplace />
    </div>
  )
}
