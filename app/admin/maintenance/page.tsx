import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/header"
import { MaintenanceTable } from "@/components/admin/maintenance/maintenance-table"
import { CreateMaintenanceDialog } from "@/components/admin/maintenance/create-maintenance-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench } from "lucide-react"

export default async function MaintenancePage() {
  const supabase = await createClient()

  const [maintenanceResult, vehiclesResult] = await Promise.all([
    supabase
      .from("next_maintenance")
      .select(
        `
        *,
        vehicle:vehicles(
          id,
          licence_plate_no,
          owner:clients!vehicles_owner_id_fkey(id, full_name, email, phone_number),
          vehicle_type:vehicle_types(name, model, year)
        )
      `,
      )
      .order("date_of_next_maintenance", { ascending: true }),
    supabase
      .from("vehicles")
      .select(
        `
        id,
        licence_plate_no,
        owner:clients!vehicles_owner_id_fkey(full_name),
        vehicle_type:vehicle_types(name, model, year)
      `,
      )
      .order("licence_plate_no"),
  ])

  return (
    <>
      <AdminHeader title="Maintenance" />
      <div className="flex-1 p-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-[#F41B1A]">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-foreground">Maintenance Schedule</CardTitle>
                <p className="text-sm text-muted-foreground">Track upcoming and completed maintenance</p>
              </div>
            </div>
            <CreateMaintenanceDialog vehicles={vehiclesResult.data || []} />
          </CardHeader>
          <CardContent>
            {maintenanceResult.error ? (
              <p className="text-destructive">Error loading maintenance</p>
            ) : (
              <MaintenanceTable maintenance={maintenanceResult.data || []} vehicles={vehiclesResult.data || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
