"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
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

interface TicketDetailContentProps {
    ticket: Ticket
}

export function TicketDetailContent({ ticket: initialTicket }: TicketDetailContentProps) {
    const [ticket, setTicket] = useState(initialTicket)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        status: initialTicket.status,
        priority: initialTicket.priority,
    })
    const supabase = createClient()

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

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from("tickets")
                .update({
                    status: formData.status,
                    priority: formData.priority,
                    date_resolved: formData.status === "resolved" ? new Date().toISOString() : null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", ticket.id)

            if (error) throw error

            setTicket({
                ...ticket,
                status: formData.status,
                priority: formData.priority,
                date_resolved: formData.status === "resolved" ? new Date().toISOString() : null,
            })
            setIsEditing(false)
        } catch (error: unknown) {
            console.error(error instanceof Error ? error.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Ticket Information</CardTitle>
                        <CardDescription>Core details about this ticket</CardDescription>
                    </div>
                    <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Done Editing" : "Edit"}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            {isEditing ? (
                                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(ticket.status)}`}
                                >
                                    {ticket.status}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Priority</p>
                            {isEditing ? (
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className={`text-sm font-medium mt-1 ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                            <p className="text-sm text-foreground mt-1">{new Date(ticket.date_submitted).toLocaleString()}</p>
                        </div>
                        {ticket.date_resolved && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                                <p className="text-sm text-foreground mt-1">{new Date(ticket.date_resolved).toLocaleString()}</p>
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <div className="flex gap-2 pt-4">
                            <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                                Cancel
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{ticket.description}</p>
                </CardContent>
            </Card>
        </div>
    )
}
