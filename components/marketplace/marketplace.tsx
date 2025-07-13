"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, Heart, ShoppingCart, Eye, Download, TrendingUp } from "lucide-react"

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
  featured: boolean
  tags: string[]
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
    featured: true,
    tags: ["React", "TypeScript", "Tailwind"],
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
    featured: false,
    tags: ["Components", "Design System"],
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
    featured: true,
    tags: ["Analytics", "Charts", "Data"],
  },
]

export function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>(mockItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(false)

  const categories = ["All", "Templates", "Components", "Analytics", "Tools"]

  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  const loadMarketplaceItems = async () => {
    setLoading(true)
    try {
      // const data = await apiService.getMarketplaceItems()
      // setItems(data)
    } catch (error) {
      console.error("Failed to load marketplace items:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-white/60">Discover premium templates, components, and tools</p>
        </div>

        <div className="flex items-center space-x-4">
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

      {/* Categories */}
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

      {/* Featured Items */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-yellow-400" />
          Featured Products
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredItems
            .filter((item) => item.featured)
            .map((item) => (
              <GlassCard key={item.id} variant="ultra" className="group overflow-hidden">
                <div className="relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500/90 text-black font-semibold">Featured</Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-white/60 text-sm">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">${item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{item.rating}</span>
                      <span className="text-white/60 text-sm">({item.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-white/60 text-sm">
                      <Download className="h-4 w-4" />
                      <span>{item.downloads.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/10 text-white/80 hover:bg-white/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </GlassCard>
            ))}
        </div>
      </div>

      {/* All Products */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <GlassCard key={item.id} variant="premium" className="group overflow-hidden">
              <div className="relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex space-x-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8"
                  >
                    <Heart className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-white/60 text-sm mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-white text-sm">{item.rating}</span>
                  </div>
                  <p className="text-white font-bold">${item.price}</p>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg"
                >
                  <ShoppingCart className="h-3 w-3 mr-2" />
                  Buy Now
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}
