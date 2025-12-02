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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Maintenance {
  id: string
  vehicle_id: string
  current_mileage: number
  date_of_next_maintenance: string
  date_actually_maintained: string | null
}

interface Vehicle {
  id: string
  licence_plate_no: string
  owner: { full_name: string }
  vehicle_type: { name: string; model: string; year: number }
}

interface Props {
  maintenance: Maintenance
  vehicles: Vehicle[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMaintenanceDialog({ maintenance, vehicles, open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vehicleId, setVehicleId] = useState(maintenance.vehicle_id)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      vehicle_id: vehicleId,
      current_mileage: Number.parseInt(formData.get("current_mileage") as string),
      date_of_next_maintenance: formData.get("date_of_next_maintenance") as string,
      updated_at: new Date().toISOString(),
    }

    const supabase = createClient()
    const { error } = await supabase.from("next_maintenance").update(data).eq("id", maintenance.id)

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Maintenance</DialogTitle>
          <DialogDescription>Update the maintenance schedule details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Vehicle</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.licence_plate_no} - {v.owner?.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="current_mileage">Current Mileage (km)</Label>
              <Input
                id="current_mileage"
                name="current_mileage"
                type="number"
                min="0"
                defaultValue={maintenance.current_mileage}
                required
                className="bg-input border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date_of_next_maintenance">Next Maintenance Date</Label>
              <Input
                id="date_of_next_maintenance"
                name="date_of_next_maintenance"
                type="date"
                defaultValue={maintenance.date_of_next_maintenance}
                required
                className="bg-input border-border"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#F41B1A] hover:bg-[#F41B1A]/90 text-white" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
