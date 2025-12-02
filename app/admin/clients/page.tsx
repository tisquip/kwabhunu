import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/header"
import { ClientsTable } from "@/components/admin/clients/clients-table"
import { CreateClientDialog } from "@/components/admin/clients/create-client-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

  return (
    <>
      <AdminHeader title="Clients" />
      <div className="flex-1 p-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-blue-500">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-foreground">All Clients</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your client database</p>
              </div>
            </div>
            <CreateClientDialog />
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-destructive">Error loading clients</p>
            ) : (
              <ClientsTable clients={clients || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
