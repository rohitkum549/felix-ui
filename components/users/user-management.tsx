"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash2, UserCheck, UserX, Mail, Key, Building } from "lucide-react"
import { AddUserDialog } from "./AddUserDialog"

interface User {
  id: string
  username: string
  email: string
  role: string
  public_key: string
  secret_key: string
  entity_belongs: string
  entity_admin_name: string
  created_at: string | null
  updated_at: string | null
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
    entity_belongs: "Managers",
    entity_admin_name: "Rohit Jha",
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
    entity_belongs: "Developers",
    entity_admin_name: "Sarah Johnson",
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
    entity_belongs: "Support",
    entity_admin_name: "Mike Wilson",
    created_at: "2024-01-10",
    updated_at: "2024-07-05",
    status: "inactive",
  },
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("All")
  const [loading, setLoading] = useState(false)

  const roles = ["All", "Admin", "Moderator", "User"]

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      // const data = await apiService.getUsers()
      // setUsers(data)
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.entity_belongs.toLowerCase().includes(searchTerm.toLowerCase())
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

          <div className="flex space-x-2">
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
      </GlassCard>

      {/* Users Table */}
      <GlassCard variant="ultra" className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-white/80 font-semibold">User</TableHead>
                <TableHead className="text-white/80 font-semibold">Contact</TableHead>
                <TableHead className="text-white/80 font-semibold">Role</TableHead>
                <TableHead className="text-white/80 font-semibold">Entity</TableHead>
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
                        <span className="text-white/60 text-sm">{user.entity_admin_name}</span>
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
                        <span className="text-white text-sm">{user.entity_belongs}</span>
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
                    <Badge className={`${getStatusColor(user.status || "active")} border-0 capitalize`}>{user.status || "active"}</Badge>
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
        </div>
      </GlassCard>
    </div>
  )
}
