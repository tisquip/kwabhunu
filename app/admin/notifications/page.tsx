import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/header"
import { NotificationSettings } from "@/components/admin/notifications/notification-settings"
import { NotificationLogs } from "@/components/admin/notifications/notification-logs"
import { SendNotificationsButton } from "@/components/admin/notifications/send-notifications-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Settings } from "lucide-react"

export default async function NotificationsPage() {
  const supabase = await createClient()

  const [typesResult, logsResult] = await Promise.all([
    supabase.from("notification_types").select("*").order("name"),
    supabase
      .from("notification_logs")
      .select(
        `
        *,
        notification_type:notification_types(name),
        maintenance:next_maintenance(
          id,
          date_of_next_maintenance,
          vehicle:vehicles(
            licence_plate_no,
            owner:clients!vehicles_owner_id_fkey(full_name, email)
          )
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(50),
  ])

  return (
    <>
      <AdminHeader title="Notifications" />
      <div className="flex-1 p-6 space-y-6">
        {/* Notification Settings */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-yellow-500">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-foreground">Notification Settings</CardTitle>
                <p className="text-sm text-muted-foreground">Configure notification channels</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <NotificationSettings types={typesResult.data || []} />
          </CardContent>
        </Card>

        {/* Send Notifications */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-[#F41B1A]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-foreground">Send Notifications</CardTitle>
                <p className="text-sm text-muted-foreground">Manually trigger maintenance reminders</p>
              </div>
            </div>
            <SendNotificationsButton />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Click the button to send email reminders to clients with upcoming maintenance. Notifications are sent 7
              days before, 1 day before, and on the maintenance date.
            </p>
          </CardContent>
        </Card>

        {/* Notification Logs */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-blue-500">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-foreground">Notification History</CardTitle>
                <p className="text-sm text-muted-foreground">Recent notification activity</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <NotificationLogs logs={logsResult.data || []} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
