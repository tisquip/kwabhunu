"use client"

import { useState } from "react"
import type { Vehicle, Client, VehicleType } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Search } from "lucide-react"
import { EditVehicleDialog } from "./edit-vehicle-dialog"
import { DeleteVehicleDialog } from "./delete-vehicle-dialog"

interface Props {
  vehicles: (Vehicle & {
    owner: Pick<Client, "id" | "full_name" | "email">
    driver: Pick<Client, "id" | "full_name" | "email"> | null
    vehicle_type: Pick<VehicleType, "id" | "name" | "model" | "year">
  })[]
  clients: Pick<Client, "id" | "full_name" | "email">[]
  vehicleTypes: Pick<VehicleType, "id" | "name" | "model" | "year">[]
}

export function VehiclesTable({ vehicles, clients, vehicleTypes }: Props) {
  const [search, setSearch] = useState("")
  const [editItem, setEditItem] = useState<(typeof vehicles)[0] | null>(null)
  const [deleteItem, setDeleteItem] = useState<(typeof vehicles)[0] | null>(null)

  const filtered = vehicles.filter(
    (v) =>
      v.licence_plate_no.toLowerCase().includes(search.toLowerCase()) ||
      v.owner?.full_name.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicle_type?.name.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicle_type?.model.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No vehicles found</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-foreground">Licence Plate</TableHead>
                <TableHead className="text-foreground">Vehicle Type</TableHead>
                <TableHead className="text-foreground">Owner</TableHead>
                <TableHead className="text-foreground">Driver</TableHead>
                <TableHead className="text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{v.licence_plate_no}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {v.vehicle_type?.name} {v.vehicle_type?.model} ({v.vehicle_type?.year})
                  </TableCell>
                  <TableCell className="text-muted-foreground">{v.owner?.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{v.driver?.full_name || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditItem(v)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteItem(v)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {editItem && (
        <EditVehicleDialog
          vehicle={editItem}
          clients={clients}
          vehicleTypes={vehicleTypes}
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
        />
      )}

      {deleteItem && (
        <DeleteVehicleDialog
          vehicle={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      )}
    </div>
  )
}
