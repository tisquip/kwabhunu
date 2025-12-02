"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Car, Users, Wrench, FileText, Bell, LayoutDashboard, LogOut, CarFront, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/vehicle-types", label: "Vehicle Types", icon: CarFront },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/motor-parts", label: "Motor Parts", icon: Package },
  { href: "/admin/receipts", label: "Purchase Receipts", icon: FileText },
  { href: "/admin/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#F41B1A] flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">KwaBhunu</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">The home of automotive solutions</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
