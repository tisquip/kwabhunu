"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { MotorPart } from "@/lib/types"
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
import { Textarea } from "@/components/ui/textarea"

interface Props {
  motorPart: MotorPart
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMotorPartDialog({ motorPart, open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      oem_part_number: formData.get("oem_part_number") as string,
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      price: Number.parseFloat(formData.get("price") as string),
      updated_at: new Date().toISOString(),
    }

    const supabase = createClient()
    const { error } = await supabase.from("motor_parts").update(data).eq("id", motorPart.id)

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
          <DialogTitle className="text-foreground">Edit Motor Part</DialogTitle>
          <DialogDescription>Update the motor part details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="oem_part_number">OEM Part Number</Label>
              <Input
                id="oem_part_number"
                name="oem_part_number"
                defaultValue={motorPart.oem_part_number}
                required
                className="bg-input border-border font-mono"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={motorPart.name} required className="bg-input border-border" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={motorPart.description || ""}
                className="bg-input border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (ZAR)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={motorPart.price}
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
