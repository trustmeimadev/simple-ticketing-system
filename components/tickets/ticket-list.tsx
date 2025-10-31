"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Ticket {
    id: string
    ticket_number: string
    title: string
    description: string
    status: string
    priority: string
    date_submitted: string
    date_resolved: string | null
}

interface TicketListProps {
    tickets: Ticket[]
}

export function TicketList({ tickets }: TicketListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
        const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return "bg-blue-100 text-blue-800"
            case "in-progress":
                return "bg-yellow-100 text-yellow-800"
            case "resolved":
                return "bg-green-100 text-green-800"
            case "closed":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "text-red-600"
            case "medium":
                return "text-orange-600"
            case "low":
                return "text-green-600"
            default:
                return "text-gray-600"
        }
    }

    if (tickets.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Tickets</CardTitle>
                    <CardDescription>You haven&apos;t created any tickets yet</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/tickets/create">
                        <Button>Create Your First Ticket</Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Tickets</CardTitle>
                <CardDescription>Your complete ticket history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Search</label>
                        <Input
                            placeholder="Search by title, ticket #, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-48">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Priority</label>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {filteredTickets.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">No tickets match your search criteria</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Ticket #</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Title</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Priority</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Submitted</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-4 text-sm text-foreground font-medium">{ticket.ticket_number}</td>
                                        <td className="py-3 px-4 text-sm text-foreground">{ticket.title}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}
                                            >
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-muted-foreground">
                                            {new Date(ticket.date_submitted).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link href={`/tickets/${ticket.id}`}>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="text-xs text-muted-foreground text-right">
                    Showing {filteredTickets.length} of {tickets.length} tickets
                </div>
            </CardContent>
        </Card>
    )
}
