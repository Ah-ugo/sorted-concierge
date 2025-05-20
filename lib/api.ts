// api.ts
import axios, { AxiosResponse } from "axios";
import { ObjectId } from "bson";

// Base URL for the API
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://naija-concierge-api.onrender.com";

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Type definitions matching Pydantic models
export interface UserBase {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}

export interface UserCreate extends UserBase {
  password: string;
}

export interface UserUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}

export interface User extends UserBase {
  id: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  user: User;
}

export enum Timeframe {
  weekly = "weekly",
  monthly = "monthly",
}

export interface BookingDataPoint {
  name: string;
  bookings: number;
  completed: number;
}

export interface RevenueDataPoint {
  name: string;
  revenue: number;
}

export interface ChartDataResponse {
  bookingData: BookingDataPoint[];
  revenueData: RevenueDataPoint[];
}

export interface ServiceBase {
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  duration: string;
  isAvailable: boolean;
}

export interface ServiceCreate extends ServiceBase {}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  image?: string;
  duration?: string;
  isAvailable?: boolean;
}

export interface Service extends ServiceBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CRMClientBase {
  clientName: string;
  contactInfo: { [key: string]: string };
  serviceBooked: string;
  status: string;
  assignedVendor?: string;
  notes?: string;
  dueDate?: string;
}

export interface CRMClientCreate extends CRMClientBase {}

export interface CRMClientUpdate {
  clientName?: string;
  contactInfo?: { [key: string]: string };
  serviceBooked?: string;
  status?: string;
  assignedVendor?: string;
  notes?: string;
  dueDate?: string;
}

export interface CRMClient extends CRMClientBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AirtableBookingForm {
  clientName: string;
  email: string;
  phone?: string;
  serviceId: string;
  bookingDate: string;
  specialRequests?: string;
}

export interface PackageBase {
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  image?: string;
  type: string;
  isPopular: boolean;
}

export interface PackageCreate extends PackageBase {}

export interface PackageUpdate {
  name?: string;
  description?: string;
  price?: number;
  duration?: string;
  features?: string[];
  image?: string;
  type?: string;
  isPopular?: boolean;
}

export interface Package extends PackageBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingBase {
  userId: string;
  serviceId: string;
  bookingDate: string;
  status: string;
  specialRequests?: string;
}

export interface BookingCreate extends BookingBase {}

export interface BookingUpdate {
  bookingDate?: string;
  status?: string;
  specialRequests?: string;
}

export interface Booking extends BookingBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  service?: Service;
}

export enum SubscriptionStatus {
  active = "active",
  inactive = "inactive",
  cancelled = "cancelled",
}

export interface SubscriptionInitiate {
  userId: string;
  packageId: string;
  preferredCurrency?: string;
}

export interface SubscriptionBase {
  userId: string;
  packageId: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface SubscriptionCreate extends SubscriptionBase {}

export interface SubscriptionUpdate {
  startDate?: string;
  endDate?: string;
  status?: SubscriptionStatus;
}

export interface Subscription extends SubscriptionBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  package?: Package;
}

export interface BlogBase {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: { [key: string]: string };
  tags: string[];
}

export interface BlogCreate extends BlogBase {}

export interface BlogUpdate {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  author?: { [key: string]: string };
  tags?: string[];
}

export interface Blog extends BlogBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyAlertBase {
  userId: string;
  message: string;
  location?: string;
  status: string;
}

export interface EmergencyAlertCreate extends EmergencyAlertBase {}

export interface EmergencyAlertUpdate {
  message?: string;
  location?: string;
  status?: string;
}

export interface EmergencyAlert extends EmergencyAlertBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface DocumentBase {
  userId: string;
  name: string;
  type: string;
  url: string;
}

export interface DocumentCreate extends DocumentBase {}

export interface Document extends DocumentBase {
  id: string;
  uploadDate: string;
}

export interface TransactionCreate {
  tx_ref: string;
  transactionId: string;
  userId: string;
  packageId: string;
  amount: number;
  currency: string;
  preferredCurrency: string;
  status: string;
}

export interface Transaction extends TransactionCreate {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activePackages: number;
  userGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
  packageGrowth: number;
}

// Error handling
// export class APIError extends Error {
//   constructor(
//     public status: number,
//     public message: string,
//     public details?: any
//   ) {
//     super(message);
//     this.name = "APIError";
//   }
// }

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = "APIError";
    Object.setPrototypeOf(this, APIError.prototype);
  }

  toString() {
    return `APIError: ${this.status} - ${this.message}`;
  }
}

// API Client Functions
export const apiClient = {
  // Auth
  async register(user: UserCreate): Promise<Token> {
    try {
      const response = await api.post("/auth/register", user);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Registration failed"
      );
    }
  },

  // async login(credentials: {
  //   username: string;
  //   password: string;
  // }): Promise<Token> {
  //   try {
  //     const response = await api.post(
  //       "/auth/token",
  //       new URLSearchParams(credentials)
  //     );
  //     return response.data;
  //   } catch (error: any) {
  //     throw new APIError(
  //       error.response?.status || 500,
  //       error.response?.data?.detail || "Login failed"
  //     );
  //   }
  // },

  async login(credentials: { username: string; password: string }): Promise<{
    access_token: string;
    token_type: string;
    user: User;
  }> {
    try {
      const formData = new URLSearchParams();
      formData.append("grant_type", "password");
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);
      formData.append("scope", "");
      formData.append("client_id", "");
      formData.append("client_secret", "");

      const response = await api.post("/auth/token", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Handle 422 validation errors specifically
        if (error.response.status === 422) {
          const details = error.response.data?.detail || "Invalid credentials";
          throw new APIError(
            422,
            typeof details === "string" ? details : "Validation failed",
            error.response.data
          );
        }

        throw new APIError(
          error.response.status,
          error.response.data?.detail || error.message || "Login failed",
          error.response.data
        );
      } else {
        throw new APIError(0, error.message || "Network error");
      }
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch current user"
      );
    }
  },

  // Users
  async getUsers(
    params: { skip?: number; limit?: number } = {}
  ): Promise<User[]> {
    try {
      const response = await api.get("/users", { params });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch users"
      );
    }
  },

  async getUser(userId: string): Promise<User> {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch user"
      );
    }
  },

  async updateUser(userId: string, update: UserUpdate): Promise<User> {
    try {
      const response = await api.put(`/users/${userId}`, update);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to update user"
      );
    }
  },

  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to delete user"
      );
    }
  },

  async uploadProfileImage(file: File): Promise<{ profileImage: string }> {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post("/users/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to upload profile image"
      );
    }
  },

  // CRM Clients
  async getCRMClients(
    params: { skip?: number; limit?: number; status?: string } = {}
  ): Promise<CRMClient[]> {
    try {
      const response = await api.get("/crm/clients", { params });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch CRM clients"
      );
    }
  },

  async createCRMClient(client: CRMClientCreate): Promise<CRMClient> {
    try {
      const response = await api.post("/crm/clients", client);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to create CRM client"
      );
    }
  },

  async getCRMClient(clientId: string): Promise<CRMClient> {
    try {
      const response = await api.get(`/crm/clients/${clientId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch CRM client"
      );
    }
  },

  async updateCRMClient(
    clientId: string,
    update: CRMClientUpdate
  ): Promise<CRMClient> {
    try {
      const response = await api.put(`/crm/clients/${clientId}`, update);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to update CRM client"
      );
    }
  },

  async deleteCRMClient(clientId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/crm/clients/${clientId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to delete CRM client"
      );
    }
  },

  // Airtable Bookings
  async createAirtableBooking(booking: AirtableBookingForm): Promise<Booking> {
    try {
      const response = await api.post("/bookings/airtable", booking);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to create Airtable booking"
      );
    }
  },

  // Services
  async getServices(
    params: { skip?: number; limit?: number; category?: string } = {}
  ): Promise<Service[]> {
    try {
      const response = await api.get("/services", { params });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch services"
      );
    }
  },

  async getService(serviceId: string): Promise<Service> {
    try {
      const response = await api.get(`/services/${serviceId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch service"
      );
    }
  },

  async createService(service: ServiceCreate): Promise<Service> {
    try {
      const response = await api.post("/services", service);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to create service"
      );
    }
  },

  async updateService(
    serviceId: string,
    update: ServiceUpdate
  ): Promise<Service> {
    try {
      const response = await api.put(`/services/${serviceId}`, update);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to update service"
      );
    }
  },

  async deleteService(serviceId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/services/${serviceId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to delete service"
      );
    }
  },

  async uploadServiceImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post("/services/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to upload service image"
      );
    }
  },

  // Packages
  async getPackages(
    params: { skip?: number; limit?: number; type?: string } = {}
  ): Promise<Package[]> {
    try {
      const response = await api.get("/packages", { params });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch packages"
      );
    }
  },

  async getPackage(packageId: string): Promise<Package> {
    try {
      const response = await api.get(`/packages/${packageId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch package"
      );
    }
  },

  async createPackage(packageData: PackageCreate): Promise<Package> {
    try {
      const response = await api.post("/packages", packageData);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to create package"
      );
    }
  },

  async updatePackage(
    packageId: string,
    update: PackageUpdate
  ): Promise<Package> {
    try {
      const response = await api.put(`/packages/${packageId}`, update);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to update package"
      );
    }
  },

  async deletePackage(packageId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/packages/${packageId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to delete package"
      );
    }
  },

  async uploadPackageImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post("/packages/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to upload package image"
      );
    }
  },

  // Bookings
  async getBookings(
    params: { skip?: number; limit?: number; status?: string } = {}
  ): Promise<Booking[]> {
    try {
      const response = await api.get("/bookings", { params });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch bookings"
      );
    }
  },

  async getBooking(bookingId: string): Promise<Booking> {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch booking"
      );
    }
  },

  async createBooking(booking: BookingCreate): Promise<Booking> {
    try {
      const response = await api.post("/bookings", booking);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to create booking"
      );
    }
  },

  async updateBooking(
    bookingId: string,
    update: BookingUpdate
  ): Promise<Booking> {
    try {
      const response = await api.put(`/bookings/${bookingId}`, update);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to update booking"
      );
    }
  },

  async deleteBooking(bookingId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to delete booking"
      );
    }
  },

  // Subscriptions
  async getSubscriptions(
    params: { skip?: number; limit?: number; status?: string } = {}
  ): Promise<Subscription[]> {
    try {
      const response = await api.get("/subscriptions", { params });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch subscriptions"
      );
    }
  },

  async getSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await api.get(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch subscription"
      );
    }
  },

  async createSubscription(
    subscription: SubscriptionCreate
  ): Promise<Subscription> {
    try {
      const response = await api.post("/subscriptions", subscription);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to create subscription"
      );
    }
  },

  async initiateSubscriptionPayment(
    subscription: SubscriptionInitiate
  ): Promise<{ payment_url: string }> {
    try {
      const response = await api.post(
        "/subscriptions/initiate_payment",
        subscription
      );
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail ||
          "Failed to initiate subscription payment"
      );
    }
  },

  async updateSubscription(
    subscriptionId: string,
    update: SubscriptionUpdate
  ): Promise<Subscription> {
    try {
      const response = await api.put(
        `/subscriptions/${subscriptionId}`,
        update
      );
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to update subscription"
      );
    }
  },

  async deleteSubscription(
    subscriptionId: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to delete subscription"
      );
    }
  },

  // Blogs
  async getBlogs(
    params: { skip?: number; limit?: number; tag?: string } = {}
  ): Promise<Blog[]> {
    try {
      const response = await api.get("/blogs", { params });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch blogs"
      );
    }
  },

  async getBlog(blogId: string): Promise<Blog> {
    try {
      const response = await api.get(`/blogs/${blogId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch blog"
      );
    }
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    try {
      const response = await api.get(`/blogs/blog/${slug}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch blog by slug"
      );
    }
  },

  async createBlog(blog: BlogCreate): Promise<Blog> {
    try {
      const response = await api.post("/blogs", blog);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to create blog"
      );
    }
  },

  async updateBlog(blogId: string, update: BlogUpdate): Promise<Blog> {
    try {
      const response = await api.put(`/blogs/${blogId}`, update);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to update blog"
      );
    }
  },

  async deleteBlog(blogId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/blogs/${blogId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to delete blog"
      );
    }
  },

  async uploadBlogImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post("/blogs/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to upload blog image"
      );
    }
  },

  // Emergency Alerts
  async getEmergencyAlerts(
    params: { skip?: number; limit?: number; status?: string } = {}
  ): Promise<EmergencyAlert[]> {
    try {
      const response = await api.get("/emergency-alerts", { params });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch emergency alerts"
      );
    }
  },

  async createEmergencyAlert(
    alert: EmergencyAlertCreate
  ): Promise<EmergencyAlert> {
    try {
      const response = await api.post("/emergency-alerts", alert);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to create emergency alert"
      );
    }
  },

  async updateEmergencyAlert(
    alertId: string,
    update: EmergencyAlertUpdate
  ): Promise<EmergencyAlert> {
    try {
      const response = await api.put(`/emergency-alerts/${alertId}`, update);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to update emergency alert"
      );
    }
  },

  // Contact
  async sendContactMessage(
    message: ContactMessage
  ): Promise<{ message: string }> {
    try {
      const response = await api.post("/contact", message);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to send contact message"
      );
    }
  },

  // Documents
  async getDocuments(): Promise<Document[]> {
    try {
      const response = await api.get("/documents");
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch documents"
      );
    }
  },

  async createDocument(data: {
    name: string;
    type: string;
    file: File;
  }): Promise<Document> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("file", data.file);
    try {
      const response = await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to create document"
      );
    }
  },

  async deleteDocument(documentId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/documents/${documentId}`);
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to delete document"
      );
    }
  },

  // Admin Stats
  async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await api.get("/admin/stats");
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch admin stats"
      );
    }
  },

  async getChartData(
    timeframe: Timeframe = Timeframe.weekly
  ): Promise<ChartDataResponse> {
    try {
      const response = await api.get("/analytics/chart-data", {
        params: { timeframe },
      });
      return response.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to fetch chart data"
      );
    }
  },
};
