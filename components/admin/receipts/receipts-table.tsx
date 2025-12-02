"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Trash2, Search } from "lucide-react"
import { ViewReceiptDialog } from "./view-receipt-dialog"
import { DeleteReceiptDialog } from "./delete-receipt-dialog"

interface Receipt {
  id: string
  vehicle_id: string
  total_amount: number
  created_at: string
  vehicle: {
    id: string
    licence_plate_no: string
    owner: { full_name: string; email: string }
    vehicle_type: { name: string; model: string; year: number }
  }
  items: {
    id: string
    quantity: number
    unit_price: number
    motor_part: { id: string; oem_part_number: string; name: string }
  }[]
}

export function ReceiptsTable({ receipts }: { receipts: Receipt[] }) {
  const [search, setSearch] = useState("")
  const [viewItem, setViewItem] = useState<Receipt | null>(null)
  const [deleteItem, setDeleteItem] = useState<Receipt | null>(null)

  const filtered = receipts.filter(
    (r) =>
      r.vehicle?.licence_plate_no.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicle?.owner?.full_name.toLowerCase().includes(search.toLowerCase()),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search receipts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No receipts found</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-foreground">Date</TableHead>
                <TableHead className="text-foreground">Vehicle</TableHead>
                <TableHead className="text-foreground">Owner</TableHead>
                <TableHead className="text-foreground text-center">Items</TableHead>
                <TableHead className="text-foreground text-right">Total</TableHead>
                <TableHead className="text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/50">
                  <TableCell className="text-muted-foreground">{formatDate(r.created_at)}</TableCell>
                  <TableCell className="font-medium text-foreground">{r.vehicle?.licence_plate_no}</TableCell>
                  <TableCell className="text-muted-foreground">{r.vehicle?.owner?.full_name}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{r.items?.length || 0}</TableCell>
                  <TableCell className="text-right font-medium text-[#F41B1A]">{formatPrice(r.total_amount)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewItem(r)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteItem(r)}
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

      {viewItem && (
        <ViewReceiptDialog receipt={viewItem} open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)} />
      )}

      {deleteItem && (
        <DeleteReceiptDialog
          receipt={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      )}
    </div>
  )
}
