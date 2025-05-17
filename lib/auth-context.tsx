"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authAPI, usersAPI, type User } from "@/lib/api"

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  updateUser: (userData: any) => Promise<boolean>
  uploadProfileImage: (file: File) => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchUserData(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserData = async (authToken: string) => {
    setIsLoading(true)
    try {
      const userData = await authAPI.getMe(authToken)
      if (userData) {
        setUser(userData)
      } else {
        // Token is invalid or expired
        logout()
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(email, password)
      if (response && response.access_token) {
        setToken(response.access_token)
        setUser(response.user)
        localStorage.setItem("token", response.access_token)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      const response = await authAPI.register(userData)
      if (response && response.access_token) {
        setToken(response.access_token)
        setUser(response.user)
        localStorage.setItem("token", response.access_token)
        return true
      }
      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  const updateUser = async (userData: any) => {
    if (!user || !token) return false

    setIsLoading(true)
    try {
      const updatedUser = await usersAPI.updateUser(user.id, userData, token)
      if (updatedUser) {
        setUser(updatedUser)
        return true
      }
      return false
    } catch (error) {
      console.error("Update user error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const uploadProfileImage = async (file: File) => {
    if (!user || !token) return null

    setIsLoading(true)
    try {
      const response = await usersAPI.uploadProfileImage(file, token)
      if (response && response.profileImage) {
        setUser({ ...user, profileImage: response.profileImage })
        return response.profileImage
      }
      return null
    } catch (error) {
      console.error("Upload profile image error:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        uploadProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
