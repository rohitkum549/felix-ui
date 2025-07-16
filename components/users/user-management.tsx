"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash2, UserCheck, UserX, Mail, Key, Building, Wallet, Shield, Coins } from "lucide-react"
import { AddUserDialog } from "./AddUserDialog"
import { felixApi } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  username: string
  email: string
  role: string
  public_key: string
  secret_key: string
  entity_belongs_to: string
  entity_manager: string
  is_wallet_funded: boolean
  is_trustline_added: boolean
  is_bd_received: boolean
  created_at: string | null
  updated_at?: string | null
  status?: "active" | "inactive" | "pending"
}

const mockUsers: User[] = [
  {
    id: "ad7114e4-d1b0-42be-a6ff-c1002e75443d",
    username: "Rohit Jha",
    email: "rohit@cateina.com",
    role: "Admin",
    public_key: "GAYSV4BKRFCSNQRXH3ZZZP4UIITYV3GHKBIUF4ZJB7CQCAD4NUGMX4RK",
    secret_key: "SCLCQUPTQA35H2G5GV2DOIWVLSMWQ3LQYAGUCU7OOENLCOIRQQTL3WRX",
    entity_belongs_to: "Managers",
    entity_manager: "Rohit Jha",
    is_wallet_funded: true,
    is_trustline_added: true,
    is_bd_received: true,
    created_at: "2024-01-15",
    updated_at: "2024-07-15",
    status: "active",
  },
  {
    id: "bd7114e4-d1b0-42be-a6ff-c1002e75443e",
    username: "Sarah Johnson",
    email: "sarah@cateina.com",
    role: "User",
    public_key: "GAYSY4BKRFCSNQRXH3ZZZP4UIITYV3GHKBIUF4ZJB7CQCAD4NUGMX4RK",
    secret_key: "SCLCQUPTQA35H2G5GV2DOIWVLSMWQ3LQYAGUCU7OOENLCOIRQQTL3WRY",
    entity_belongs_to: "Developers",
    entity_manager: "Sarah Johnson",
    is_wallet_funded: true,
    is_trustline_added: false,
    is_bd_received: false,
    created_at: "2024-02-20",
    updated_at: "2024-07-10",
    status: "active",
  },
  {
    id: "cd7114e4-d1b0-42be-a6ff-c1002e75443f",
    username: "Mike Wilson",
    email: "mike@cateina.com",
    role: "Moderator",
    public_key: "GAYSZ4BKRFCSNQRXH3ZZZP4UIITYV3GHKBIUF4ZJB7CQCAD4NUGMX4RK",
    secret_key: "SCLCQUPTQA35H2G5GV2DOIWVLSMWQ3LQYAGUCU7OOENLCOIRQQTL3WRZ",
    entity_belongs_to: "Support",
    entity_manager: "Mike Wilson",
    is_wallet_funded: false,
    is_trustline_added: false,
    is_bd_received: false,
    created_at: "2024-01-10",
    updated_at: "2024-07-05",
    status: "inactive",
  },
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("All")
  const [selectedGroup, setSelectedGroup] = useState("DevOps")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const roles = ["All", "Admin", "Moderator", "User"]
  const groups = ["DevOps", "QA", "HR"]

  useEffect(() => {
    loadUsers()
  }, [selectedGroup])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await felixApi.getUsersByGroup(selectedGroup)
      setUsers(data.users || data || [])
    } catch (error: any) {
      console.error("Failed to load users:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConnectWallet = async (user: User) => {
    try {
      // Add your wallet connection logic here
      console.log('Connecting wallet for user:', user.id)
      toast({
        title: "Wallet Connection",
        description: `Connecting wallet for ${user.username}...`,
      })
      // You would call your wallet connection API here
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const handleAddTrustline = async (user: User) => {
    try {
      // Add your trustline addition logic here
      console.log('Adding trustline for user:', user.id)
      toast({
        title: "Trustline Addition",
        description: `Adding trustline for ${user.username}...`,
      })
      // You would call your trustline addition API here
    } catch (error: any) {
      console.error('Error adding trustline:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to add trustline",
        variant: "destructive",
      })
    }
  }

  const handleSendAsset = async (user: User) => {
    try {
      // Add your asset sending logic here
      console.log('Sending asset to user:', user.id)
      toast({
        title: "Asset Transfer",
        description: `Sending asset to ${user.username}...`,
      })
      // You would call your asset sending API here
    } catch (error: any) {
      console.error('Error sending asset:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to send asset",
        variant: "destructive",
      })
    }
  }

  const getNextAction = (user: User) => {
    if (!user.is_wallet_funded) {
      return {
        label: "Connect Wallet",
        icon: Wallet,
        action: () => handleConnectWallet(user),
        color: "text-blue-400"
      }
    }
    if (!user.is_trustline_added) {
      return {
        label: "Add Trustline",
        icon: Shield,
        action: () => handleAddTrustline(user),
        color: "text-green-400"
      }
    }
    if (!user.is_bd_received) {
      return {
        label: "Send Asset",
        icon: Coins,
        action: () => handleSendAsset(user),
        color: "text-yellow-400"
      }
    }
    return null
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.entity_belongs_to.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "All" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400"
      case "inactive":
        return "bg-red-500/20 text-red-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-500/20 text-purple-400"
      case "Moderator":
        return "bg-blue-500/20 text-blue-400"
      case "User":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-white/60">Manage and monitor user accounts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Users", value: "2,847", change: "+12%", color: "from-blue-400 to-cyan-600" },
          { title: "Active Users", value: "2,234", change: "+8%", color: "from-green-400 to-emerald-600" },
          { title: "New This Month", value: "156", change: "+24%", color: "from-purple-400 to-pink-600" },
          { title: "Pending Approval", value: "23", change: "-5%", color: "from-orange-400 to-red-600" },
        ].map((stat, index) => (
          <GlassCard key={index} variant="premium" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
              <span className="text-white/60 text-sm ml-2">vs last month</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Action Buttons */}
      <GlassCard variant="premium" className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <AddUserDialog onUserAdded={(userData) => {
              // Handle the new user data here
              console.log('New user added:', userData);
              // You can add the user to your state or refetch users
              // Optionally refresh the users list
              loadUsers();
            }} />
            <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl">
              <Search className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl">
              <Edit className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
          <div className="text-white/60 text-sm">
            Manage user accounts and permissions
          </div>
        </div>
      </GlassCard>

      {/* Filters */}
      <GlassCard variant="premium" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:bg-white/15 focus:border-white/30"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Group Filter */}
            <div className="flex space-x-2">
              <span className="text-white/60 text-sm font-medium self-center mr-2">Group:</span>
              {groups.map((group) => (
                <Button
                  key={group}
                  variant={selectedGroup === group ? "default" : "ghost"}
                  onClick={() => setSelectedGroup(group)}
                  disabled={loading}
                  className={`rounded-xl ${
                    selectedGroup === group
                      ? "bg-gradient-to-r from-green-500 to-teal-500 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {group}
                </Button>
              ))}
            </div>
            
            {/* Role Filter */}
            <div className="flex space-x-2">
              <span className="text-white/60 text-sm font-medium self-center mr-2">Role:</span>
              {roles.map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "ghost"}
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-xl ${
                    selectedRole === role
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard variant="ultra" className="overflow-hidden">
        <div className="overflow-x-auto">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-2 text-white/60">Loading users...</span>
            </div>
          )}
          
          {!loading && (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-white/80 font-semibold">User</TableHead>
                <TableHead className="text-white/80 font-semibold">Contact</TableHead>
                <TableHead className="text-white/80 font-semibold">Role</TableHead>
                <TableHead className="text-white/80 font-semibold">Entity</TableHead>
                <TableHead className="text-white/80 font-semibold">Public Key</TableHead>
                <TableHead className="text-white/80 font-semibold">Status & Setup</TableHead>
                <TableHead className="text-white/80 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-white/60 text-sm">ID: {user.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-white/60" />
                        <span className="text-white text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-3 w-3 text-white/60" />
                        <span className="text-white/60 text-sm">{user.entity_manager}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRoleColor(user.role)} border-0`}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Building className="h-3 w-3 text-white/60" />
                        <span className="text-white text-sm">{user.entity_belongs_to}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Key className="h-3 w-3 text-white/60" />
                      <span className="text-white/60 text-sm font-mono">{user.public_key.substring(0, 20)}...</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={`${getStatusColor(user.status || "active")} border-0 capitalize`}>{user.status || "active"}</Badge>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${user.is_wallet_funded ? 'bg-green-400' : 'bg-gray-500'}`} title="Wallet Funded" />
                        <div className={`w-2 h-2 rounded-full ${user.is_trustline_added ? 'bg-green-400' : 'bg-gray-500'}`} title="Trustline Added" />
                        <div className={`w-2 h-2 rounded-full ${user.is_bd_received ? 'bg-green-400' : 'bg-gray-500'}`} title="Asset Received" />
                        <span className="text-white/40 text-xs ml-1">
                          {[user.is_wallet_funded, user.is_trustline_added, user.is_bd_received].filter(Boolean).length}/3
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        {/* Dynamic wallet action */}
                        {(() => {
                          const nextAction = getNextAction(user)
                          if (nextAction) {
                            const IconComponent = nextAction.icon
                            return (
                              <DropdownMenuItem 
                                className={`${nextAction.color} hover:bg-white/10 cursor-pointer`}
                                onClick={nextAction.action}
                              >
                                <IconComponent className="h-4 w-4 mr-2" />
                                {nextAction.label}
                              </DropdownMenuItem>
                            )
                          }
                          return (
                            <DropdownMenuItem className="text-green-400 hover:bg-white/10">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Wallet Setup Complete
                            </DropdownMenuItem>
                          )
                        })()}
                        
                        {/* Separator */}
                        <div className="border-t border-white/10 my-1" />
                        
                        {/* Standard actions */}
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          {user.status === "active" ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          )}
          
          {!loading && filteredUsers.length === 0 && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <UserX className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No users found for the selected group.</p>
                <p className="text-white/40 text-sm mt-2">Try selecting a different group or adding a new user.</p>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
