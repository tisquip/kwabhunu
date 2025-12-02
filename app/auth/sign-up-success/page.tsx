import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#F41B1A] flex items-center justify-center">
              <Car className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">KwaBhunu</h1>
              <p className="text-xs text-muted-foreground">The home of automotive solutions</p>
            </div>
          </div>
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#1A103E] flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#F41B1A]" />
              </div>
              <CardTitle className="text-2xl text-foreground">Check Your Email</CardTitle>
              <CardDescription>We&apos;ve sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Please check your email and click the confirmation link to activate your account. Once confirmed, you
                can log in to access the admin dashboard.
              </p>
            </CardContent>
          </Card>
          <Link href="/auth/login" className="text-center text-sm text-[#F41B1A] hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
