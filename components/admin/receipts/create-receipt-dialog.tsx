"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface Vehicle {
  id: string
  licence_plate_no: string
  owner: { full_name: string }
  vehicle_type: { name: string; model: string; year: number }
}

interface MotorPart {
  id: string
  oem_part_number: string
  name: string
  price: number
}

interface Props {
  vehicles: Vehicle[]
  motorParts: MotorPart[]
}

interface LineItem {
  motor_part_id: string
  quantity: number
  unit_price: number
}

export function CreateReceiptDialog({ vehicles, motorParts }: Props) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vehicleId, setVehicleId] = useState("")
  const [items, setItems] = useState<LineItem[]>([])
  const router = useRouter()

  const addItem = () => {
    setItems([...items, { motor_part_id: "", quantity: 1, unit_price: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...items]
    if (field === "motor_part_id") {
      const part = motorParts.find((p) => p.id === value)
      updated[index] = {
        ...updated[index],
        motor_part_id: value as string,
        unit_price: part?.price || 0,
      }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setItems(updated)
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicleId || items.length === 0) {
      setError("Please select a vehicle and add at least one item")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    // Create receipt
    const { data: receipt, error: receiptError } = await supabase
      .from("purchase_receipts")
      .insert({
        vehicle_id: vehicleId,
        total_amount: total,
      })
      .select()
      .single()

    if (receiptError) {
      setError(receiptError.message)
      setIsLoading(false)
      return
    }

    // Create receipt items
    const receiptItems = items.map((item) => ({
      receipt_id: receipt.id,
      motor_part_id: item.motor_part_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))

    const { error: itemsError } = await supabase.from("purchase_receipt_items").insert(receiptItems)

    if (itemsError) {
      setError(itemsError.message)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setOpen(false)
    setVehicleId("")
    setItems([])
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F41B1A] hover:bg-[#F41B1A]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create Purchase Receipt</DialogTitle>
          <DialogDescription>Record parts sold to a vehicle.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Vehicle</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.licence_plate_no} - {v.owner?.full_name} ({v.vehicle_type?.name} {v.vehicle_type?.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Parts Sold</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Part
                </Button>
              </div>

              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">
                  No parts added yet. Click &quot;Add Part&quot; to begin.
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <Select value={item.motor_part_id} onValueChange={(v) => updateItem(index, "motor_part_id", v)}>
                        <SelectTrigger className="flex-1 bg-input border-border">
                          <SelectValue placeholder="Select part" />
                        </SelectTrigger>
                        <SelectContent>
                          {motorParts.map((mp) => (
                            <SelectItem key={mp.id} value={mp.id}>
                              {mp.name} ({mp.oem_part_number}) - {formatPrice(mp.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                        className="w-20 bg-input border-border"
                        placeholder="Qty"
                      />
                      <span className="text-sm text-muted-foreground w-24 text-right">
                        {formatPrice(item.quantity * item.unit_price)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-xl font-bold text-[#F41B1A]">{formatPrice(total)}</span>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#F41B1A] hover:bg-[#F41B1A]/90 text-white"
              disabled={isLoading || !vehicleId || items.length === 0}
            >
              {isLoading ? "Creating..." : "Create Receipt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
