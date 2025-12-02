"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Client, VehicleType } from "@/lib/types"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface Props {
  clients: Pick<Client, "id" | "full_name" | "email">[]
  vehicleTypes: Pick<VehicleType, "id" | "name" | "model" | "year">[]
}

export function CreateVehicleDialog({ clients, vehicleTypes }: Props) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ownerId, setOwnerId] = useState("")
  const [driverId, setDriverId] = useState("")
  const [vehicleTypeId, setVehicleTypeId] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      licence_plate_no: formData.get("licence_plate_no") as string,
      owner_id: ownerId,
      driver_id: driverId || null,
      vehicle_type_id: vehicleTypeId,
    }

    const supabase = createClient()
    const { error } = await supabase.from("vehicles").insert(data)

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setOpen(false)
    setOwnerId("")
    setDriverId("")
    setVehicleTypeId("")
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F41B1A] hover:bg-[#F41B1A]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Vehicle</DialogTitle>
          <DialogDescription>Register a new vehicle in the system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="licence_plate_no">Licence Plate No</Label>
              <Input
                id="licence_plate_no"
                name="licence_plate_no"
                placeholder="ABC 123 GP"
                required
                className="bg-input border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Vehicle Type</Label>
              <Select value={vehicleTypeId} onValueChange={setVehicleTypeId} required>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select vehicle type" />
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
              <Select value={ownerId} onValueChange={setOwnerId} required>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select owner" />
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
                  <SelectValue placeholder="Select driver (optional)" />
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#F41B1A] hover:bg-[#F41B1A]/90 text-white"
              disabled={isLoading || !ownerId || !vehicleTypeId}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
