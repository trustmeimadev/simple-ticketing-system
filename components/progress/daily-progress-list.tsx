"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DailyProgress {
    id: string
    progress_date: string
    tasks_completed: number
    hours_worked: number
    notes: string
    mood: string
    created_at: string
}

interface DailyProgressListProps {
    progressEntries: DailyProgress[]
}

export function DailyProgressList({ progressEntries }: DailyProgressListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [moodFilter, setMoodFilter] = useState("all")
    const [sortBy, setSortBy] = useState("recent")

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

    const filteredEntries = progressEntries
        .filter((entry) => {
            const matchesSearch = entry.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false
            const matchesMood = moodFilter === "all" || entry.mood === moodFilter
            return matchesSearch && matchesMood
        })
        .sort((a, b) => {
            if (sortBy === "recent") {
                return new Date(b.progress_date).getTime() - new Date(a.progress_date).getTime()
            } else if (sortBy === "oldest") {
                return new Date(a.progress_date).getTime() - new Date(b.progress_date).getTime()
            } else if (sortBy === "mostTasks") {
                return b.tasks_completed - a.tasks_completed
            }
            return 0
        })

    if (progressEntries.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Progress Logged</CardTitle>
                    <CardDescription>Start tracking your daily progress</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/progress/today">
                        <Button>Log Your First Day</Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Progress History</CardTitle>
                <CardDescription>Your daily progress entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Search notes</label>
                        <Input
                            placeholder="Search by notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Mood</label>
                        <Select value={moodFilter} onValueChange={setMoodFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Moods</SelectItem>
                                <SelectItem value="great">Great 😄</SelectItem>
                                <SelectItem value="good">Good 😊</SelectItem>
                                <SelectItem value="neutral">Neutral 😐</SelectItem>
                                <SelectItem value="tired">Tired 😴</SelectItem>
                                <SelectItem value="stressed">Stressed 😰</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-48">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Sort By</label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Most Recent</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="mostTasks">Most Tasks</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {filteredEntries.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">No progress entries match your search criteria</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Tasks</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Hours</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Mood</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Notes</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEntries.map((entry) => (
                                    <tr key={entry.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-4 text-sm text-foreground font-medium">
                                            {new Date(entry.progress_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-foreground">{entry.tasks_completed}</td>
                                        <td className="py-3 px-4 text-sm text-foreground">{entry.hours_worked}h</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}
                                            >
                                                {getMoodEmoji(entry.mood)} {entry.mood || "—"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate">{entry.notes || "—"}</td>
                                        <td className="py-3 px-4 text-right">
                                            <Link href={`/progress/${entry.id}`}>
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
                    Showing {filteredEntries.length} of {progressEntries.length} entries
                </div>
            </CardContent>
        </Card>
    )
}
