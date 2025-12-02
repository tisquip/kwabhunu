"use client"

import { useState } from "react"
import type { VehicleType } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Search } from "lucide-react"
import { EditVehicleTypeDialog } from "./edit-vehicle-type-dialog"
import { DeleteVehicleTypeDialog } from "./delete-vehicle-type-dialog"

export function VehicleTypesTable({
  vehicleTypes,
}: {
  vehicleTypes: VehicleType[]
}) {
  const [search, setSearch] = useState("")
  const [editItem, setEditItem] = useState<VehicleType | null>(null)
  const [deleteItem, setDeleteItem] = useState<VehicleType | null>(null)

  const filtered = vehicleTypes.filter(
    (vt) =>
      vt.name.toLowerCase().includes(search.toLowerCase()) ||
      vt.model.toLowerCase().includes(search.toLowerCase()) ||
      vt.year.toString().includes(search),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search vehicle types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No vehicle types found</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-foreground">Make</TableHead>
                <TableHead className="text-foreground">Model</TableHead>
                <TableHead className="text-foreground">Year</TableHead>
                <TableHead className="text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((vt) => (
                <TableRow key={vt.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{vt.name}</TableCell>
                  <TableCell className="text-muted-foreground">{vt.model}</TableCell>
                  <TableCell className="text-muted-foreground">{vt.year}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditItem(vt)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteItem(vt)}
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
        <EditVehicleTypeDialog
          vehicleType={editItem}
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
        />
      )}

      {deleteItem && (
        <DeleteVehicleTypeDialog
          vehicleType={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      )}
    </div>
  )
}
