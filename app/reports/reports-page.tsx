"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type CategoryBreakdown = {
    name: string
    value: number
}

type PriorityBreakdown = {
    name: string
    value: number
}

export default function ReportsPage({
    tickets,
    learningLogs,
    dailyProgress,
}: {
    tickets: Array<{ priority: string }>
    learningLogs: Array<{ category: string; duration_hours: number }>
    dailyProgress: Array<{ tasks_completed: number; hours_worked: number }>
}) {
    const totalHours = learningLogs.reduce((sum, log) => sum + (log.duration_hours || 0), 0)
    const totalTasks = dailyProgress.reduce((sum, dp) => sum + (dp.tasks_completed || 0), 0)
    const totalWorkedHours = dailyProgress.reduce((sum, dp) => sum + (dp.hours_worked || 0), 0)

    const categoryBreakdown: CategoryBreakdown[] = learningLogs.reduce((acc: CategoryBreakdown[], log) => {
        const existing = acc.find((item) => item.name === log.category)
        if (existing) {
            existing.value += log.duration_hours || 0
        } else {
            acc.push({ name: log.category || "Uncategorized", value: log.duration_hours || 0 })
        }
        return acc
    }, [])

    const priorityBreakdown: PriorityBreakdown[] = tickets.reduce((acc: PriorityBreakdown[], ticket) => {
        const existing = acc.find((item) => item.name === ticket.priority)
        if (existing) {
            existing.value += 1
        } else {
            acc.push({ name: ticket.priority || "Unknown", value: 1 })
        }
        return acc
    }, [])

    const COLORS = [
        "oklch(0.45 0.22 264)",
        "oklch(0.5 0.18 200)",
        "oklch(0.65 0.15 140)",
        "oklch(0.38 0.17 350)",
        "oklch(0.75 0.12 100)",
    ]

    return (
        <div className="min-h-screen bg-background flex">
            <div className="flex-1">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
                        <p className="text-muted-foreground mt-2">Comprehensive insights into your work and learning</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Learning Hours</CardTitle>
                                <CardDescription>Hours spent on learning activities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-foreground">{totalHours}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Total Tasks Completed</CardTitle>
                                <CardDescription>Tasks completed in the last 30 days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Total Worked Hours</CardTitle>
                                <CardDescription>Hours worked in the last 30 days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-foreground">{totalWorkedHours}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Learning by Category</CardTitle>
                                <CardDescription>Hours spent on different learning categories</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            dataKey="value"
                                            label
                                        >
                                            {categoryBreakdown.map((entry: CategoryBreakdown, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tickets by Priority</CardTitle>
                                <CardDescription>Breakdown of tickets by priority</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={priorityBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            dataKey="value"
                                            label
                                        >
                                            {priorityBreakdown.map((entry: PriorityBreakdown, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Daily Progress Chart */}
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Daily Progress</CardTitle>
                                <CardDescription>Hours worked and tasks completed daily</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dailyProgress}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="progress_date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="hours_worked" fill="oklch(0.45 0.22 264)" name="Hours Worked" />
                                        <Bar dataKey="tasks_completed" fill="oklch(0.5 0.18 200)" name="Tasks Completed" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}