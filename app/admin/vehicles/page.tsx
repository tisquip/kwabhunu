import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/header"
import { VehiclesTable } from "@/components/admin/vehicles/vehicles-table"
import { CreateVehicleDialog } from "@/components/admin/vehicles/create-vehicle-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car } from "lucide-react"

export default async function VehiclesPage() {
  const supabase = await createClient()

  const [vehiclesResult, clientsResult, vehicleTypesResult] = await Promise.all([
    supabase
      .from("vehicles")
      .select(
        `
        *,
        owner:clients!vehicles_owner_id_fkey(id, full_name, email),
        driver:clients!vehicles_driver_id_fkey(id, full_name, email),
        vehicle_type:vehicle_types(id, name, model, year)
      `,
      )
      .order("created_at", { ascending: false }),
    supabase.from("clients").select("id, full_name, email").order("full_name"),
    supabase.from("vehicle_types").select("id, name, model, year").order("name"),
  ])

  return (
    <>
      <AdminHeader title="Vehicles" />
      <div className="flex-1 p-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-green-500">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-foreground">All Vehicles</CardTitle>
                <p className="text-sm text-muted-foreground">Manage registered vehicles</p>
              </div>
            </div>
            <CreateVehicleDialog clients={clientsResult.data || []} vehicleTypes={vehicleTypesResult.data || []} />
          </CardHeader>
          <CardContent>
            {vehiclesResult.error ? (
              <p className="text-destructive">Error loading vehicles</p>
            ) : (
              <VehiclesTable
                vehicles={vehiclesResult.data || []}
                clients={clientsResult.data || []}
                vehicleTypes={vehicleTypesResult.data || []}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
