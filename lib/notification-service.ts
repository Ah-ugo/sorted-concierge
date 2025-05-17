import type { Booking } from "./api"

interface NotificationOptions {
  channels: {
    email: boolean
    slack: boolean
    whatsapp: boolean
  }
  customMessage?: string
}

class NotificationService {
  async sendBookingNotification(
    booking: Booking,
    token: string,
    options: NotificationOptions = {
      channels: {
        email: true,
        slack: true,
        whatsapp: true,
      },
    },
  ): Promise<boolean> {
    try {
      const notificationData = {
        booking,
        options,
        message: options.customMessage || `New booking received (ID: ${booking.id})`,
      }

      // Send notifications through selected channels
      const promises = []

      if (options.channels.email) {
        promises.push(this.sendEmailNotification(notificationData, token))
      }

      if (options.channels.slack) {
        promises.push(this.sendSlackNotification(notificationData, token))
      }

      if (options.channels.whatsapp) {
        promises.push(this.sendWhatsAppNotification(notificationData, token))
      }

      await Promise.all(promises)
      return true
    } catch (error) {
      console.error("Error sending booking notification:", error)
      return false
    }
  }

  private async sendEmailNotification(data: any, token: string): Promise<boolean> {
    try {
      const response = await fetch("/api/notifications/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Email notification error: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error("Error sending email notification:", error)
      return false
    }
  }

  private async sendSlackNotification(data: any, token: string): Promise<boolean> {
    try {
      const response = await fetch("/api/webhooks/slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Slack notification error: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error("Error sending Slack notification:", error)
      return false
    }
  }

  private async sendWhatsAppNotification(data: any, token: string): Promise<boolean> {
    try {
      const response = await fetch("/api/webhooks/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`WhatsApp notification error: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error)
      return false
    }
  }

  async sendContactFormNotification(name: string, email: string, subject: string, message: string): Promise<boolean> {
    try {
      const notificationData = {
        contact: {
          name,
          email,
          subject,
          message,
        },
        message: `New contact form submission from ${name} (${email})`,
      }

      // Send to all notification channels
      const promises = [
        this.sendEmailNotification(notificationData, ""),
        this.sendSlackNotification(notificationData, ""),
        this.sendWhatsAppNotification(notificationData, ""),
      ]

      await Promise.all(promises)
      return true
    } catch (error) {
      console.error("Error sending contact form notification:", error)
      return false
    }
  }
}

export const notificationService = new NotificationService()
