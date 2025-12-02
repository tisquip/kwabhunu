"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

export function AdminHeader({ title }: { title: string }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      {user && (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1A103E] flex items-center justify-center text-[#F41B1A] text-sm font-medium">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      )}
    </header>
  )
}
