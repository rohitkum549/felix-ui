"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash2, UserCheck, UserX, Mail, Key, Building, Wallet, Shield, Coins, Loader2, Users, Factory, DollarSign, Settings } from "lucide-react"
import { AddUserDialog } from "./AddUserDialog"
import { SendAssetDialog } from "./SendAssetDialog"
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

interface Asset {
  id: string
  assetCode: string
  assetIssuer: string
  description: string
  status: 'active' | 'inactive'
  totalSupply?: string
  issuedAmount?: string
  createdAt: string
  updatedAt: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("All")
  const [selectedGroup, setSelectedGroup] = useState("DevOps")
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [sendAssetDialog, setSendAssetDialog] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  })
  
  // Asset Management State
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetsLoading, setAssetsLoading] = useState(false)
  const [createAssetDialog, setCreateAssetDialog] = useState(false)
  const [issueAssetDialog, setIssueAssetDialog] = useState<{ isOpen: boolean; asset: Asset | null }>({
    isOpen: false,
    asset: null
  })
  
  const { toast } = useToast()

  const roles = ["All", "Admin", "Moderator", "User"]
  const groups = ["DevOps", "QA", "HR", "Managers"]

  useEffect(() => {
    loadUsers()
  }, [selectedGroup])
  
  useEffect(() => {
    loadAssets()
  }, [])

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
        duration: 5000, // 5 seconds
      })
    } finally {
      setLoading(false)
    }
  }

  const loadAssets = async () => {
    setAssetsLoading(true)
    try {
      const data = await felixApi.getAllAssets()
      setAssets(data.assets || data || [])
    } catch (error: any) {
      console.error("Failed to load assets:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load assets. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setAssetsLoading(false)
    }
  }

  const handleConnectWallet = async (user: User) => {
    if (actionLoading === user.id) return // Prevent multiple simultaneous requests
    
    setActionLoading(user.id)
    
    try {
      console.log('Funding wallet for user:', user.id, 'with public key:', user.public_key)
      
      // Show loading toast
      toast({
        title: "Wallet Funding",
        description: `Funding wallet for ${user.username}...`,
        duration: 5000, // 5 seconds
      })
      
      // Call the API to fund the wallet
      const response = await felixApi.fundWallet(user.public_key)
      
      // Show success toast
      toast({
        title: "Success!",
        description: `Wallet funded successfully for ${user.username}`,
        variant: "default",
        duration: 5000, // 5 seconds
      })
      
      // Update the user's wallet status locally
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id 
            ? { ...u, is_wallet_funded: true }
            : u
        )
      )
      
      console.log('Wallet funded successfully:', response)
      
    } catch (error: any) {
      console.error('Error funding wallet:', error)
      
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to fund wallet. Please try again.",
        variant: "destructive",
        duration: 5000, // 5 seconds
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddTrustline = async (user: User) => {
    if (actionLoading === user.id) return // Prevent multiple simultaneous requests
    
    setActionLoading(user.id)
    
    try {
      console.log('Adding trustline for user:', user.id, 'with secret key:', user.secret_key.substring(0, 10) + '...')
      
      // Show loading toast
      toast({
        title: "Trustline Addition",
        description: `Adding trustline for ${user.username}...`,
        duration: 5000, // 5 seconds
      })
      
      // Call the API to add trustline
      const response = await felixApi.addTrustline(user.secret_key)
      
      // Show success toast
      toast({
        title: "Success!",
        description: `Trustline added successfully for ${user.username}`,
        variant: "default",
        duration: 5000, // 5 seconds
      })
      
      // Update the user's trustline status locally
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id 
            ? { ...u, is_trustline_added: true }
            : u
        )
      )
      
      console.log('Trustline added successfully:', response)
      
    } catch (error: any) {
      console.error('Error adding trustline:', error)
      
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to add trustline. Please try again.",
        variant: "destructive",
        duration: 5000, // 5 seconds
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleSendAsset = (user: User) => {
    console.log('Opening send asset dialog for user:', user.id)
    setSendAssetDialog({ isOpen: true, user })
  }

  const handleSendAssetSuccess = () => {
    if (!sendAssetDialog.user) return
    
    const user = sendAssetDialog.user
    
    // Update the user's asset status locally
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === user.id 
          ? { ...u, is_bd_received: true }
          : u
      )
    )
    
    console.log('Asset sent successfully, updated user status')
  }

  const handleCloseSendAssetDialog = () => {
    setSendAssetDialog({ isOpen: false, user: null })
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
          <h1 className="text-3xl font-bold text-white mb-2">Management</h1>
          <p className="text-white/60">Comprehensive user, entity, and asset management platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Users", value: "2,847", change: "+12%", color: "from-blue-400 to-cyan-600", icon: Users },
          { title: "Active Entities", value: "156", change: "+8%", color: "from-green-400 to-emerald-600", icon: Factory },
          { title: "Total Assets", value: "45.2K", change: "+24%", color: "from-purple-400 to-pink-600", icon: DollarSign },
          { title: "Pending Actions", value: "23", change: "-5%", color: "from-orange-400 to-red-600", icon: Settings },
        ].map((stat, index) => (
          <GlassCard key={index} variant="premium" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
              <span className="text-white/60 text-sm ml-2">vs last month</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Three-Section Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
          <TabsTrigger 
            value="users" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-white/70 rounded-lg transition-all duration-200"
          >
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger 
            value="entities" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-white/70 rounded-lg transition-all duration-200"
          >
            <Factory className="h-4 w-4 mr-2" />
            Entity Management
          </TabsTrigger>
          <TabsTrigger 
            value="assets" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-white/70 rounded-lg transition-all duration-200"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Asset Management
          </TabsTrigger>
        </TabsList>

        {/* Tab Content: User Creation */}
        <TabsContent value="users" className="space-y-6">
          <GlassCard variant="premium" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Create New Users</h3>
                <p className="text-white/60">Add new users to the system with proper permissions and wallet setup</p>
              </div>
              <AddUserDialog onUserAdded={(userData) => {
                console.log('New user added:', userData);
                loadUsers();
              }} />
            </div>
            
            {/* Search and Filters for Users */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
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
                      <TableHead className="text-white/80 font-semibold">Department</TableHead>
                      <TableHead className="text-white/80 font-semibold">Public Key</TableHead>
                      <TableHead className="text-white/80 font-semibold">Status</TableHead>
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
                                const isLoading = actionLoading === user.id
                                
                                if (nextAction) {
                                  const IconComponent = nextAction.icon
                                  return (
                                    <DropdownMenuItem 
                                      className={`${nextAction.color} hover:bg-white/10 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      onClick={isLoading ? undefined : nextAction.action}
                                      disabled={isLoading}
                                    >
                                      {isLoading ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      ) : (
                                        <IconComponent className="h-4 w-4 mr-2" />
                                      )}
                                      {isLoading ? 'Processing...' : nextAction.label}
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
          </GlassCard>
        </TabsContent>

        {/* Tab Content: Entity Management */}
        <TabsContent value="entities" className="space-y-6">
          <GlassCard variant="premium" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Entity Management</h3>
                <p className="text-white/60">Create and manage organizational entities and their hierarchies</p>
              </div>
              <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Create Entity
              </Button>
            </div>
            
            {/* Entity Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "DevOps Team", type: "Department", members: 24, manager: "John Doe", status: "Active" },
                { name: "QA Team", type: "Department", members: 18, manager: "Jane Smith", status: "Active" },
                { name: "HR Department", type: "Department", members: 8, manager: "Mike Johnson", status: "Active" },
                { name: "Managers", type: "Group", members: 12, manager: "Sarah Wilson", status: "Active" },
                { name: "Support Team", type: "Department", members: 15, manager: "Alex Brown", status: "Inactive" },
                { name: "Finance", type: "Department", members: 6, manager: "Lisa Davis", status: "Active" },
              ].map((entity, index) => (
                <GlassCard key={index} variant="premium" className="p-4 hover:bg-white/5 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                        <Factory className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{entity.name}</h4>
                        <p className="text-white/60 text-sm">{entity.type}</p>
                      </div>
                    </div>
                    <Badge className={entity.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                      {entity.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Members:</span>
                      <span className="text-white">{entity.members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Manager:</span>
                      <span className="text-white">{entity.manager}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Tab Content: Asset Management */}
        <TabsContent value="assets" className="space-y-6">
          <GlassCard variant="premium" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Asset Management</h3>
                <p className="text-white/60">Monitor and manage digital assets, tokens, and blockchain transactions</p>
              </div>
              <div className="flex space-x-2">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Asset
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Send Assets
                </Button>
              </div>
            </div>
            
            {/* Asset Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { name: "BlueDollar (BD)", balance: "125,430.50", change: "+5.2%", color: "from-blue-400 to-cyan-500" },
                { name: "Stellar Lumens (XLM)", balance: "45,280.75", change: "+2.1%", color: "from-purple-400 to-pink-500" },
                { name: "USDC", balance: "89,150.00", change: "+0.8%", color: "from-green-400 to-teal-500" },
                { name: "Custom Tokens", balance: "23,450.25", change: "+12.4%", color: "from-orange-400 to-red-500" },
              ].map((asset, index) => (
                <GlassCard key={index} variant="premium" className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${asset.color} rounded-lg flex items-center justify-center`}>
                      <Coins className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-green-400 text-sm font-semibold">{asset.change}</span>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-medium">{asset.name}</p>
                    <p className="text-xl font-bold text-white mt-1">{asset.balance}</p>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Recent Asset Transactions */}
            <GlassCard variant="ultra" className="overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h4 className="text-lg font-semibold text-white">Recent Asset Transactions</h4>
                <p className="text-white/60 text-sm">Latest blockchain asset transfers and operations</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white/80 font-semibold">Asset</TableHead>
                      <TableHead className="text-white/80 font-semibold">Type</TableHead>
                      <TableHead className="text-white/80 font-semibold">Amount</TableHead>
                      <TableHead className="text-white/80 font-semibold">From/To</TableHead>
                      <TableHead className="text-white/80 font-semibold">Status</TableHead>
                      <TableHead className="text-white/80 font-semibold">Date</TableHead>
                      <TableHead className="text-white/80 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { asset: "BlueDollar", type: "Send", amount: "-1,250.00 BD", target: "John Doe", status: "Completed", date: "2 hours ago" },
                      { asset: "USDC", type: "Receive", amount: "+500.00 USDC", target: "Sarah Wilson", status: "Completed", date: "5 hours ago" },
                      { asset: "XLM", type: "Send", amount: "-2,100.50 XLM", target: "Mike Johnson", status: "Pending", date: "1 day ago" },
                      { asset: "BlueDollar", type: "Mint", amount: "+10,000.00 BD", target: "System", status: "Completed", date: "2 days ago" },
                      { asset: "Custom Token", type: "Send", amount: "-750.25 CT", target: "Alex Brown", status: "Failed", date: "3 days ago" },
                    ].map((transaction, index) => (
                      <TableRow key={index} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Coins className="h-4 w-4 text-blue-400" />
                            <span className="text-white font-medium">{transaction.asset}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={transaction.type === "Send" ? "bg-red-500/20 text-red-400" : transaction.type === "Receive" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${transaction.amount.startsWith("+") ? "text-green-400" : transaction.amount.startsWith("-") ? "text-red-400" : "text-white"}`}>
                            {transaction.amount}
                          </span>
                        </TableCell>
                        <TableCell className="text-white">{transaction.target}</TableCell>
                        <TableCell>
                          <Badge className={transaction.status === "Completed" ? "bg-green-500/20 text-green-400" : transaction.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/60">{transaction.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </GlassCard>
          </GlassCard>
        </TabsContent>
      </Tabs>
      
      {/* Send Asset Dialog */}
      {sendAssetDialog.user && (
        <SendAssetDialog
          publicKey={sendAssetDialog.user.public_key}
          username={sendAssetDialog.user.username}
          isOpen={sendAssetDialog.isOpen}
          onClose={handleCloseSendAssetDialog}
          onSuccess={handleSendAssetSuccess}
        />
      )}
    </div>
  )
}
