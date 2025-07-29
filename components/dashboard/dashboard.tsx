"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight, MoreVertical, Blocks, Zap, Shield, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useProfile } from "@/hooks/use-profile"
import { useDashboard } from "@/hooks/use-dashboard"
import { getErrorMessage, logError } from "@/lib/error-utils"
import { TransactionCard } from "./transaction-card"
import { ServiceCard } from "./service-card"
import { ActivityGraph } from "./activity-graph"
import { BlockchainActivity } from "./blockchain-activity"
import { ServiceDistributionChart } from "./service-distribution-chart"
import { UserActivityHeatmap } from "./user-activity-heatmap"
import { formatDistanceToNow } from 'date-fns'

interface StatCard {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: any
  color: string
  description: string
}

const felixStats: StatCard[] = [
  {
    title: "BlueDollar Balance",
    value: "B$ 124,563.89",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "from-blue-400 to-cyan-600",
    description: "Total platform currency",
  },
  {
    title: "Active Services",
    value: "47",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "from-purple-400 to-pink-600",
    description: "CoE & Project offerings",
  },
  {
    title: "Platform Members",
    value: "1,249",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "from-green-400 to-emerald-600",
    description: "Registered users",
  },
  {
    title: "Blockchain TPS",
    value: "2,847",
    change: "+0.8%",
    trend: "up",
    icon: Zap,
    color: "from-orange-400 to-red-600",
    description: "Transactions per second",
  },
]

export function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { profile, fetchProfile, loading: profileLoading } = useProfile();
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, refetch } = useDashboard();
  const [stats, setStats] = useState<StatCard[]>(felixStats);
  const [loading, setLoading] = useState(false);

useEffect(() => {
    // Create a flag to track if we've already loaded the profile
    const profileLoadedKey = 'felix_profile_loaded';
    const isProfileLoaded = sessionStorage.getItem(profileLoadedKey);
    
    const loadUserProfile = async () => {
      if (isAuthenticated && user?.email && !isProfileLoaded) {
        try {
          await fetchProfile(user.email);
          console.log("Profile data stored in session storage.");
          // Set flag to prevent additional loads
          sessionStorage.setItem(profileLoadedKey, 'true');
        } catch (error) {
          logError("Dashboard Profile Fetch", error);
        }
      }
    };

    loadUserProfile();
    
    // Clear the flag when component unmounts
    return () => {
      // We only want to clear this on actual logout, not component unmount
      // So we'll handle this in the logout function instead
    };
  }, [isAuthenticated, user]);
  
// Update stats with profile and dashboard data
  useEffect(() => {
    if (profile || dashboardData) {
      const updatedStats = [...felixStats];
      
      // Update stats with dashboard API data
      if (dashboardData) {
        // Calculate total BD balance from wallet balances
        const totalBdBalance = dashboardData.wallet_balances.data.reduce(
          (sum, wallet) => sum + parseFloat(wallet.bd_balance || '0'), 0
        );
        
        updatedStats[0] = {
          ...updatedStats[0],
          value: `B$ ${totalBdBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
        };
        
        updatedStats[1] = {
          ...updatedStats[1],
          value: dashboardData.services.count.toString(),
        };
        
        updatedStats[2] = {
          ...updatedStats[2],
          value: dashboardData.users.count.toString(),
        };
      }
      
      // Update with profile data if available
      if (profile) {
        updatedStats[2] = {
          ...updatedStats[2],
          description: `${profile.role} • ${profile.entity_admin_name}`,
        };
        
        if (profile.public_key) {
          updatedStats[0] = {
            ...updatedStats[0],
            description: `Wallet: ${profile.public_key.substring(0, 8)}...`,
          };
        }
      }
      
      setStats(updatedStats);
    }
  }, [profile, dashboardData]);

  // Show loading state while fetching dashboard data
  if (dashboardLoading && !dashboardData) {
    return (
      <div className="space-y-10">
        <div className="relative">
          <GlassCard variant="blockchain" className="p-8 overflow-hidden" glow={true}>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-10 w-64 bg-white/10 rounded-lg animate-pulse mb-2"></div>
                  <div className="h-6 w-96 bg-white/10 rounded-lg animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-32 bg-white/10 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <GlassCard key={i} variant="premium" className="p-8">
              <div className="space-y-4">
                <div className="h-16 w-16 bg-white/10 rounded-3xl animate-pulse"></div>
                <div className="h-6 w-24 bg-white/10 rounded animate-pulse"></div>
                <div className="h-8 w-32 bg-white/10 rounded animate-pulse"></div>
              </div>
            </GlassCard>
          ))}
        </div>
        
        <div className="text-center py-8">
          <p className="text-white/60">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Show error state if there's an error
  if (dashboardError) {
    return (
      <div className="space-y-10">
        <GlassCard variant="blockchain" className="p-8" glow={true}>
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h3>
            <p className="text-white/60 mb-4">{getErrorMessage(dashboardError, "Failed to load dashboard data")}</p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="relative">
        <GlassCard variant="blockchain" className="p-8 overflow-hidden" glow={true}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
<div>
<h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
                  {profile ? `Welcome, ${profile.username}` : 'Welcome to Felix Platform'}
                </h2>
                <p className="text-white/70 text-lg">
                  Your blockchain-powered Centre of Excellence & Project management hub
                </p>
                <p className="text-white/50 text-sm mt-2">
                  Stellar Network • Version 1.0 
                  {profileLoading && <span className="ml-2 animate-pulse">Loading profile...</span>}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white/60 text-sm">Network Status</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <GlassCard
              key={index}
              variant="premium"
              className="p-8 group transform-gpu will-change-transform hover:scale-[1.02] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-white/50 text-xs">{stat.description}</p>
                  </div>
                </div>
                <div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                    stat.trend === "up"
                      ? "bg-green-500/20 text-green-400 border border-green-400/30"
                      : "bg-red-500/20 text-red-400 border border-red-400/30"
                  }`}
                >
                  {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  <span className="text-sm font-bold">{stat.change}</span>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BlueDollar Analytics */}
        <GlassCard variant="blockchain" className="lg:col-span-2 p-8" glow={true}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">BlueDollar Analytics</h3>
              <p className="text-white/60">Platform currency flow and distribution</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110"
            >
              <MoreVertical className="h-6 w-6" />
            </Button>
          </div>

          {/* Dynamic Chart Visualization */}
          <div className="mb-6">
            {dashboardData ? (
              <ActivityGraph transactions={dashboardData.transactions.data} />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p className="text-white/60">Loading chart data...</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <p className="text-white/60 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold text-white">
                {dashboardData?.summary.total_transactions || '0'}
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <p className="text-white/60 text-sm">Total Wallets</p>
              <p className="text-2xl font-bold text-white">
                {dashboardData?.summary.total_tracked_balances || '0'}
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <p className="text-white/60 text-sm">Last Updated</p>
              <p className="text-2xl font-bold text-green-400">
                {dashboardData?.summary.last_updated 
                  ? formatDistanceToNow(new Date(dashboardData.summary.last_updated), { addSuffix: true })
                  : 'Never'
                }
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Service Performance */}
        <GlassCard variant="premium" className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Top Services</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all duration-300"
            >
              View All
            </Button>
          </div>

          <div className="space-y-6">
            {[
              { name: "AI Development CoE", revenue: "B$ 24,500", growth: "+18%", category: "Centre of Excellence" },
              { name: "Blockchain Integration", revenue: "B$ 18,900", growth: "+12%", category: "Project Service" },
              { name: "Data Analytics Suite", revenue: "B$ 12,300", growth: "+8%", category: "CoE Service" },
              { name: "Security Audit Service", revenue: "B$ 8,600", growth: "+15%", category: "Project Service" },
            ].map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${
                      index === 0
                        ? "from-yellow-400 to-orange-500"
                        : index === 1
                          ? "from-green-400 to-teal-500"
                          : index === 2
                            ? "from-purple-400 to-pink-500"
                            : "from-blue-400 to-indigo-500"
                    } rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{service.name}</p>
                    <p className="text-white/60 text-xs">{service.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-sm">{service.revenue}</p>
                  <p className="text-green-400 text-xs">{service.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Distribution Analytics */}
        <GlassCard variant="premium" className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Service Distribution</h3>
              <p className="text-white/60">Visual breakdown of services by category</p>
            </div>
          </div>

          {dashboardData && dashboardData.services.data.length > 0 ? (
            <ServiceDistributionChart services={dashboardData.services.data} />
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                <p className="text-white/60">Loading chart data...</p>
              </div>
            </div>
          )}
        </GlassCard>

        {/* User Activity Heatmap */}
        <GlassCard variant="blockchain" className="p-8" glow={true}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Activity Heatmap</h3>
              <p className="text-white/60">12-week transaction activity pattern</p>
            </div>
          </div>

          {dashboardData && dashboardData.transactions.data.length > 0 ? (
            <UserActivityHeatmap transactions={dashboardData.transactions.data} />
          ) : (
            <div className="h-40 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-white/60">Loading heatmap...</p>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

{/* Recent Transactions */}
      {dashboardData ? (
        <GlassCard variant="blockchain" className="p-8" glow={true}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Recent Transactions</h3>
            <Button
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all duration-300"
              onClick={() => refetch()}
              disabled={dashboardLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${dashboardLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {dashboardData.transactions.data.slice(0, 5).map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
            {dashboardData.transactions.data.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/60">No transactions found</p>
              </div>
            )}
          </div>
        </GlassCard>
      ) : null}

      {/* Recent Services */}
      {dashboardData ? (
        <GlassCard variant="premium" className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Recent Services</h3>
            <Button
              variant="ghost"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-all duration-300"
              onClick={() => refetch()}
              disabled={dashboardLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${dashboardLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.services.data.slice(0, 4).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
            {dashboardData.services.data.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <p className="text-white/60">No services found</p>
              </div>
            )}
          </div>
        </GlassCard>
      ) : null}

      {/* Recent Blockchain Activity */}
      {dashboardData ? (
        <GlassCard variant="blockchain" className="p-8" glow={true}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Recent Blockchain Activity</h3>
            <Button
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all duration-300"
              onClick={() => refetch()}
              disabled={dashboardLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${dashboardLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <BlockchainActivity 
            transactions={dashboardData.transactions.data} 
            services={dashboardData.services.data} 
          />
        </GlassCard>
      ) : null}

    </div>
  )
}
