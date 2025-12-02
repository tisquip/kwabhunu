"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"

export function SendNotificationsButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ sent: number; errors: number } | null>(null)
  const router = useRouter()

  const handleSend = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
      router.refresh()
    } catch (error) {
      console.error("Failed to send notifications:", error)
      setResult({ sent: 0, errors: 1 })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {result && (
        <span className="text-sm text-muted-foreground">
          {result.sent} sent, {result.errors} errors
        </span>
      )}
      <Button onClick={handleSend} disabled={isLoading} className="bg-[#F41B1A] hover:bg-[#F41B1A]/90 text-white">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Reminders
          </>
        )}
      </Button>
    </div>
  )
}
