"use client"

import { useState } from "react"
import type { Client } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Search } from "lucide-react"
import { EditClientDialog } from "./edit-client-dialog"
import { DeleteClientDialog } from "./delete-client-dialog"

export function ClientsTable({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState("")
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [deleteClient, setDeleteClient] = useState<Client | null>(null)

  const filteredClients = clients.filter(
    (client) =>
      client.full_name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.phone_number.includes(search),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {filteredClients.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No clients found</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-foreground">Full Name</TableHead>
                <TableHead className="text-foreground">Email</TableHead>
                <TableHead className="text-foreground">Phone</TableHead>
                <TableHead className="text-foreground">Address</TableHead>
                <TableHead className="text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{client.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.email}</TableCell>
                  <TableCell className="text-muted-foreground">{client.phone_number}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">{client.address}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditClient(client)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteClient(client)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {editClient && (
        <EditClientDialog
          client={editClient}
          open={!!editClient}
          onOpenChange={(open) => !open && setEditClient(null)}
        />
      )}

      {deleteClient && (
        <DeleteClientDialog
          client={deleteClient}
          open={!!deleteClient}
          onOpenChange={(open) => !open && setDeleteClient(null)}
        />
      )}
    </div>
  )
}
