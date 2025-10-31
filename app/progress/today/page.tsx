"use client"

import type React from "react"

import { redirect, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
// import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User, DailyProgress } from "@/types"



export default function LogProgressPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    // const [profile, setProfile] = useState<Profile | null>(null)
    const [existingEntry, setExistingEntry] = useState<DailyProgress | null>(null)
    const today = new Date().toISOString().split("T")[0]
    const [formData, setFormData] = useState({
        progress_date: today,
        tasks_completed: "0",
        hours_worked: "0",
        notes: "",
        mood: "good",
    })

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) {
                redirect("/auth/login")
            }
            setUser(user as User)

            // const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
            // setProfile(profileData)

            // Check if entry exists for today
            const { data: todayEntry } = await supabase
                .from("daily_progress")
                .select("*")
                .eq("user_id", user.id)
                .eq("progress_date", today)
                .single()

            if (todayEntry) {
                setExistingEntry(todayEntry)
                setFormData({
                    progress_date: todayEntry.progress_date,
                    tasks_completed: todayEntry.tasks_completed.toString(),
                    hours_worked: todayEntry.hours_worked.toString(),
                    notes: todayEntry.notes || "",
                    mood: todayEntry.mood || "good",
                })
            }
        }

        fetchUser()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setIsLoading(true)
        setError(null)

        try {
            if (existingEntry) {
                const { error: updateError } = await supabase
                    .from("daily_progress")
                    .update({
                        tasks_completed: Number.parseInt(formData.tasks_completed),
                        hours_worked: Number.parseFloat(formData.hours_worked),
                        notes: formData.notes,
                        mood: formData.mood,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", existingEntry.id)

                if (updateError) throw updateError
            } else {
                // Create new entry
                const { error: insertError } = await supabase.from("daily_progress").insert({
                    user_id: user.id,
                    progress_date: formData.progress_date,
                    tasks_completed: Number.parseInt(formData.tasks_completed),
                    hours_worked: Number.parseFloat(formData.hours_worked),
                    notes: formData.notes,
                    mood: formData.mood,
                })

                if (insertError) throw insertError
            }

            router.push("/progress")
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* <NavHeader
                userName={profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email || "User"}
            /> */}

            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        {existingEntry ? "Update Progress" : "Log Today's Progress"}
                    </h1>
                    <p className="text-muted-foreground mt-2">Track your daily accomplishments and well-being</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daily Progress</CardTitle>
                        <CardDescription>How was your day?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tasks_completed">Tasks Completed</Label>
                                    <Input
                                        id="tasks_completed"
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.tasks_completed}
                                        onChange={(e) => setFormData({ ...formData, tasks_completed: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hours_worked">Hours Worked</Label>
                                    <Input
                                        id="hours_worked"
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        required
                                        value={formData.hours_worked}
                                        onChange={(e) => setFormData({ ...formData, hours_worked: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mood">Mood</Label>
                                <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                                    <SelectTrigger id="mood">
                                        <SelectValue placeholder="Select your mood" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="great">Great 😄</SelectItem>
                                        <SelectItem value="good">Good 😊</SelectItem>
                                        <SelectItem value="neutral">Neutral 😐</SelectItem>
                                        <SelectItem value="tired">Tired 😴</SelectItem>
                                        <SelectItem value="stressed">Stressed 😰</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes (optional)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Any additional notes about your day?"
                                    rows={4}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <div className="flex gap-4">
                                <Button type="submit" disabled={isLoading} className="flex-1">
                                    {isLoading ? "Saving..." : existingEntry ? "Update Progress" : "Log Progress"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.push("/progress")} className="flex-1">
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
