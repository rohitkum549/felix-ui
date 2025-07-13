"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Shield, Palette, Globe, Key, Smartphone, Mail, Save } from "lucide-react"

interface UserInfo {
  sub?: string
  email?: string
  preferred_username?: string
  given_name?: string
  family_name?: string
  name?: string
  phone_number?: string
  realm_access?: {
    roles?: string[]
  }
}

export function Settings() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    timezone: "utc-5",
    language: "en"
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  })

  const [security, setSecurity] = useState({
    twoFactor: true,
    biometric: false,
    sessionTimeout: "30",
  })

  // Load user info from localStorage on component mount
  useEffect(() => {
    const loadUserInfo = () => {
      try {
        const storedUserInfo = localStorage.getItem("felix_user_info")
        if (storedUserInfo) {
          const parsedUserInfo: UserInfo = JSON.parse(storedUserInfo)
          setUserInfo(parsedUserInfo)
          
          // Update form data with user info
          setFormData({
            firstName: parsedUserInfo.given_name || "",
            lastName: parsedUserInfo.family_name || "",
            email: parsedUserInfo.email || "",
            phone: parsedUserInfo.phone_number || "",
            timezone: "utc-5", // Default, can be expanded to store user preference
            language: "en" // Default, can be expanded to store user preference
          })
        }
      } catch (error) {
        console.error("Error loading user info from localStorage:", error)
      }
    }

    loadUserInfo()
  }, [])

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (userInfo?.given_name && userInfo?.family_name) {
      return `${userInfo.given_name[0]}${userInfo.family_name[0]}`.toUpperCase()
    }
    if (userInfo?.name) {
      const nameParts = userInfo.name.split(" ")
      return nameParts.map(part => part[0]).join("").toUpperCase()
    }
    if (userInfo?.preferred_username) {
      return userInfo.preferred_username.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  // Get full name
  const getFullName = () => {
    if (userInfo?.given_name && userInfo?.family_name) {
      return `${userInfo.given_name} ${userInfo.family_name}`
    }
    if (userInfo?.name) {
      return userInfo.name
    }
    return userInfo?.preferred_username || "User"
  }

  // Get membership status
  const getMembershipStatus = () => {
    const roles = userInfo?.realm_access?.roles || []
    if (roles.includes("coe-admin") || roles.includes("project-admin")) {
      return "Premium Member since 2024"
    }
    return "Member since 2024"
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Save changes function
  const handleSaveChanges = () => {
    // Here you would typically make an API call to update the user's profile
    // For now, we'll just update the localStorage
    try {
      if (userInfo) {
        const updatedUserInfo = {
          ...userInfo,
          given_name: formData.firstName,
          family_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone
        }
        localStorage.setItem("felix_user_info", JSON.stringify(updatedUserInfo))
        setUserInfo(updatedUserInfo)
        
        // Show success message (you can implement a toast notification here)
        console.log("Profile updated successfully!")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/60">Manage your account preferences and security settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-lg"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-lg"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-lg"
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-lg"
          >
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <GlassCard variant="ultra" className="p-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{getUserInitials()}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{getFullName()}</h2>
                <p className="text-white/60">{getMembershipStatus()}</p>
                <Button
                  variant="outline"
                  className="mt-3 border-white/20 text-white hover:bg-white/10 rounded-lg bg-transparent"
                >
                  Change Avatar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white/80">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:bg-white/15 focus:border-white/30"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white/80">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:bg-white/15 focus:border-white/30"
                  placeholder="Enter your last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:bg-white/15 focus:border-white/30"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/80">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:bg-white/15 focus:border-white/30"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-white/80">
                  Timezone
                </Label>
                <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                    <SelectItem value="utc-5" className="text-white hover:bg-white/10">
                      UTC-5 (Eastern)
                    </SelectItem>
                    <SelectItem value="utc-6" className="text-white hover:bg-white/10">
                      UTC-6 (Central)
                    </SelectItem>
                    <SelectItem value="utc-7" className="text-white hover:bg-white/10">
                      UTC-7 (Mountain)
                    </SelectItem>
                    <SelectItem value="utc-8" className="text-white hover:bg-white/10">
                      UTC-8 (Pacific)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language" className="text-white/80">
                  Language
                </Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                    <SelectItem value="en" className="text-white hover:bg-white/10">
                      English
                    </SelectItem>
                    <SelectItem value="es" className="text-white hover:bg-white/10">
                      Spanish
                    </SelectItem>
                    <SelectItem value="fr" className="text-white hover:bg-white/10">
                      French
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button 
                onClick={handleSaveChanges}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <GlassCard variant="ultra" className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-white/60 text-sm">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-white/60 text-sm">Receive push notifications on your device</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">SMS Notifications</p>
                    <p className="text-white/60 text-sm">Receive notifications via SMS</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-orange-400" />
                  <div>
                    <p className="text-white font-medium">Marketing Communications</p>
                    <p className="text-white/60 text-sm">Receive updates about new features and promotions</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                />
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <GlassCard variant="ultra" className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <Switch
                  checked={security.twoFactor}
                  onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Biometric Authentication</p>
                    <p className="text-white/60 text-sm">Use fingerprint or face recognition</p>
                  </div>
                </div>
                <Switch
                  checked={security.biometric}
                  onCheckedChange={(checked) => setSecurity({ ...security, biometric: checked })}
                />
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Session Timeout</p>
                    <p className="text-white/60 text-sm">Automatically log out after inactivity</p>
                  </div>
                </div>
                <Select
                  value={security.sessionTimeout}
                  onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                    <SelectItem value="15" className="text-white hover:bg-white/10">
                      15 minutes
                    </SelectItem>
                    <SelectItem value="30" className="text-white hover:bg-white/10">
                      30 minutes
                    </SelectItem>
                    <SelectItem value="60" className="text-white hover:bg-white/10">
                      1 hour
                    </SelectItem>
                    <SelectItem value="never" className="text-white hover:bg-white/10">
                      Never
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <Button
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl bg-transparent"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <GlassCard variant="ultra" className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Appearance Settings</h2>

            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center space-x-3 mb-4">
                  <Palette className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Theme</p>
                    <p className="text-white/60 text-sm">Choose your preferred theme</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-gray-900 to-black border border-white/20 cursor-pointer hover:border-white/40 transition-colors">
                    <div className="w-full h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-2"></div>
                    <p className="text-white text-sm text-center">Dark</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-100 border border-gray-300 cursor-pointer hover:border-gray-400 transition-colors">
                    <div className="w-full h-16 bg-gradient-to-br from-gray-100 to-white rounded mb-2"></div>
                    <p className="text-gray-900 text-sm text-center">Light</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-900 to-purple-900 border border-blue-500/50 cursor-pointer hover:border-blue-400 transition-colors">
                    <div className="w-full h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded mb-2"></div>
                    <p className="text-white text-sm text-center">Cosmic</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Accent Color</p>
                    <p className="text-white/60 text-sm">Choose your preferred accent color</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-teal-500"].map(
                    (color) => (
                      <div
                        key={color}
                        className={`w-8 h-8 ${color} rounded-full cursor-pointer hover:scale-110 transition-transform`}
                      ></div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
