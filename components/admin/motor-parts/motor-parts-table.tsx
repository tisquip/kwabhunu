"use client"

import { useState } from "react"
import type { MotorPart } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Search } from "lucide-react"
import { EditMotorPartDialog } from "./edit-motor-part-dialog"
import { DeleteMotorPartDialog } from "./delete-motor-part-dialog"

export function MotorPartsTable({ motorParts }: { motorParts: MotorPart[] }) {
  const [search, setSearch] = useState("")
  const [editItem, setEditItem] = useState<MotorPart | null>(null)
  const [deleteItem, setDeleteItem] = useState<MotorPart | null>(null)

  const filtered = motorParts.filter(
    (mp) =>
      mp.name.toLowerCase().includes(search.toLowerCase()) ||
      mp.oem_part_number.toLowerCase().includes(search.toLowerCase()) ||
      mp.description?.toLowerCase().includes(search.toLowerCase()),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search motor parts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No motor parts found</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-foreground">OEM Part No</TableHead>
                <TableHead className="text-foreground">Name</TableHead>
                <TableHead className="text-foreground">Description</TableHead>
                <TableHead className="text-foreground text-right">Price</TableHead>
                <TableHead className="text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((mp) => (
                <TableRow key={mp.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm text-muted-foreground">{mp.oem_part_number}</TableCell>
                  <TableCell className="font-medium text-foreground">{mp.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {mp.description || "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium text-[#F41B1A]">{formatPrice(mp.price)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditItem(mp)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteItem(mp)}
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
        <EditMotorPartDialog
          motorPart={editItem}
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
        />
      )}

      {deleteItem && (
        <DeleteMotorPartDialog
          motorPart={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      )}
    </div>
  )
}
