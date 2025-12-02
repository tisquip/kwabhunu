import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { NotificationService } from "@/lib/notifications/notification-service"

export async function POST() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get active notification types
  const { data: activeTypes } = await supabase.from("notification_types").select("name").eq("is_active", true)

  const activeChannels = activeTypes?.map((t) => t.name) || ["email"]

  // Get maintenance records that need notifications
  // (7 days before, 1 day before, or same day)
  const today = new Date()
  const dates = [
    { daysUntil: 0, date: today },
    { daysUntil: 1, date: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    { daysUntil: 7, date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) },
  ]

  const notificationService = new NotificationService()
  let totalSent = 0
  let totalErrors = 0

  for (const { daysUntil, date } of dates) {
    const dateStr = date.toISOString().split("T")[0]

    // Get maintenance records for this date that haven't been completed
    const { data: maintenanceRecords } = await supabase
      .from("next_maintenance")
      .select(`
        id,
        date_of_next_maintenance,
        vehicle:vehicles(
          licence_plate_no,
          owner:clients!vehicles_owner_id_fkey(full_name, email, phone_number),
          vehicle_type:vehicle_types(name, model, year)
        )
      `)
      .eq("date_of_next_maintenance", dateStr)
      .is("date_actually_maintained", null)

    if (!maintenanceRecords || maintenanceRecords.length === 0) continue

    // Check if notification was already sent for this date/maintenance
    for (const maintenance of maintenanceRecords) {
      const { data: existingLog } = await supabase
        .from("notification_logs")
        .select("id")
        .eq("maintenance_id", maintenance.id)
        .eq("days_before", daysUntil)
        .single()

      if (existingLog) continue // Already sent

      const result = await notificationService.sendMaintenanceReminder(maintenance as any, daysUntil, activeChannels)

      totalSent += result.sent
      totalErrors += result.errors
    }
  }

  return NextResponse.json({ sent: totalSent, errors: totalErrors })
}
