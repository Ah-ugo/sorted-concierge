import type { Booking, Service, User } from "./api"

interface AirtableConfig {
  apiKey: string
  baseId: string
  tableName: string
}

class AirtableService {
  private config: AirtableConfig | null = null

  constructor() {
    // Initialize with environment variables if available
    if (process.env.NEXT_PUBLIC_AIRTABLE_API_KEY && process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID) {
      this.config = {
        apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
        baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID,
        tableName: process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME || "Bookings",
      }
    }
  }

  async createBookingRecord(booking: Booking, service: Service, user: User, token: string): Promise<boolean> {
    if (!this.config) {
      console.error("Airtable configuration is missing")
      return false
    }

    try {
      // Format the booking data for Airtable
      const bookingData = {
        fields: {
          BookingID: booking.id,
          ServiceName: service.name,
          ServiceCategory: service.category,
          Price: service.price,
          CustomerName: `${user.firstName} ${user.lastName}`,
          CustomerEmail: user.email,
          CustomerPhone: user.phone || "Not provided",
          BookingDate: booking.bookingDate,
          Status: booking.status,
          SpecialRequests: booking.specialRequests || "None",
          CreatedAt: booking.createdAt,
        },
      }

      // Make the API request to Airtable
      const response = await fetch(`https://api.airtable.com/v0/${this.config.baseId}/${this.config.tableName}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`)
      }

      // Also send the record to our backend for webhook processing
      await fetch("/api/webhooks/airtable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking: booking,
          service: service,
          user: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
          },
        }),
      })

      return true
    } catch (error) {
      console.error("Error creating Airtable record:", error)
      return false
    }
  }

  async updateBookingRecord(bookingId: string, data: any): Promise<boolean> {
    if (!this.config) {
      console.error("Airtable configuration is missing")
      return false
    }

    try {
      // First, find the record in Airtable by BookingID
      const searchResponse = await fetch(
        `https://api.airtable.com/v0/${this.config.baseId}/${
          this.config.tableName
        }?filterByFormula={BookingID}="${bookingId}"`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
        },
      )

      if (!searchResponse.ok) {
        throw new Error(`Airtable API error: ${searchResponse.status}`)
      }

      const searchResult = await searchResponse.json()
      if (!searchResult.records || searchResult.records.length === 0) {
        throw new Error("Booking record not found in Airtable")
      }

      const recordId = searchResult.records[0].id

      // Update the record
      const updateResponse = await fetch(
        `https://api.airtable.com/v0/${this.config.baseId}/${this.config.tableName}/${recordId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: data,
          }),
        },
      )

      if (!updateResponse.ok) {
        throw new Error(`Airtable API error: ${updateResponse.status}`)
      }

      return true
    } catch (error) {
      console.error("Error updating Airtable record:", error)
      return false
    }
  }
}

export const airtableService = new AirtableService()
