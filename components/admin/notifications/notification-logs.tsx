"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface NotificationLog {
  id: string
  maintenance_id: string
  sent_at: string
  status: string
  days_before: number
  message: string | null
  notification_type: { name: string }
  maintenance: {
    id: string
    date_of_next_maintenance: string
    vehicle: {
      licence_plate_no: string
      owner: { full_name: string; email: string }
    }
  }
}

export function NotificationLogs({ logs }: { logs: NotificationLog[] }) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500/20 text-green-500">Sent</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-500">Failed</Badge>
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>
    }
  }

  if (logs.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No notifications sent yet</p>
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead className="text-foreground">Date Sent</TableHead>
            <TableHead className="text-foreground">Type</TableHead>
            <TableHead className="text-foreground">Vehicle</TableHead>
            <TableHead className="text-foreground">Client</TableHead>
            <TableHead className="text-foreground">Days Before</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-muted/50">
              <TableCell className="text-muted-foreground">{formatDate(log.sent_at)}</TableCell>
              <TableCell className="text-muted-foreground capitalize">{log.notification_type?.name}</TableCell>
              <TableCell className="font-medium text-foreground">
                {log.maintenance?.vehicle?.licence_plate_no}
              </TableCell>
              <TableCell className="text-muted-foreground">{log.maintenance?.vehicle?.owner?.full_name}</TableCell>
              <TableCell className="text-muted-foreground">
                {log.days_before === 0 ? "Same day" : `${log.days_before} day${log.days_before !== 1 ? "s" : ""}`}
              </TableCell>
              <TableCell>{getStatusBadge(log.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
