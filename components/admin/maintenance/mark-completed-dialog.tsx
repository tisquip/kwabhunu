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
import { CheckCircle } from "lucide-react"

interface Props {
  maintenance: { id: string; vehicle: { licence_plate_no: string } }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MarkCompletedDialog({ maintenance, open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const date = formData.get("date_actually_maintained") as string

    const supabase = createClient()
    const { error } = await supabase
      .from("next_maintenance")
      .update({
        date_actually_maintained: date,
        updated_at: new Date().toISOString(),
      })
      .eq("id", maintenance.id)

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
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Mark as Completed</DialogTitle>
              <DialogDescription>Record the actual maintenance date.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <p className="text-muted-foreground">
              Mark maintenance for vehicle{" "}
              <span className="font-medium text-foreground">{maintenance.vehicle?.licence_plate_no}</span> as completed.
            </p>
            <div className="grid gap-2">
              <Label htmlFor="date_actually_maintained">Date Actually Maintained</Label>
              <Input
                id="date_actually_maintained"
                name="date_actually_maintained"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
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
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
              {isLoading ? "Saving..." : "Mark Completed"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
