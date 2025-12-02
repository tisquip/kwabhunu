import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/header"
import { ReceiptsTable } from "@/components/admin/receipts/receipts-table"
import { CreateReceiptDialog } from "@/components/admin/receipts/create-receipt-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default async function ReceiptsPage() {
  const supabase = await createClient()

  const [receiptsResult, vehiclesResult, motorPartsResult] = await Promise.all([
    supabase
      .from("purchase_receipts")
      .select(
        `
        *,
        vehicle:vehicles(
          id,
          licence_plate_no,
          owner:clients!vehicles_owner_id_fkey(full_name, email),
          vehicle_type:vehicle_types(name, model, year)
        ),
        items:purchase_receipt_items(
          id,
          quantity,
          unit_price,
          motor_part:motor_parts(id, oem_part_number, name)
        )
      `,
      )
      .order("created_at", { ascending: false }),
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
    supabase.from("motor_parts").select("id, oem_part_number, name, price").order("name"),
  ])

  return (
    <>
      <AdminHeader title="Purchase Receipts" />
      <div className="flex-1 p-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-orange-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-foreground">Purchase Receipts</CardTitle>
                <p className="text-sm text-muted-foreground">Record parts sold to vehicles</p>
              </div>
            </div>
            <CreateReceiptDialog vehicles={vehiclesResult.data || []} motorParts={motorPartsResult.data || []} />
          </CardHeader>
          <CardContent>
            {receiptsResult.error ? (
              <p className="text-destructive">Error loading receipts</p>
            ) : (
              <ReceiptsTable receipts={receiptsResult.data || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
