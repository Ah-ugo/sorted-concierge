"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  apiClient,
  type User,
  type UserCreate,
  type UserUpdate,
  type Token,
  APIError,
} from "./api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: UserCreate) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: UserUpdate) => Promise<boolean>;
  uploadProfileImage: (file: File) => Promise<string | null>;
}

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isAdmin: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (userData: UserCreate) => Promise<boolean>;
//   logout: () => void;
//   updateUser: (userData: UserUpdate) => Promise<boolean>;
//   uploadProfileImage: (file: File) => Promise<string | null>;
// }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async (authToken: string) => {
    setIsLoading(true);
    try {
      const userData = await apiClient.getCurrentUser();
      if (userData) {
        setUser(userData);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.login({
        username: email,
        password,
      });

      if (response?.access_token) {
        setToken(response.access_token);
        setUser(response.user);
        console.log(response.user);
        localStorage.setItem("token", response.access_token);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle APIError specifically
      if (error instanceof APIError) {
        // You can access error.status, error.message, error.details here
        console.error(
          `Login failed with status ${error.status}:`,
          error.message
        );

        // For 422 errors, you might want to show validation messages
        if (error.status === 422 && error.details) {
          const validationErrors = Array.isArray(error.details)
            ? error.details.join(", ")
            : JSON.stringify(error.details);
          console.error("Validation errors:", validationErrors);
        }
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (userData: UserCreate) => {
    setIsLoading(true);
    try {
      const response: Token = await apiClient.register(userData);
      if (response && response.access_token) {
        setToken(response.access_token);
        setUser(response.user);
        localStorage.setItem("token", response.access_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const updateUser = async (userData: UserUpdate) => {
    if (!user || !token) return false;

    setIsLoading(true);
    try {
      const updatedUser = await apiClient.updateUser(user.id, userData);
      if (updatedUser) {
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update user error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfileImage = async (file: File) => {
    if (!user || !token) return null;

    setIsLoading(true);
    try {
      const response = await apiClient.uploadProfileImage(file);
      if (response && response.profileImage) {
        setUser({ ...user, profileImage: response.profileImage });
        return response.profileImage;
      }
      return null;
    } catch (error) {
      console.error("Upload profile image error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

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
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
