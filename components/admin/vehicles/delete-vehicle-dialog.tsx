"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Vehicle } from "@/lib/types"
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
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteVehicleDialog({ vehicle, open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.from("vehicles").delete().eq("id", vehicle.id)

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
              <DialogTitle className="text-foreground">Delete Vehicle</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete vehicle{" "}
            <span className="font-medium text-foreground">{vehicle.licence_plate_no}</span>?
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
