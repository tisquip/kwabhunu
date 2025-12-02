import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Car, Package, Wrench, FileText, Calendar } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch counts for dashboard
  const [clients, vehicles, vehicleTypes, motorParts, receipts, maintenance] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("vehicles").select("id", { count: "exact", head: true }),
    supabase.from("vehicle_types").select("id", { count: "exact", head: true }),
    supabase.from("motor_parts").select("id", { count: "exact", head: true }),
    supabase.from("purchase_receipts").select("id", { count: "exact", head: true }),
    supabase.from("next_maintenance").select("id", { count: "exact", head: true }),
  ])

  // Get upcoming maintenance (next 7 days)
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const { data: upcomingMaintenance } = await supabase
    .from("next_maintenance")
    .select(
      `
      *,
      vehicle:vehicles(
        licence_plate_no,
        owner:clients!vehicles_owner_id_fkey(full_name, email, phone_number),
        vehicle_type:vehicle_types(name, model, year)
      )
    `,
    )
    .gte("date_of_next_maintenance", today.toISOString().split("T")[0])
    .lte("date_of_next_maintenance", nextWeek.toISOString().split("T")[0])
    .is("date_actually_maintained", null)
    .order("date_of_next_maintenance", { ascending: true })
    .limit(5)

  const stats = [
    {
      label: "Clients",
      value: clients.count || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Vehicles",
      value: vehicles.count || 0,
      icon: Car,
      color: "text-green-500",
    },
    {
      label: "Vehicle Types",
      value: vehicleTypes.count || 0,
      icon: Car,
      color: "text-yellow-500",
    },
    {
      label: "Motor Parts",
      value: motorParts.count || 0,
      icon: Package,
      color: "text-purple-500",
    },
    {
      label: "Receipts",
      value: receipts.count || 0,
      icon: FileText,
      color: "text-orange-500",
    },
    {
      label: "Maintenance",
      value: maintenance.count || 0,
      icon: Wrench,
      color: "text-[#F41B1A]",
    },
  ]

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="flex-1 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Maintenance */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-[#F41B1A]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-foreground">Upcoming Maintenance</CardTitle>
              <p className="text-sm text-muted-foreground">Next 7 days</p>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingMaintenance && upcomingMaintenance.length > 0 ? (
              <div className="space-y-4">
                {upcomingMaintenance.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div>
                      <p className="font-medium text-foreground">{m.vehicle?.licence_plate_no}</p>
                      <p className="text-sm text-muted-foreground">
                        {m.vehicle?.vehicle_type?.name} {m.vehicle?.vehicle_type?.model} (
                        {m.vehicle?.vehicle_type?.year})
                      </p>
                      <p className="text-sm text-muted-foreground">Owner: {m.vehicle?.owner?.full_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#F41B1A]">
                        {new Date(m.date_of_next_maintenance).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">{m.current_mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No upcoming maintenance scheduled for the next 7 days
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
