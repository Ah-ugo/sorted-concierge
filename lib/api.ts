import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://naija-concierge-api.onrender.com"

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error("API Error:", error)
  const errorMessage = error.response?.data?.detail || error.message || "An error occurred"
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  })
  return null
}

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  profileImage?: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number
  image?: string
  duration: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface Package {
  id: string
  name: string
  description: string
  price: number
  duration: string
  features: string[]
  image?: string
  type: string
  isPopular: boolean
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  userId: string
  serviceId: string
  bookingDate: string
  status: string
  specialRequests?: string
  createdAt: string
  updatedAt: string
  service?: Service
}

export interface Subscription {
  id: string
  userId: string
  packageId: string
  startDate: string
  endDate: string
  status: string
  createdAt: string
  updatedAt: string
  package?: Package
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  author: {
    name: string
    avatar?: string
  }
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface EmergencyAlert {
  id: string
  userId: string
  message: string
  location?: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ContactMessage {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface Document {
  id: string
  userId: string
  name: string
  type: string
  url: string
  uploadDate: string
}

export interface AdminStats {
  totalUsers: number
  totalBookings: number
  totalRevenue: number
  activePackages: number
  userGrowth: number
  bookingGrowth: number
  revenueGrowth: number
  packageGrowth: number
}

// Auth API
export const authAPI = {
  register: async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Registration failed")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  login: async (email: string, password: string) => {
    try {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)

      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Login failed")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  getMe: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get user data")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },
}

// Users API
export const usersAPI = {
  getUsers: async (token: string, skip = 0, limit = 100) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users?skip=${skip}&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get users")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return []
    }
  },

  getUserById: async (userId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get user")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  updateUser: async (userId: string, userData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to update user")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  uploadProfileImage: async (file: File, token: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/users/profile-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to upload profile image")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },
}

// Services API
export const servicesAPI = {
  getServices: async (category?: string, skip = 0, limit = 100) => {
    try {
      let url = `${API_BASE_URL}/services?skip=${skip}&limit=${limit}`
      if (category) {
        url += `&category=${category}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get services")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return []
    }
  },

  getServiceById: async (serviceId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get service")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  createService: async (serviceData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to create service")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  updateService: async (serviceId: string, serviceData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to update service")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  deleteService: async (serviceId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to delete service")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  uploadServiceImage: async (file: File, token: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/services/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to upload service image")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },
}

// Packages API
export const packagesAPI = {
  getPackages: async (type?: string, skip = 0, limit = 100) => {
    try {
      let url = `${API_BASE_URL}/packages?skip=${skip}&limit=${limit}`
      if (type) {
        url += `&type=${type}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get packages")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return []
    }
  },

  getPackageById: async (packageId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/packages/${packageId}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get package")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  createPackage: async (packageData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(packageData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to create package")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  updatePackage: async (packageId: string, packageData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/packages/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(packageData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to update package")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  deletePackage: async (packageId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/packages/${packageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to delete package")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  uploadPackageImage: async (file: File, token: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/packages/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to upload package image")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },
}

// Bookings API
export const bookingsAPI = {
  getBookings: async (token: string, status?: string, skip = 0, limit = 100) => {
    try {
      let url = `${API_BASE_URL}/bookings?skip=${skip}&limit=${limit}`
      if (status) {
        url += `&status=${status}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get bookings")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return []
    }
  },

  getBookingById: async (bookingId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get booking")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  createBooking: async (bookingData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to create booking")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  updateBooking: async (bookingId: string, bookingData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to update booking")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  deleteBooking: async (bookingId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to delete booking")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  getUserBookings: async (token: string, status?: string) => {
    try {
      let url = `${API_BASE_URL}/bookings`
      if (status) {
        url += `?status=${status}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get user bookings")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return []
    }
  },
}

// Subscriptions API
export const subscriptionsAPI = {
  getSubscriptions: async (token: string, status?: string, skip = 0, limit = 100) => {
    try {
      let url = `${API_BASE_URL}/subscriptions?skip=${skip}&limit=${limit}`
      if (status) {
        url += `&status=${status}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get subscriptions")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return []
    }
  },

  getSubscriptionById: async (subscriptionId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get subscription")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  createSubscription: async (subscriptionData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to create subscription")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  updateSubscription: async (subscriptionId: string, subscriptionData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to update subscription")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  deleteSubscription: async (subscriptionId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to delete subscription")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  getUserSubscriptions: async (token: string, status?: string) => {
    try {
      let url = `${API_BASE_URL}/subscriptions`
      if (status) {
        url += `?status=${status}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get user subscriptions")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return []
    }
  },
}

// Blogs API
export const blogsAPI = {
  getBlogs: async (tag?: string, skip = 0, limit = 100) => {
    try {
      let url = `${API_BASE_URL}/blogs?skip=${skip}&limit=${limit}`
      if (tag) {
        url += `&tag=${tag}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get blogs")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return []
    }
  },

  getBlogBySlug: async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${slug}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get blog")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  createBlog: async (blogData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to create blog")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  updateBlog: async (blogId: string, blogData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to update blog")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  deleteBlog: async (blogId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to delete blog")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  uploadBlogImage: async (file: File, token: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/blogs/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to upload blog image")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },
}

// Emergency Alerts API
export const emergencyAlertsAPI = {
  getEmergencyAlerts: async (token: string, status?: string, skip = 0, limit = 100) => {
    try {
      let url = `${API_BASE_URL}/emergency-alerts?skip=${skip}&limit=${limit}`
      if (status) {
        url += `&status=${status}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get emergency alerts")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return []
    }
  },

  createEmergencyAlert: async (alertData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/emergency-alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(alertData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to create emergency alert")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  updateEmergencyAlert: async (alertId: string, alertData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/emergency-alerts/${alertId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(alertData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to update emergency alert")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },
}

// Contact API
export const contactAPI = {
  sendContactMessage: async (messageData: ContactMessage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to send contact message")
      }

      return true
    } catch (error) {
      handleApiError(error)
      return false
    }
  },
}

// Documents API
export const documentsAPI = {
  getDocuments: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get documents")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return []
    }
  },

  uploadDocument: async (file: File, userId: string, documentType: string, token: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", userId)
      formData.append("documentType", documentType)

      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to upload document")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },

  deleteDocument: async (documentId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to delete document")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },
}

// Admin API
export const adminAPI = {
  getStats: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to get admin stats")
      }

      return await response.json()
    } catch (error) {
      handleApiError(error)
      return null
    }
  },
}

export const createBooking = async (bookingData: any) => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = {
      id: "BK-SIMULATED",
      ...bookingData,
    }

    return response
  } catch (error) {
    handleApiError(error)
    return null
  }
}
