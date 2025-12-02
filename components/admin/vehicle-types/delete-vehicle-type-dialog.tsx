"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { VehicleType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface Props {
  vehicleType: VehicleType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteVehicleTypeDialog({ vehicleType, open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.from("vehicle_types").delete().eq("id", vehicleType.id)

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Delete Vehicle Type</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {vehicleType.name} {vehicleType.model} ({vehicleType.year})
            </span>
            ?
          </p>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
