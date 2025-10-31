import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import WeeklyProgressChart from "@/components/charts/weekly-progress-chart"
import TicketStatusPie from "@/components/charts/ticket-status-pie"

type WeeklyProgressDatum = {
    date: string
    hours: number
    tasks: number
}

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/auth/login")
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const { data: tickets } = await supabase
        .from("tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("date_submitted", { ascending: false })

    const { data: learningLogs } = await supabase
        .from("learning_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("log_date", { ascending: false })
        .limit(30)

    const { data: dailyProgress } = await supabase
        .from("daily_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("progress_date", { ascending: false })
        .limit(7)

    const totalHours = learningLogs?.reduce((sum, log) => sum + (log.duration_hours || 0), 0) || 0
    const totalTasks = dailyProgress?.reduce((sum, dp) => sum + (dp.tasks_completed || 0), 0) || 0
    const openTickets = tickets?.filter((t) => t.status === "open").length || 0
    const resolvedTickets = tickets?.filter((t) => t.status === "resolved").length || 0

    const chartData =
        dailyProgress
            ?.map((dp) => ({
                date: new Date(dp.progress_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                hours: Number(dp.hours_worked),
                tasks: Number(dp.tasks_completed),
            }))
            .reverse() || []

    const statusData = [
        { name: "Open", value: openTickets },
        { name: "Resolved", value: resolvedTickets },
    ]

    const COLORS = ["oklch(0.45 0.22 264)", "oklch(0.5 0.18 200)"]

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Overview of your progress, tickets, and learning</p>
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
                            <CardDescription>Tasks completed this week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Open Tickets</CardTitle>
                            <CardDescription>Tickets that need your attention</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-foreground">{openTickets}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Weekly Progress</CardTitle>
                            <CardDescription>Hours worked and tasks completed</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <WeeklyProgressChart data={chartData} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Status</CardTitle>
                            <CardDescription>Current ticket breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TicketStatusPie statusData={statusData} colors={COLORS} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}