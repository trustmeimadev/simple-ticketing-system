"use client"

import type React from "react"

import { redirect, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/types"

export default function CreateTicketPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    // const [profile, setProfile] = useState<Profile | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
    })


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setIsLoading(true)
        setError(null)

        try {
            const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`

            const { error: insertError } = await supabase.from("tickets").insert({
                user_id: user.id,
                ticket_number: ticketNumber,
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                status: "open",
                date_submitted: new Date().toISOString(),
            })

            if (insertError) throw insertError

            router.push("/tickets")
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">

            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Create New Ticket</h1>
                    <p className="text-muted-foreground mt-2">Submit a new support ticket</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Ticket Details</CardTitle>
                        <CardDescription>Fill in the information about your issue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Brief description of your issue"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Detailed description of your issue"
                                    rows={6}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                                >
                                    <SelectTrigger id="priority">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <div className="flex gap-4">
                                <Button type="submit" disabled={isLoading} className="flex-1">
                                    {isLoading ? "Creating..." : "Create Ticket"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.push("/tickets")} className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
