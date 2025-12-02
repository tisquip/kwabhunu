// Notification Service - Extensible architecture for multiple notification channels
// Currently supports email via Supabase, designed to easily add WhatsApp, SMS, etc.

import { createClient } from "@/lib/supabase/server"

export interface NotificationChannel {
  name: string
  send(recipient: NotificationRecipient, message: NotificationMessage): Promise<boolean>
}

export interface NotificationRecipient {
  email: string
  phone?: string
  full_name: string
}

export interface NotificationMessage {
  subject: string
  body: string
  maintenance_id: string
  days_before: number
}

// Email channel implementation using Supabase
export class EmailNotificationChannel implements NotificationChannel {
  name = "email"

  async send(recipient: NotificationRecipient, message: NotificationMessage): Promise<boolean> {
    const supabase = await createClient()

    // Use Supabase's built-in email functionality through Edge Functions
    // For production, you would integrate with a proper email service
    // like Resend, SendGrid, or Postmark

    // Log the notification attempt
    const { error } = await supabase.from("notification_logs").insert({
      maintenance_id: message.maintenance_id,
      notification_type_id: await this.getTypeId(supabase),
      status: "sent",
      days_before: message.days_before,
      message: `Email to ${recipient.email}: ${message.subject}`,
    })

    if (error) {
      console.error("Failed to log notification:", error)
      return false
    }

    // In production, send actual email here
    console.log(`[Email] Sending to ${recipient.email}:`, message.subject)
    return true
  }

  private async getTypeId(supabase: any): Promise<string> {
    const { data } = await supabase.from("notification_types").select("id").eq("name", "email").single()
    return data?.id
  }
}

// WhatsApp channel placeholder - implement when ready
export class WhatsAppNotificationChannel implements NotificationChannel {
  name = "whatsapp"

  async send(recipient: NotificationRecipient, message: NotificationMessage): Promise<boolean> {
    // Implement WhatsApp integration here
    // Could use Twilio, MessageBird, or direct WhatsApp Business API
    console.log(`[WhatsApp] Would send to ${recipient.phone}:`, message.body)
    return false // Not implemented yet
  }
}

// SMS channel placeholder - implement when ready
export class SMSNotificationChannel implements NotificationChannel {
  name = "sms"

  async send(recipient: NotificationRecipient, message: NotificationMessage): Promise<boolean> {
    // Implement SMS integration here
    // Could use Twilio, Vonage, or other SMS providers
    console.log(`[SMS] Would send to ${recipient.phone}:`, message.body)
    return false // Not implemented yet
  }
}

// Main Notification Service
export class NotificationService {
  private channels: Map<string, NotificationChannel> = new Map()

  constructor() {
    // Register available channels
    this.channels.set("email", new EmailNotificationChannel())
    this.channels.set("whatsapp", new WhatsAppNotificationChannel())
    this.channels.set("sms", new SMSNotificationChannel())
  }

  async sendNotification(
    channelName: string,
    recipient: NotificationRecipient,
    message: NotificationMessage,
  ): Promise<boolean> {
    const channel = this.channels.get(channelName)
    if (!channel) {
      console.error(`Unknown notification channel: ${channelName}`)
      return false
    }
    return channel.send(recipient, message)
  }

  async sendMaintenanceReminder(
    maintenance: {
      id: string
      date_of_next_maintenance: string
      vehicle: {
        licence_plate_no: string
        owner: { full_name: string; email: string; phone_number?: string }
        vehicle_type: { name: string; model: string; year: number }
      }
    },
    daysUntil: number,
    activeChannels: string[],
  ): Promise<{ sent: number; errors: number }> {
    const recipient: NotificationRecipient = {
      email: maintenance.vehicle.owner.email,
      phone: maintenance.vehicle.owner.phone_number,
      full_name: maintenance.vehicle.owner.full_name,
    }

    const vehicleInfo = `${maintenance.vehicle.vehicle_type.name} ${maintenance.vehicle.vehicle_type.model} (${maintenance.vehicle.licence_plate_no})`
    const maintenanceDate = new Date(maintenance.date_of_next_maintenance).toLocaleDateString("en-ZA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    let subject: string
    let body: string

    if (daysUntil === 0) {
      subject = `KwaBhunu: Maintenance Due Today - ${maintenance.vehicle.licence_plate_no}`
      body = `Dear ${recipient.full_name},\n\nThis is a reminder that your vehicle ${vehicleInfo} is due for maintenance TODAY (${maintenanceDate}).\n\nPlease bring your vehicle to KwaBhunu for servicing.\n\nBest regards,\nKwaBhunu Team`
    } else if (daysUntil === 1) {
      subject = `KwaBhunu: Maintenance Due Tomorrow - ${maintenance.vehicle.licence_plate_no}`
      body = `Dear ${recipient.full_name},\n\nThis is a reminder that your vehicle ${vehicleInfo} is due for maintenance TOMORROW (${maintenanceDate}).\n\nPlease prepare your vehicle for servicing.\n\nBest regards,\nKwaBhunu Team`
    } else {
      subject = `KwaBhunu: Upcoming Maintenance - ${maintenance.vehicle.licence_plate_no}`
      body = `Dear ${recipient.full_name},\n\nThis is a reminder that your vehicle ${vehicleInfo} is due for maintenance in ${daysUntil} days (${maintenanceDate}).\n\nPlease plan accordingly to bring your vehicle to KwaBhunu for servicing.\n\nBest regards,\nKwaBhunu Team`
    }

    const message: NotificationMessage = {
      subject,
      body,
      maintenance_id: maintenance.id,
      days_before: daysUntil,
    }

    let sent = 0
    let errors = 0

    for (const channelName of activeChannels) {
      const success = await this.sendNotification(channelName, recipient, message)
      if (success) {
        sent++
      } else {
        errors++
      }
    }

    return { sent, errors }
  }

  // Add new channel dynamically
  addChannel(channel: NotificationChannel) {
    this.channels.set(channel.name, channel)
  }
}
