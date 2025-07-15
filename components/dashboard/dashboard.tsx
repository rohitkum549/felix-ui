"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight, MoreVertical, Blocks, Zap, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useProfile } from "@/hooks/use-profile"

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
          console.error("Failed to fetch profile data:", error);
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
  
// Update stats with profile data when profile is loaded
  useEffect(() => {
    if (profile) {
      const updatedStats = [...stats];
      
      // Update User information
      updatedStats[2] = {
        ...updatedStats[2],
        value: profile.entity_belongs || updatedStats[2].value,
        description: `${profile.role} • ${profile.entity_admin_name}`,
      };
      
      // Update wallet information if public key is available
      if (profile.public_key) {
        updatedStats[0] = {
          ...updatedStats[0],
          description: `Wallet: ${profile.public_key.substring(0, 8)}...`,
        };
      }
      
      setStats(updatedStats);
    }
  }, [profile]);

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

          {/* Enhanced Chart Visualization */}
          <div className="h-80 flex items-end justify-between space-x-3 mb-6">
            {[65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 92].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-2 group">
                <div
                  className="w-full bg-gradient-to-t from-blue-500/60 via-purple-500/60 to-cyan-500/60 rounded-t-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:from-blue-400/80 hover:via-purple-400/80 hover:to-cyan-400/80 relative overflow-hidden group-hover:scale-105"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="text-white/50 text-xs font-medium">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <p className="text-white/60 text-sm">Total Volume</p>
              <p className="text-2xl font-bold text-white">B$ 2.4M</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <p className="text-white/60 text-sm">Avg. Transaction</p>
              <p className="text-2xl font-bold text-white">B$ 847</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <p className="text-white/60 text-sm">Growth Rate</p>
              <p className="text-2xl font-bold text-green-400">+24.5%</p>
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

      {/* Recent Blockchain Activity */}
      <GlassCard variant="blockchain" className="p-8" glow={true}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white">Recent Blockchain Activity</h3>
          <Button
            variant="ghost"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all duration-300"
          >
            View Blockchain Explorer
          </Button>
        </div>

        <div className="space-y-4">
          {[
            {
              action: "Multi-sig wallet created",
              entity: "AI Development CoE",
              time: "2 minutes ago",
              type: "security",
              hash: "0x1a2b3c...",
            },
            {
              action: "BlueDollar transfer completed",
              entity: "B$ 5,000 → Project Alpha",
              time: "5 minutes ago",
              type: "transfer",
              hash: "0x4d5e6f...",
            },
            {
              action: "Service purchase executed",
              entity: "Blockchain Integration",
              time: "12 minutes ago",
              type: "purchase",
              hash: "0x7g8h9i...",
            },
            {
              action: "Asset portfolio updated",
              entity: "Data Analytics Suite",
              time: "1 hour ago",
              type: "asset",
              hash: "0xj1k2l3...",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center space-x-6 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                  activity.type === "security"
                    ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-400/30"
                    : activity.type === "transfer"
                      ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 border border-green-400/30"
                      : activity.type === "purchase"
                        ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-400/30"
                        : "bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-400/30"
                }`}
              >
                {activity.type === "security" ? (
                  <Shield className="h-6 w-6" />
                ) : activity.type === "transfer" ? (
                  <ArrowUpRight className="h-6 w-6" />
                ) : activity.type === "purchase" ? (
                  <ShoppingCart className="h-6 w-6" />
                ) : (
                  <Blocks className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-lg">{activity.action}</p>
                <p className="text-white/70 text-sm mt-1">{activity.entity}</p>
                <p className="text-white/50 text-xs mt-1 font-mono">Hash: {activity.hash}</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-sm">{activity.time}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-xs font-semibold">Confirmed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
