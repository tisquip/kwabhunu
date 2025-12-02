"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Car } from "lucide-react"

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

interface Props {
  receipt: Receipt
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewReceiptDialog({ receipt, open, onOpenChange }: Props) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-[#F41B1A]">
              <Car className="w-5 h-5" />
            </div>
            Purchase Receipt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium text-foreground">{formatDate(receipt.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicle</p>
              <p className="font-medium text-foreground">{receipt.vehicle?.licence_plate_no}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owner</p>
              <p className="font-medium text-foreground">{receipt.vehicle?.owner?.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicle Type</p>
              <p className="font-medium text-foreground">
                {receipt.vehicle?.vehicle_type?.name} {receipt.vehicle?.vehicle_type?.model} (
                {receipt.vehicle?.vehicle_type?.year})
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="text-foreground">Part</TableHead>
                  <TableHead className="text-foreground">OEM No</TableHead>
                  <TableHead className="text-foreground text-center">Qty</TableHead>
                  <TableHead className="text-foreground text-right">Unit Price</TableHead>
                  <TableHead className="text-foreground text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.items?.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{item.motor_part?.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {item.motor_part?.oem_part_number}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{item.quantity}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatPrice(item.unit_price)}</TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatPrice(item.quantity * item.unit_price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#1A103E]">
            <span className="font-medium text-white">Total Amount</span>
            <span className="text-2xl font-bold text-[#F41B1A]">{formatPrice(receipt.total_amount)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
