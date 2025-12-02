import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/header"
import { MotorPartsTable } from "@/components/admin/motor-parts/motor-parts-table"
import { CreateMotorPartDialog } from "@/components/admin/motor-parts/create-motor-part-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"

export default async function MotorPartsPage() {
  const supabase = await createClient()
  const { data: motorParts, error } = await supabase.from("motor_parts").select("*").order("name", { ascending: true })

  return (
    <>
      <AdminHeader title="Motor Parts" />
      <div className="flex-1 p-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-purple-500">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-foreground">Motor Parts</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your parts inventory</p>
              </div>
            </div>
            <CreateMotorPartDialog />
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-destructive">Error loading motor parts</p>
            ) : (
              <MotorPartsTable motorParts={motorParts || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
