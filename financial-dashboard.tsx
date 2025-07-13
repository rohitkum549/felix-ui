"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  MoreVertical,
  Smile,
  Grid3X3,
  DollarSign,
  Video,
  TrendingUp,
  Users,
  FileText,
  Settings,
  HelpCircle,
  BarChart3,
} from "lucide-react"

export default function Component() {
  const billsData = [
    { gradient: "from-purple-500 to-purple-700", icon: Smile },
    { gradient: "from-yellow-400 to-green-500", icon: Grid3X3 },
    { gradient: "from-orange-400 to-yellow-600", icon: DollarSign },
    { gradient: "from-teal-400 to-blue-500", icon: Video },
  ]

  const invoiceCards = [
    { gradient: "from-purple-500 to-purple-700", icon: Smile },
    { gradient: "from-green-400 to-green-600", icon: DollarSign },
  ]

  const chartData = [
    { month: "Mar", value: 60 },
    { month: "Apr", value: 80 },
    { month: "May", value: 45 },
    { month: "Jun", value: 90 },
    { month: "Jul", value: 75 },
    { month: "Aug", value: 65 },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
          <span className="text-black font-bold text-sm">LC</span>
        </div>
        <div className="flex flex-col space-y-3 mt-8">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <BarChart3 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <FileText className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  Financial <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Financial</DropdownMenuItem>
                <DropdownMenuItem>Analytics</DropdownMenuItem>
                <DropdownMenuItem>Reports</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Users className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Users className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Bills Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Bills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {billsData.map((bill, index) => {
              const IconComponent = bill.icon
              return (
                <Card key={index} className={`bg-gradient-to-br ${bill.gradient} border-0 relative overflow-hidden`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <IconComponent className="h-6 w-6 text-white/80" />
                      <div className="bg-white/20 rounded-full px-2 py-1 text-xs font-medium">+42%</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white/80 text-sm">Ready to assign</p>
                      <p className="text-2xl font-bold text-white">200-42</p>
                      <p className="text-white/60 text-xs">Bill in this week 22!</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Invoice Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Invoice</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Chart Card */}
            <Card className="bg-gradient-to-br from-green-400 to-green-600 border-0 relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-end mb-4">
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center">
                  {/* Semi-circular progress */}
                  <div className="relative w-32 h-16 mb-6">
                    <svg className="w-32 h-16" viewBox="0 0 128 64">
                      <path
                        d="M 16 64 A 48 48 0 0 1 112 64"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 16 64 A 48 48 0 0 1 80 32"
                        fill="none"
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">45%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-4 w-4 text-white/80 mr-2" />
                      <span className="text-white/80 text-sm">Amount Owed</span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">$933,879.45</p>
                    <p className="text-white/60 text-sm">$126,763.89</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Cards */}
            <div className="space-y-4">
              {invoiceCards.map((card, index) => {
                const IconComponent = card.icon
                return (
                  <Card key={index} className={`bg-gradient-to-br ${card.gradient} border-0 relative overflow-hidden`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <IconComponent className="h-6 w-6 text-white/80" />
                        <div className="bg-white/20 rounded-full px-2 py-1 text-xs font-medium">+42%</div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white/80 text-sm">Ready to assign</p>
                        <p className="text-2xl font-bold text-white">200-42</p>
                        <p className="text-white/60 text-xs">Bill in this week 22!</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Bar Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="relative">
                  {/* Tooltip */}
                  <div className="absolute top-0 right-8 bg-white text-gray-900 px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                    August 2021
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between h-48 mt-8">
                    {chartData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div
                          className="bg-gradient-to-t from-yellow-400 to-green-400 rounded-t-sm w-8"
                          style={{ height: `${data.value}%` }}
                        ></div>
                        <span className="text-gray-400 text-xs">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
