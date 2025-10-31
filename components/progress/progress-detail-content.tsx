"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DailyProgress {
    id: string
    progress_date: string
    tasks_completed: number
    hours_worked: number
    notes: string
    mood: string
    created_at: string
}

interface ProgressDetailContentProps {
    progressEntry: DailyProgress
}

export function ProgressDetailContent({ progressEntry }: ProgressDetailContentProps) {
    const getMoodEmoji = (mood: string | null) => {
        if (!mood) return "—"
        switch (mood.toLowerCase()) {
            case "great":
                return "😄"
            case "good":
                return "😊"
            case "neutral":
                return "😐"
            case "tired":
                return "😴"
            case "stressed":
                return "😰"
            default:
                return "—"
        }
    }

    const getMoodColor = (mood: string | null) => {
        if (!mood) return "bg-gray-100 text-gray-800"
        switch (mood.toLowerCase()) {
            case "great":
                return "bg-green-100 text-green-800"
            case "good":
                return "bg-blue-100 text-blue-800"
            case "neutral":
                return "bg-yellow-100 text-yellow-800"
            case "tired":
                return "bg-purple-100 text-purple-800"
            case "stressed":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{progressEntry.tasks_completed}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Hours Worked</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{progressEntry.hours_worked}h</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Mood</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl">
                            {getMoodEmoji(progressEntry.mood)} <span className="text-foreground">{progressEntry.mood || "—"}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {progressEntry.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{progressEntry.notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
