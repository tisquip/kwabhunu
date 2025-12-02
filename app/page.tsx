import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, Wrench, Users, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F41B1A] flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">KwaBhunu</h1>
              <p className="text-xs text-muted-foreground">The home of automotive solutions</p>
            </div>
          </div>
          <Link href="/auth/login">
            <Button className="bg-[#F41B1A] hover:bg-[#F41B1A]/90 text-white">Admin Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A103E] text-[#F41B1A] text-sm font-medium mb-6">
            <Wrench className="w-4 h-4" />
            Auto Parts Management System
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Streamline Your Auto Parts Business
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Manage clients, vehicles, motor parts, purchase receipts, and maintenance schedules all in one place. Never
            miss a service reminder again.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="bg-[#F41B1A] hover:bg-[#F41B1A]/90 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">Everything You Need</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Client Management"
              description="Store and manage all your client information in one secure location"
            />
            <FeatureCard
              icon={<Car className="w-8 h-8" />}
              title="Vehicle Tracking"
              description="Keep track of all vehicles, their owners, drivers, and service history"
            />
            <FeatureCard
              icon={<Wrench className="w-8 h-8" />}
              title="Parts Inventory"
              description="Manage your motor parts catalog with OEM numbers and pricing"
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Service Reminders"
              description="Automated email notifications for upcoming maintenance dates"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} KwaBhunu. The home of automotive solutions.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-lg bg-background border border-border">
      <div className="w-12 h-12 rounded-lg bg-[#1A103E] flex items-center justify-center text-[#F41B1A] mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-foreground mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
