import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/header"
import { VehicleTypesTable } from "@/components/admin/vehicle-types/vehicle-types-table"
import { CreateVehicleTypeDialog } from "@/components/admin/vehicle-types/create-vehicle-type-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CarFront } from "lucide-react"

export default async function VehicleTypesPage() {
  const supabase = await createClient()
  const { data: vehicleTypes, error } = await supabase
    .from("vehicle_types")
    .select("*")
    .order("name", { ascending: true })

  return (
    <>
      <AdminHeader title="Vehicle Types" />
      <div className="flex-1 p-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-yellow-500">
                <CarFront className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-foreground">Vehicle Types</CardTitle>
                <p className="text-sm text-muted-foreground">Manage vehicle makes, models and years</p>
              </div>
            </div>
            <CreateVehicleTypeDialog />
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-destructive">Error loading vehicle types</p>
            ) : (
              <VehicleTypesTable vehicleTypes={vehicleTypes || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
