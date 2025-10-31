"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LearningLog {
    id: string
    title: string
    description: string
    skills_learned: string[]
    duration_hours: number
    log_date: string
    category: string
    created_at: string
}

interface LearningLogDetailContentProps {
    learningLog: LearningLog
}

export function LearningLogDetailContent({ learningLog: initialLog }: LearningLogDetailContentProps) {
    const [log, setLog] = useState(initialLog)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialLog.title,
        description: initialLog.description,
        skills_learned: initialLog.skills_learned.join(", "),
        duration_hours: initialLog.duration_hours.toString(),
        log_date: initialLog.log_date,
        category: initialLog.category,
    })
    const supabase = createClient()

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const skillsArray = formData.skills_learned
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0)

            const { error } = await supabase
                .from("learning_logs")
                .update({
                    title: formData.title,
                    description: formData.description,
                    skills_learned: skillsArray,
                    duration_hours: Number.parseFloat(formData.duration_hours),
                    log_date: formData.log_date,
                    category: formData.category,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", log.id)

            if (error) throw error

            setLog({
                ...log,
                title: formData.title,
                description: formData.description,
                skills_learned: skillsArray,
                duration_hours: Number.parseFloat(formData.duration_hours),
                log_date: formData.log_date,
                category: formData.category,
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
                        <CardTitle>Learning Details</CardTitle>
                        <CardDescription>Information about this learning session</CardDescription>
                    </div>
                    <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Done Editing" : "Edit"}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                        {isEditing ? (
                            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        ) : (
                            <p className="text-sm text-foreground">{log.title}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Duration</p>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    min="0.5"
                                    step="0.5"
                                    value={formData.duration_hours}
                                    onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                                />
                            ) : (
                                <p className="text-sm text-foreground mt-1">{log.duration_hours} hours</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Category</p>
                            {isEditing ? (
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
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
                            ) : (
                                <p className="text-sm text-foreground mt-1">{log.category}</p>
                            )}
                        </div>
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
                    {isEditing ? (
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                        />
                    ) : (
                        <p className="text-sm text-foreground whitespace-pre-wrap">{log.description}</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Skills Learned</CardTitle>
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <Textarea
                            value={formData.skills_learned}
                            onChange={(e) => setFormData({ ...formData, skills_learned: e.target.value })}
                            rows={3}
                            placeholder="e.g., React, TypeScript, Team Leadership"
                        />
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {log.skills_learned.length > 0 ? (
                                log.skills_learned.map((skill, idx) => <Badge key={idx}>{skill}</Badge>)
                            ) : (
                                <p className="text-sm text-muted-foreground">No skills recorded</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
