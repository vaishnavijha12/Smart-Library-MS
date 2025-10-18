'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { User, Mail, Phone, MapPin, Shield, Camera } from 'lucide-react'
import Image from 'next/image'
import { ShimmerPostItem } from "react-shimmer-effects";

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  role: string
  profilePic?: string
}

export default function LibrarianProfile() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [, setUploaded] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    profilePic: '',
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          profilePic: data.user.profilePic || '',
        })
        setPreview(data.user.profilePic || null)
      }
    } catch (err) {
      console.error('Failed to fetch user:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Profile updated successfully')
        fetchUser()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Update profile error:', err)
      toast.error('An error occurred while updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Basic size check (2MB)
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('Image too large. Max 2MB.')
    return
  }

  // Preview using FileReader
  const reader = new FileReader()
  reader.onload = () => setPreview(reader.result as string)
  reader.readAsDataURL(file)

  // Upload to Cloudinary
  toast.info('Uploading image...')
  try {
    const formData = new FormData()
    formData.append('file', file)
    if (!CLOUDINARY_UPLOAD_PRESET) {
      console.error("Cloudinary upload preset is not defined in environment variables.");
      // Optionally, show an error message to the user
      return; 
    }
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    )

    if (!response.ok) throw new Error('Upload failed')

    const data = await response.json()
    const imageUrl = data.secure_url
    setUploaded(imageUrl)
    toast.success('Image uploaded successfully!')
    console.log('Cloudinary URL:', imageUrl)

    // Update database immediately
    if (user?.id) {
      const updatePayload = { profilePic: imageUrl }
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      })
      if (res.ok) {
        toast.success('Profile picture updated in database!')
        // Optionally refresh user data
        fetchUser()
      } else {
        toast.error('Failed to update profile picture in DB')
      }
    }

  } catch (err) {
    console.error(err)
    toast.error('Failed to upload image.')
  }
}



  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShimmerPostItem card title text cta />
        <ShimmerPostItem card title text cta />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-900">Librarian Profile</h1>
          <p className="text-neutral-600">Manage your personal information and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile and contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-full bg-neutral-200 overflow-hidden">
                      {preview ? (
                        <Image src={preview} alt="Profile" width={80} height={80} className="object-cover" />
                      ) : formData.profilePic ? (
                        <Image src={formData.profilePic} alt="Profile" width={80} height={80} className="object-cover" />
                      ) : (
                        <User className="w-full h-full p-4 text-neutral-500" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="profilePic" className="block mb-1 text-sm font-medium">
                        Profile Picture
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="profilePic"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full"
                        />
                        <Camera className="h-5 w-5 text-neutral-500" />
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <Label htmlFor="name" className="mb-2 block">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="mb-2 block">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="pl-10 bg-neutral-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="mb-2 block">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="address" className="mb-2 block">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="pl-10"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-neutral-900 text-white" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Account Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-sm text-neutral-700">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-neutral-700">{user.email}</p>
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
