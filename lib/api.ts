// Base URL for the API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://naija-concierge-api.onrender.com";

// Type definitions matching the FastAPI backend exactly
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

// Enums matching backend
export type ServiceCategoryType = "tiered" | "contact_only";
export type BookingType =
  | "consultation"
  | "tier_booking"
  | "membership_service";
export type PaymentStatus = "pending" | "successful" | "failed" | "cancelled";
export type MembershipTier = "basic" | "premium" | "vip";
export type UserMembershipStatus = "active" | "expired" | "cancelled";

// Fixed Timeframe enum to match backend
export enum Timeframe {
  weekly = "weekly",
  monthly = "monthly",
}

// Service Category Models
export interface ServiceCategoryBase {
  name: string;
  description: string;
  category_type: ServiceCategoryType;
  image?: string;
  is_active: boolean;
}

export interface ServiceCategoryCreate extends ServiceCategoryBase {}

export interface ServiceCategoryUpdate {
  name?: string;
  description?: string;
  category_type?: ServiceCategoryType;
  image?: string;
  is_active?: boolean;
}

export interface ServiceCategory extends ServiceCategoryBase {
  id: string;
  created_at: string;
  updated_at: string;
  tiers?: ServiceTier[];
  services?: Service[];
}

// Service Tier Models
export interface ServiceTierBase {
  name: string;
  description: string;
  price: number;
  category_id: string;
  image?: string;
  features: string[];
  is_popular: boolean;
  is_available: boolean;
}

export interface ServiceTierCreate extends ServiceTierBase {}

export interface ServiceTierUpdate {
  name?: string;
  description?: string;
  price?: number;
  category_id?: string;
  image?: string;
  features?: string[];
  is_popular?: boolean;
  is_available?: boolean;
}

export interface ServiceTier extends ServiceTierBase {
  id: string;
  created_at: string;
  updated_at: string;
  services?: Service[];
  category?: ServiceCategory;
}

// Service Models
export interface ServiceBase {
  name: string;
  description: string;
  image?: string;
  duration: string;
  isAvailable: boolean;
  features: string[];
  requirements: string[];
  category_id?: string;
  tier_id?: string;
}

export interface ServiceCreate extends ServiceBase {}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  image?: string;
  duration?: string;
  isAvailable?: boolean;
  features?: string[];
  requirements?: string[];
  category_id?: string;
  tier_id?: string;
}

export interface Service extends ServiceBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  category?: ServiceCategory;
  tier?: ServiceTier;
}

// Booking Models
export interface BookingBase {
  userId: string;
  serviceId?: string | null;
  tierId?: string | null;
  bookingDate: string;
  status: string;
  specialRequests?: string;
  booking_type: BookingType;
  contact_preference?: string;
  payment_required: boolean;
  payment_amount?: number;
  payment_url?: string;
  payment_status?: PaymentStatus;
  payment_reference?: string;
  flutterwave_tx_ref?: string;
}

export interface BookingCreate extends BookingBase {}

export interface BookingUpdate {
  bookingDate?: string;
  status?: string;
  specialRequests?: string;
  contact_preference?: string;
  payment_status?: PaymentStatus;
}

export interface Booking extends BookingBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  service?: Service | null;
  tier?: ServiceTier | null;
}

// Airtable Booking Form
export interface AirtableBookingForm {
  clientName: string;
  email: string;
  phone?: string;
  serviceId?: string | null;
  tierId?: string | null;
  bookingDate: string;
  specialRequests?: string;
}

// Membership Models
export interface MembershipBase {
  name: string;
  description: string;
  tier: MembershipTier;
  price: number;
  duration_months: number;
  features: string[];
  image?: string;
  is_popular: boolean;
}

export interface MembershipCreate extends MembershipBase {}

export interface MembershipUpdate {
  name?: string;
  description?: string;
  tier?: MembershipTier;
  price?: number;
  duration_months?: number;
  features?: string[];
  image?: string;
  is_popular?: boolean;
}

export interface Membership extends MembershipBase {
  id: string;
  created_at: string;
  updated_at: string;
}

// User Membership Models
export interface UserMembershipBase {
  user_id: string;
  membership_id: string;
  start_date: string;
  end_date: string;
  status: UserMembershipStatus;
}

export interface UserMembershipCreate extends UserMembershipBase {}

export interface UserMembership extends UserMembershipBase {
  id: string;
  created_at: string;
  updated_at: string;
  membership?: Membership;
}

// CRM Models
export interface CRMClientBase {
  clientName: string;
  contactInfo: Record<string, string>;
  serviceBooked: string;
  status: string;
  assignedVendor?: string;
  notes?: string;
  dueDate?: string;
}

export interface CRMClientCreate extends CRMClientBase {}

export interface CRMClientUpdate {
  clientName?: string;
  contactInfo?: Record<string, string>;
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

// Blog Models
export interface BlogBase {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: Record<string, string>;
  tags: string[];
}

export interface BlogCreate extends BlogBase {}

export interface BlogUpdate {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  author?: Record<string, string>;
  tags?: string[];
}

export interface Blog extends BlogBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Emergency Alert Models
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

// Gallery Models
export interface GalleryImageBase {
  title: string;
  description?: string;
  category: string;
  tags: string[];
}

export interface GalleryImageCreate extends GalleryImageBase {}

export interface GalleryImageUpdate {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface GalleryImage extends GalleryImageBase {
  id: string;
  image_url: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Contact Message
export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Analytics Models
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

// Newsletter Subscription
export interface NewsletterSubscriber {
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

// Exchange Rates
export interface ExchangeRatesResponse {
  base_currency: string;
  rates: Record<string, number>;
  timestamp: string;
}

// Currency Conversion
export interface CurrencyConversionResponse {
  convertedPrice: number;
  originalPrice: number;
  originalCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
}

// Payment Verification
export interface PaymentVerificationResponse {
  tx_ref: string;
  status: string;
  amount: number;
  booking_id: string;
  verification_data: any;
}

// Tier Booking Request
export interface TierBookingRequest {
  tier_id: string;
  booking_date: string;
  preferred_currency: string;
  special_requests?: string;
}

// Error handling
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

// Helper functions
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

const createHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    let errorDetails = null;

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
      errorDetails = errorData;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new APIError(response.status, errorMessage, errorDetails);
  }

  return response.json();
};

const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

// Main API Client
export const apiClient = {
  // ==================== AUTH ENDPOINTS ====================

  async register(user: UserCreate): Promise<Token> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: createHeaders(false),
        body: JSON.stringify(user),
      });
      console.log(response);
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      console.log(error);
      throw new APIError(500, error.message || "Registration failed");
    }
  },

  async registerWithGoogle(googleToken: string): Promise<Token> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/google`, {
        method: "POST",
        headers: createHeaders(false),
        body: JSON.stringify({ google_token: googleToken }),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Google registration failed");
    }
  },

  async login(credentials: {
    username: string;
    password: string;
  }): Promise<Token> {
    try {
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData,
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Login failed");
    }
  },

  async loginWithGoogle(googleToken: string): Promise<Token> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
        method: "GET",
        headers: {
          ...createHeaders(false),
          Authorization: `Bearer ${googleToken}`,
        },
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Google login failed");
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch current user");
    }
  },

  // ==================== USER MANAGEMENT ====================

  async getUsers(
    params: {
      skip?: number;
      limit?: number;
    } = {}
  ): Promise<User[]> {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/users${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch users");
    }
  },

  async getUser(userId: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch user");
    }
  },

  async updateUser(userId: string, update: UserUpdate): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: createHeaders(true),
        body: JSON.stringify(update),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to update user");
    }
  },

  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to delete user");
    }
  },

  async uploadProfileImage(file: File): Promise<{ profileImage: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/users/profile-image`, {
        method: "POST",
        headers,
        body: formData,
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to upload profile image"
      );
    }
  },

  // ==================== SERVICE CATEGORIES ====================

  async getServiceCategories(
    params: {
      skip?: number;
      limit?: number;
      category_type?: ServiceCategoryType;
    } = {}
  ): Promise<ServiceCategory[]> {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/service-categories${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to fetch service categories"
      );
    }
  },

  async getServiceCategory(categoryId: string): Promise<ServiceCategory> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/service-categories/${categoryId}`,
        {
          method: "GET",
          headers: createHeaders(false),
        }
      );
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to fetch service category"
      );
    }
  },

  async createServiceCategory(
    category: ServiceCategoryCreate
  ): Promise<ServiceCategory> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-categories`, {
        method: "POST",
        headers: createHeaders(true),
        body: JSON.stringify(category),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to create service category"
      );
    }
  },

  async updateServiceCategory(
    categoryId: string,
    update: ServiceCategoryUpdate
  ): Promise<ServiceCategory> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/service-categories/${categoryId}`,
        {
          method: "PUT",
          headers: createHeaders(true),
          body: JSON.stringify(update),
        }
      );
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to update service category"
      );
    }
  },

  async deleteServiceCategory(
    categoryId: string
  ): Promise<{ message: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/service-categories/${categoryId}`,
        {
          method: "DELETE",
          headers: createHeaders(true),
        }
      );
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to delete service category"
      );
    }
  },

  async uploadServiceCategoryImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/service-categories/image`, {
        method: "POST",
        headers,
        body: formData,
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to upload category image"
      );
    }
  },

  // ==================== SERVICE TIERS ====================

  async getServiceTiers(
    params: {
      skip?: number;
      limit?: number;
      category_id?: string;
    } = {}
  ): Promise<ServiceTier[]> {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/service-tiers${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch service tiers");
    }
  },

  async getServiceTier(tierId: string): Promise<ServiceTier> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-tiers/${tierId}`, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch service tier");
    }
  },

  async createServiceTier(tier: ServiceTierCreate): Promise<ServiceTier> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-tiers`, {
        method: "POST",
        headers: createHeaders(true),
        body: JSON.stringify(tier),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to create service tier");
    }
  },

  async updateServiceTier(
    tierId: string,
    update: ServiceTierUpdate
  ): Promise<ServiceTier> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-tiers/${tierId}`, {
        method: "PUT",
        headers: createHeaders(true),
        body: JSON.stringify(update),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to update service tier");
    }
  },

  async deleteServiceTier(tierId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-tiers/${tierId}`, {
        method: "DELETE",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to delete service tier");
    }
  },

  async uploadServiceTierImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/service-tiers/image`, {
        method: "POST",
        headers,
        body: formData,
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to upload tier image");
    }
  },

  async convertTierPrice(
    tierId: string,
    currency: string
  ): Promise<CurrencyConversionResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/service-tiers/${tierId}/convert?currency=${currency}`,
        {
          method: "GET",
          headers: createHeaders(false),
        }
      );
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to convert tier price");
    }
  },

  // ==================== SERVICES ====================

  async getServices(
    params: {
      skip?: number;
      limit?: number;
      category_id?: string;
      tier_id?: string;
    } = {}
  ): Promise<Service[]> {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/services${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch services");
    }
  },

  async getService(serviceId: string): Promise<Service> {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch service");
    }
  },

  async createService(service: ServiceCreate): Promise<Service> {
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: createHeaders(true),
        body: JSON.stringify(service),
      });
      console.log(response);
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to create service");
    }
  },

  async updateService(
    serviceId: string,
    update: ServiceUpdate
  ): Promise<Service> {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: "PUT",
        headers: createHeaders(true),
        body: JSON.stringify(update),
      });
      console.log(response);
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to update service");
    }
  },

  async deleteService(serviceId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: "DELETE",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to delete service");
    }
  },

  async uploadServiceImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/services/image`, {
        method: "POST",
        headers,
        body: formData,
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to upload service image"
      );
    }
  },

  // ==================== BOOKINGS ====================

  async getBookings(
    params: {
      skip?: number;
      limit?: number;
      status?: string;
      booking_type?: BookingType;
    } = {}
  ): Promise<Booking[]> {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/bookings${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch bookings");
    }
  },

  async getMyBookings(
    params: {
      skip?: number;
      limit?: number;
      status?: string;
      booking_type?: BookingType;
    } = {}
  ): Promise<Booking[]> {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/users/me/bookings`;

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch bookings");
    }
  },

  async getBooking(bookingId: string): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: "GET",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch booking");
    }
  },

  async createBooking(booking: BookingCreate): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: createHeaders(true),
        body: JSON.stringify(booking),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to create booking");
    }
  },

  async updateBooking(
    bookingId: string,
    update: BookingUpdate
  ): Promise<Booking> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: createHeaders(true),
          body: JSON.stringify(update),
        }
      );
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to update booking");
    }
  },

  async deleteBooking(bookingId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: createHeaders(true),
        }
      );
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to delete booking");
    }
  },

  // TIER BOOKING WITH MULTI-CURRENCY SUPPORT
  async createTierBooking(
    bookingRequest: TierBookingRequest
  ): Promise<Booking> {
    try {
      console.log("Creating tier booking with data:", bookingRequest);

      const response = await fetch(`${API_BASE_URL}/bookings/tier`, {
        method: "POST",
        headers: createHeaders(true),
        body: JSON.stringify(bookingRequest),
      });

      const result = await handleResponse(response);
      console.log("Tier booking response:", result);

      return result;
    } catch (error: any) {
      console.error("Tier booking creation error:", error);
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to create tier booking");
    }
  },

  // AIRTABLE BOOKING
  async createAirtableBooking(booking: AirtableBookingForm): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/airtable`, {
        method: "POST",
        headers: createHeaders(true),
        body: JSON.stringify(booking),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to create Airtable booking"
      );
    }
  },

  // ==================== CRM CLIENTS ====================

  async getCRMClients(
    params: {
      skip?: number;
      limit?: number;
      status?: string;
    } = {}
  ): Promise<CRMClient[]> {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/crm/clients${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch CRM clients");
    }
  },

  async getCRMClient(clientId: string): Promise<CRMClient> {
    try {
      const response = await fetch(`${API_BASE_URL}/crm/clients/${clientId}`, {
        method: "GET",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch CRM client");
    }
  },

  async createCRMClient(client: CRMClientCreate): Promise<CRMClient> {
    try {
      const response = await fetch(`${API_BASE_URL}/crm/clients`, {
        method: "POST",
        headers: createHeaders(true),
        body: JSON.stringify(client),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to create CRM client");
    }
  },

  async updateCRMClient(
    clientId: string,
    update: CRMClientUpdate
  ): Promise<CRMClient> {
    try {
      const response = await fetch(`${API_BASE_URL}/crm/clients/${clientId}`, {
        method: "PUT",
        headers: createHeaders(true),
        body: JSON.stringify(update),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to update CRM client");
    }
  },

  async deleteCRMClient(clientId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/crm/clients/${clientId}`, {
        method: "DELETE",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to delete CRM client");
    }
  },

  // ==================== GALLERY ====================

  async getGallery(
    params: {
      skip?: number;
      limit?: number;
      category?: string;
      tag?: string;
    } = {}
  ): Promise<GalleryImage[]> {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/gallery${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to fetch gallery images"
      );
    }
  },

  async getGalleryImage(imageId: string): Promise<GalleryImage> {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/${imageId}`, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch gallery image");
    }
  },

  // Fixed createGalleryImage method to match backend signature
  async createGalleryImage(
    title: string,
    category: string,
    file: File,
    description?: string,
    tags?: string
  ): Promise<GalleryImage> {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("file", file);
      if (description) formData.append("description", description);
      if (tags) formData.append("tags", tags);

      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: "POST",
        headers,
        body: formData,
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to create gallery image"
      );
    }
  },

  async updateGalleryImage(
    imageId: string,
    update: GalleryImageUpdate
  ): Promise<GalleryImage> {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/${imageId}`, {
        method: "PUT",
        headers: createHeaders(true),
        body: JSON.stringify(update),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to update gallery image"
      );
    }
  },

  async deleteGalleryImage(imageId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/${imageId}`, {
        method: "DELETE",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to delete gallery image"
      );
    }
  },

  async updateGalleryImageFile(
    imageId: string,
    file: File
  ): Promise<{ image_url: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/gallery/${imageId}/image`, {
        method: "POST",
        headers,
        body: formData,
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to update gallery image file"
      );
    }
  },

  // ==================== BLOGS ====================

  async getBlogs(
    params: {
      skip?: number;
      limit?: number;
      tag?: string;
    } = {}
  ): Promise<Blog[]> {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/blogs${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch blogs");
    }
  },

  async getBlog(blogId: string): Promise<Blog> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch blog");
    }
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/blog/${slug}`, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch blog by slug");
    }
  },

  async createBlog(blog: BlogCreate): Promise<Blog> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        headers: createHeaders(true),
        body: JSON.stringify(blog),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to create blog");
    }
  },

  async updateBlog(blogId: string, update: BlogUpdate): Promise<Blog> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: "PUT",
        headers: createHeaders(true),
        body: JSON.stringify(update),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to update blog");
    }
  },

  async deleteBlog(blogId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: "DELETE",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to delete blog");
    }
  },

  async uploadBlogImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/blogs/image`, {
        method: "POST",
        headers,
        body: formData,
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to upload blog image");
    }
  },

  // ==================== EMERGENCY ALERTS ====================

  async getEmergencyAlerts(
    params: {
      skip?: number;
      limit?: number;
      status?: string;
    } = {}
  ): Promise<EmergencyAlert[]> {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/emergency-alerts${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to fetch emergency alerts"
      );
    }
  },

  async createEmergencyAlert(
    alert: EmergencyAlertCreate
  ): Promise<EmergencyAlert> {
    try {
      const response = await fetch(`${API_BASE_URL}/emergency-alerts`, {
        method: "POST",
        headers: createHeaders(true),
        body: JSON.stringify(alert),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to create emergency alert"
      );
    }
  },

  async updateEmergencyAlert(
    alertId: string,
    update: EmergencyAlertUpdate
  ): Promise<EmergencyAlert> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/emergency-alerts/${alertId}`,
        {
          method: "PUT",
          headers: createHeaders(true),
          body: JSON.stringify(update),
        }
      );
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to update emergency alert"
      );
    }
  },

  // ==================== CONTACT ====================

  async sendContactMessage(
    message: ContactMessage
  ): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: createHeaders(false),
        body: JSON.stringify(message),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to send contact message"
      );
    }
  },

  // ==================== ADMIN STATS ====================

  async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: "GET",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch admin stats");
    }
  },

  async getChartData(
    timeframe: Timeframe = Timeframe.weekly
  ): Promise<ChartDataResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/chart-data?timeframe=${timeframe}`,
        {
          method: "GET",
          headers: createHeaders(true),
        }
      );
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch chart data");
    }
  },

  // ==================== NEWSLETTER ====================

  async subscribeToNewsletter(email: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: createHeaders(false),
        body: JSON.stringify({ email }),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to subscribe to newsletter"
      );
    }
  },

  async unsubscribeFromNewsletter(email: string): Promise<{ message: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);

      const response = await fetch(`${API_BASE_URL}/newsletter/unsubscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to unsubscribe from newsletter"
      );
    }
  },

  // ==================== EXCHANGE RATES & PAYMENTS ====================

  async getExchangeRates(): Promise<ExchangeRatesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/exchange-rates`, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to fetch exchange rates"
      );
    }
  },

  async verifyPayment(txRef: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/verify/${txRef}`, {
        method: "GET",
        headers: createHeaders(true),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to verify payment");
    }
  },

  // ==================== PAYMENT SUCCESS/FAILURE PAGES ====================

  async getPaymentSuccess(txRef?: string): Promise<any> {
    try {
      const url = `${API_BASE_URL}/booking/payment-success${
        txRef ? `?tx_ref=${txRef}` : ""
      }`;
      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to get payment success");
    }
  },

  async getPaymentFailed(txRef?: string): Promise<any> {
    try {
      const url = `${API_BASE_URL}/booking/payment-failed${
        txRef ? `?tx_ref=${txRef}` : ""
      }`;
      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to get payment failed");
    }
  },

  // ==================== MEMBERSHIPS ====================

  async getMemberships(
    params: {
      skip?: number;
      limit?: number;
    } = {}
  ): Promise<Membership[]> {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/memberships${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(false),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch memberships");
    }
  },

  async getMembership(membershipId: string): Promise<Membership> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/memberships/${membershipId}`,
        {
          method: "GET",
          headers: createHeaders(false),
        }
      );
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to fetch membership");
    }
  },

  async createMembership(membership: MembershipCreate): Promise<Membership> {
    try {
      const response = await fetch(`${API_BASE_URL}/memberships`, {
        method: "POST",
        headers: createHeaders(true),
        body: JSON.stringify(membership),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, error.message || "Failed to create membership");
    }
  },

  // ==================== USER MEMBERSHIPS ====================

  async getUserMemberships(userId: string): Promise<UserMembership[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${userId}/memberships`,
        {
          method: "GET",
          headers: createHeaders(true),
        }
      );
      return handleResponse(response);
    } catch (error: any) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        500,
        error.message || "Failed to fetch user memberships"
      );
    }
  },
};

// Export default
export default apiClient;
