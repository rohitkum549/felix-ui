"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, Heart, ShoppingCart, Eye, Download, ChevronLeft, ChevronRight, List, Bell } from "lucide-react"
import { useMarketplace } from "@/hooks/use-marketplace"
import { Service } from "@/lib/marketplace-service"
import { useProfile } from "@/hooks/use-profile"
import { useToast } from "@/hooks/use-toast"
import { handleBuyNow } from "./buyNowHandler"
import { getErrorMessage, logError } from "@/lib/error-utils"
import { ProductCard } from "./ProductCard"
import { AddServiceDialog } from "./AddServiceDialog"
import { RequestServiceDialog } from "./RequestServiceDialog"
import { RequestedServiceCard, RequestedService } from "./RequestedServiceCard"
import { felixApi } from "@/lib/api-service"

interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: number
  rating: number
  reviews: number
  downloads: number
  category: string
  image: string
  tags: string[]
  sender_id: string
}

// Map API service to UI MarketplaceItem
const mapServiceToMarketplaceItem = (service: Service): MarketplaceItem => {
  return {
    id: service.id,
    title: service.memo || 'Service',
    description: service.description || 'Description not provided',
    price: service.amount || 0,
    rating: service.rating || 0,
    reviews: Math.floor(Math.random() * 100) + 50, // Mock data
    downloads: Math.floor(Math.random() * 5000) + 1000, // Mock data
    category: service.currency || 'BD',
    image: '/placeholder.svg?height=200&width=300',
    tags: [service.status || 'pending', service.currency || 'BD'],
    sender_id: service.sender_id
  }
}

const mockItems: MarketplaceItem[] = [
  {
    id: "1",
    title: "Premium Dashboard Template",
    description: "Modern and responsive dashboard with advanced analytics",
    price: 49.99,
    rating: 4.8,
    reviews: 124,
    downloads: 2847,
    category: "Templates",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["React", "TypeScript", "Tailwind"],
    sender_id: "mock-sender-id-1",
  },
  {
    id: "2",
    title: "UI Component Library",
    description: "Complete set of reusable UI components",
    price: 29.99,
    rating: 4.9,
    reviews: 89,
    downloads: 1523,
    category: "Components",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Components", "Design System"],
    sender_id: "mock-sender-id-2",
  },
  {
    id: "3",
    title: "Analytics Dashboard",
    description: "Advanced analytics dashboard with real-time data",
    price: 79.99,
    rating: 4.7,
    reviews: 156,
    downloads: 3241,
    category: "Analytics",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Analytics", "Charts", "Data"],
    sender_id: "mock-sender-id-3",
  },
]

export function Marketplace() {
  // Use our marketplace hook for fetching services
  const { 
    services, 
    loading, 
    error, 
    pagination, 
    loadServices,
    loadNextPage, 
    loadPreviousPage,
    setItemsPerPage
  } = useMarketplace(6);
  
  const { profile } = useProfile();
  const { toast } = useToast();
  
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState<"all" | "requested">("all")
  const [requestedServices, setRequestedServices] = useState<RequestedService[]>([])
  const [requestedLoading, setRequestedLoading] = useState(false)
  const [requestedError, setRequestedError] = useState<string | null>(null)
  
  // Derived categories from actual data
  const [categories, setCategories] = useState<string[]>(["All"])
  
  // Function to fetch requested services
  const fetchRequestedServices = async () => {
    setRequestedLoading(true);
    setRequestedError(null);
    
    try {
      const data = await felixApi.getServiceRequests();
      
      // The API returns an array of requested services directly
      const services = Array.isArray(data) ? data : [data];
      setRequestedServices(services);
      
    } catch (error) {
      const errorMsg = getErrorMessage(error, 'Failed to fetch requested services');
      setRequestedError(errorMsg);
      logError('Fetch Requested Services', error);
    } finally {
      setRequestedLoading(false);
    }
  };
  
  // Map API services to UI items whenever services change
  useEffect(() => {
    if (services && services.length > 0) {
      const mappedItems = services.map(mapServiceToMarketplaceItem);
      setItems(mappedItems);
      
      // Extract unique categories from services
      const uniqueCurrencies = [...new Set(services.map(s => s.currency))];
      setCategories(["All", ...uniqueCurrencies]);
    }
  }, [services]);
  
  // Fetch requested services when tab changes to requested
  useEffect(() => {
    if (activeTab === "requested") {
      fetchRequestedServices();
    }
  }, [activeTab]);
  
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  const filteredRequestedServices = requestedServices.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })
  
  const currentLoading = activeTab === "all" ? loading : requestedLoading;
  const currentError = activeTab === "all" ? error : requestedError;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-white/60">Discover premium templates, components, and tools</p>
        </div>

        <div className="flex items-center space-x-4">
          <AddServiceDialog onServiceAdded={() => loadServices()} />
          <RequestServiceDialog onServiceRequested={() => {
            loadServices();
            if (activeTab === "requested") {
              fetchRequestedServices();
            }
          }} />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30"
            />
          </div>
          <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <Button
          onClick={() => setActiveTab("all")}
          variant={activeTab === "all" ? "default" : "ghost"}
          className={
            activeTab === "all"
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }
        >
          <List className="h-4 w-4 mr-2" />
          All Services
        </Button>
        <Button
          onClick={() => setActiveTab("requested")}
          variant={activeTab === "requested" ? "default" : "ghost"}
          className={
            activeTab === "requested"
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }
        >
          <Bell className="h-4 w-4 mr-2" />
          Requested Services
        </Button>
      </div>

      {/* Categories - Only show for all services */}
      {activeTab === "all" && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-xl whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      )}


      {/* All Products */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{activeTab === "all" ? "All Products" : "Requested Services"}</h2>
          
          {/* Pagination Controls - Only show for all services */}
          {activeTab === "all" && (
            <div className="flex items-center space-x-2">
              <div className="text-white/60 text-sm">
                {pagination.currentPage * pagination.itemsPerPage + 1}-
                {Math.min((pagination.currentPage + 1) * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems}
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={loadPreviousPage} 
                  disabled={!pagination.hasPreviousPage || currentLoading}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={loadNextPage} 
                  disabled={!pagination.hasNextPage || currentLoading}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {currentLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-white">Loading {activeTab === "all" ? "services" : "requested services"}...</div>
          </div>
        )}
        
        {currentError && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-red-400">Error loading {activeTab === "all" ? "services" : "requested services"}: {currentError}</div>
          </div>
        )}
        
        {!currentLoading && !currentError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeTab === "all" ? (
              filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <ProductCard key={item.id} product={item} secretKey={profile?.secret_key} userPublicKey={profile?.public_key} onPurchaseSuccess={loadServices} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-white/60">
                  No services found matching your criteria.
                </div>
              )
            ) : (
              filteredRequestedServices.length > 0 ? (
                filteredRequestedServices.map((service) => (
                  <RequestedServiceCard key={service.id} service={service} userPublicKey={profile?.public_key} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-white/60">
                  No requested services found matching your criteria.
                </div>
              )
            )}
          </div>
        )}
        
        {/* Items per page selector - Only show for all services */}
        {activeTab === "all" && (
          <div className="flex justify-end mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-white/60 text-sm">Items per page:</span>
              <select 
                className="bg-white/10 border border-white/20 text-white rounded-lg p-1 [&>option]:text-black dark:[&>option]:text-white [&>option]:bg-white dark:[&>option]:bg-gray-800"
                value={pagination.itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                disabled={currentLoading}
              >
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
