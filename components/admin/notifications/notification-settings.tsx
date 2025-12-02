"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Smartphone } from "lucide-react"

interface NotificationType {
  id: string
  name: string
  is_active: boolean
}

const iconMap: Record<string, React.ReactNode> = {
  email: <Mail className="w-5 h-5" />,
  whatsapp: <MessageSquare className="w-5 h-5" />,
  sms: <Smartphone className="w-5 h-5" />,
}

export function NotificationSettings({ types }: { types: NotificationType[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleToggle = async (type: NotificationType) => {
    setLoading(type.id)
    const supabase = createClient()

    await supabase.from("notification_types").update({ is_active: !type.is_active }).eq("id", type.id)

    setLoading(null)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {types.map((type) => (
        <div key={type.id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#1A103E] flex items-center justify-center text-[#F41B1A]">
              {iconMap[type.name] || <Bell className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Label className="text-foreground capitalize font-medium">{type.name}</Label>
                {type.name === "email" && <Badge className="bg-green-500/20 text-green-500 text-xs">Ready</Badge>}
                {type.name !== "email" && (
                  <Badge className="bg-yellow-500/20 text-yellow-500 text-xs">Coming Soon</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {type.name === "email" && "Send email reminders to clients via Supabase"}
                {type.name === "whatsapp" && "Send WhatsApp messages (requires integration)"}
                {type.name === "sms" && "Send SMS messages (requires provider)"}
              </p>
            </div>
          </div>
          <Switch
            checked={type.is_active}
            onCheckedChange={() => handleToggle(type)}
            disabled={loading === type.id || type.name !== "email"}
          />
        </div>
      ))}
    </div>
  )
}

function Bell({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}
