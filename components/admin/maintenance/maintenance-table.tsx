"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Search, CheckCircle } from "lucide-react"
import { EditMaintenanceDialog } from "./edit-maintenance-dialog"
import { DeleteMaintenanceDialog } from "./delete-maintenance-dialog"
import { MarkCompletedDialog } from "./mark-completed-dialog"

interface Maintenance {
  id: string
  vehicle_id: string
  current_mileage: number
  date_of_next_maintenance: string
  date_actually_maintained: string | null
  created_at: string
  vehicle: {
    id: string
    licence_plate_no: string
    owner: {
      id: string
      full_name: string
      email: string
      phone_number: string
    }
    vehicle_type: { name: string; model: string; year: number }
  }
}

interface Vehicle {
  id: string
  licence_plate_no: string
  owner: { full_name: string }
  vehicle_type: { name: string; model: string; year: number }
}

interface Props {
  maintenance: Maintenance[]
  vehicles: Vehicle[]
}

export function MaintenanceTable({ maintenance, vehicles }: Props) {
  const [search, setSearch] = useState("")
  const [editItem, setEditItem] = useState<Maintenance | null>(null)
  const [deleteItem, setDeleteItem] = useState<Maintenance | null>(null)
  const [completeItem, setCompleteItem] = useState<Maintenance | null>(null)

  const filtered = maintenance.filter(
    (m) =>
      m.vehicle?.licence_plate_no.toLowerCase().includes(search.toLowerCase()) ||
      m.vehicle?.owner?.full_name.toLowerCase().includes(search.toLowerCase()),
  )

  const getStatus = (m: Maintenance) => {
    if (m.date_actually_maintained) return "completed"
    const today = new Date()
    const dueDate = new Date(m.date_of_next_maintenance)
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return "overdue"
    if (diffDays <= 7) return "upcoming"
    return "scheduled"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Completed</Badge>
      case "overdue":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Overdue</Badge>
      case "upcoming":
        return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">Upcoming</Badge>
      default:
        return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">Scheduled</Badge>
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search maintenance..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No maintenance records found</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-foreground">Vehicle</TableHead>
                <TableHead className="text-foreground">Owner</TableHead>
                <TableHead className="text-foreground text-right">Mileage</TableHead>
                <TableHead className="text-foreground">Due Date</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => {
                const status = getStatus(m)
                return (
                  <TableRow key={m.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{m.vehicle?.licence_plate_no}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.vehicle?.vehicle_type?.name} {m.vehicle?.vehicle_type?.model}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.vehicle?.owner?.full_name}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {m.current_mileage.toLocaleString()} km
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{formatDate(m.date_of_next_maintenance)}</p>
                        {m.date_actually_maintained && (
                          <p className="text-xs text-green-500">Done: {formatDate(m.date_actually_maintained)}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {status !== "completed" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCompleteItem(m)}
                            className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                            title="Mark as completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditItem(m)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteItem(m)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {editItem && (
        <EditMaintenanceDialog
          maintenance={editItem}
          vehicles={vehicles}
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
        />
      )}

      {deleteItem && (
        <DeleteMaintenanceDialog
          maintenance={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      )}

      {completeItem && (
        <MarkCompletedDialog
          maintenance={completeItem}
          open={!!completeItem}
          onOpenChange={(open) => !open && setCompleteItem(null)}
        />
      )}
    </div>
  )
}
