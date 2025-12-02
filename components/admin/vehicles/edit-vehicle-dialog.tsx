"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Vehicle, Client, VehicleType } from "@/lib/types"
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

interface Props {
  vehicle: Vehicle & {
    owner: Pick<Client, "id" | "full_name" | "email">
    driver: Pick<Client, "id" | "full_name" | "email"> | null
    vehicle_type: Pick<VehicleType, "id" | "name" | "model" | "year">
  }
  clients: Pick<Client, "id" | "full_name" | "email">[]
  vehicleTypes: Pick<VehicleType, "id" | "name" | "model" | "year">[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditVehicleDialog({ vehicle, clients, vehicleTypes, open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ownerId, setOwnerId] = useState(vehicle.owner_id)
  const [driverId, setDriverId] = useState(vehicle.driver_id || "none")
  const [vehicleTypeId, setVehicleTypeId] = useState(vehicle.vehicle_type_id)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      licence_plate_no: formData.get("licence_plate_no") as string,
      owner_id: ownerId,
      driver_id: driverId === "none" ? null : driverId,
      vehicle_type_id: vehicleTypeId,
      updated_at: new Date().toISOString(),
    }

    const supabase = createClient()
    const { error } = await supabase.from("vehicles").update(data).eq("id", vehicle.id)

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
          <DialogTitle className="text-foreground">Edit Vehicle</DialogTitle>
          <DialogDescription>Update the vehicle details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="licence_plate_no">Licence Plate No</Label>
              <Input
                id="licence_plate_no"
                name="licence_plate_no"
                defaultValue={vehicle.licence_plate_no}
                required
                className="bg-input border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Vehicle Type</Label>
              <Select value={vehicleTypeId} onValueChange={setVehicleTypeId}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((vt) => (
                    <SelectItem key={vt.id} value={vt.id}>
                      {vt.name} {vt.model} ({vt.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Owner</Label>
              <Select value={ownerId} onValueChange={setOwnerId}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.full_name} ({c.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Driver (Optional)</Label>
              <Select value={driverId} onValueChange={setDriverId}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No driver assigned</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.full_name} ({c.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
