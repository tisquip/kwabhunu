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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export function CreateVehicleTypeDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      model: formData.get("model") as string,
      year: Number.parseInt(formData.get("year") as string),
    }

    const supabase = createClient()
    const { error } = await supabase.from("vehicle_types").insert(data)

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F41B1A] hover:bg-[#F41B1A]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle Type
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Vehicle Type</DialogTitle>
          <DialogDescription>Enter the vehicle make, model and year.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Make (e.g. Nissan)</Label>
              <Input id="name" name="name" placeholder="Nissan" required className="bg-input border-border" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Model (e.g. Caravan)</Label>
              <Input id="model" name="model" placeholder="Caravan" required className="bg-input border-border" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                placeholder="2024"
                required
                className="bg-input border-border"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#F41B1A] hover:bg-[#F41B1A]/90 text-white" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
