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
import type { User, Profile } from "@/types"
export default function CreateLearningLogPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        skills_learned: "",
        duration_hours: "1",
        log_date: new Date().toISOString().split("T")[0],
        category: "general",
    })

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) {
                redirect("/auth/login")
            }
            setUser(user)

            // const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
            // setProfile(profileData)
        }

        fetchUser()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setIsLoading(true)
        setError(null)

        try {
            const skillsArray = formData.skills_learned
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0)

            const { error: insertError } = await supabase.from("learning_logs").insert({
                user_id: user.id,
                title: formData.title,
                description: formData.description,
                skills_learned: skillsArray,
                duration_hours: Number.parseFloat(formData.duration_hours),
                log_date: formData.log_date,
                category: formData.category,
            })

            if (insertError) throw insertError

            router.push("/learning")
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
                    <h1 className="text-3xl font-bold text-foreground">Create Learning Log</h1>
                    <p className="text-muted-foreground mt-2">Document your professional development</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Learning Details</CardTitle>
                        <CardDescription>Capture what you learned and the skills you developed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="What did you learn about?"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the learning experience and key takeaways"
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="log_date">Date</Label>
                                    <Input
                                        id="log_date"
                                        type="date"
                                        required
                                        value={formData.log_date}
                                        onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration_hours">Duration (hours)</Label>
                                    <Input
                                        id="duration_hours"
                                        type="number"
                                        min="0.5"
                                        step="0.5"
                                        required
                                        value={formData.duration_hours}
                                        onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="technical">Technical</SelectItem>
                                        <SelectItem value="soft-skills">Soft Skills</SelectItem>
                                        <SelectItem value="management">Management</SelectItem>
                                        <SelectItem value="certification">Certification</SelectItem>
                                        <SelectItem value="workshop">Workshop</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="skills_learned">Skills Learned (comma-separated)</Label>
                                <Textarea
                                    id="skills_learned"
                                    placeholder="e.g., React, TypeScript, Team Leadership"
                                    rows={3}
                                    value={formData.skills_learned}
                                    onChange={(e) => setFormData({ ...formData, skills_learned: e.target.value })}
                                />
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <div className="flex gap-4">
                                <Button type="submit" disabled={isLoading} className="flex-1">
                                    {isLoading ? "Creating..." : "Create Log"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.push("/learning")} className="flex-1">
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
