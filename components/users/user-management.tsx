"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash2, UserCheck, UserX, Mail, Phone } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: "active" | "inactive" | "pending"
  joinDate: string
  lastActive: string
  avatar: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    role: "Admin",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 234 567 8901",
    role: "User",
    status: "active",
    joinDate: "2024-02-20",
    lastActive: "1 day ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@example.com",
    phone: "+1 234 567 8902",
    role: "Moderator",
    status: "inactive",
    joinDate: "2024-01-10",
    lastActive: "1 week ago",
    avatar: "/placeholder.svg?height=40&width=40",
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
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
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

        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
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
                <TableHead className="text-white/80 font-semibold">Status</TableHead>
                <TableHead className="text-white/80 font-semibold">Join Date</TableHead>
                <TableHead className="text-white/80 font-semibold">Last Active</TableHead>
                <TableHead className="text-white/80 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
                      />
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-white/60 text-sm">ID: {user.id}</p>
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
                        <Phone className="h-3 w-3 text-white/60" />
                        <span className="text-white/60 text-sm">{user.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRoleColor(user.role)} border-0`}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(user.status)} border-0 capitalize`}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-white/80">{user.joinDate}</TableCell>
                  <TableCell className="text-white/60">{user.lastActive}</TableCell>
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
