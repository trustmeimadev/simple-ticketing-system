import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DailyProgressList } from "@/components/progress/daily-progress-list"
import ActivityCalendar from "react-activity-calendar"

type CalendarData = {
    date: string
    count: number
    level: number
}

export default async function ProgressPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/auth/login")
    }

    const { data: dailyProgress } = await supabase
        .from("daily_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("progress_date", { ascending: false })

    const thisWeek =
        dailyProgress?.filter((dp) => {
            const date = new Date(dp.progress_date)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return date >= weekAgo
        }) || []

    const totalTasks = thisWeek.reduce((sum, dp) => sum + (dp.tasks_completed || 0), 0)
    const totalHours = thisWeek.reduce((sum, dp) => sum + (dp.hours_worked || 0), 0)

    const calendarData: CalendarData[] =
        dailyProgress?.map((dp) => {
            const count = dp.tasks_completed || 0
            const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4 // Define levels based on count
            return {
                date: new Date(dp.progress_date).toISOString().split("T")[0],
                count,
                level,
            }
        }) || []

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Daily Progress</h1>
                        <p className="text-muted-foreground mt-2">Track your daily work and accomplishments</p>
                    </div>
                    <Link href="/progress/today">
                        <Button>Log Progress</Button>
                    </Link>
                </div>

                <div className="mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Progress Calendar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActivityCalendar
                                data={calendarData}
                                blockSize={15}
                                blockMargin={5}
                                fontSize={14}
                                labels={{
                                    legend: {
                                        less: "Less",
                                        more: "More",
                                    },
                                }}
                                theme={{
                                    light: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
                                    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">This Week Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{totalTasks}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">This Week Hours</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{totalHours.toFixed(1)}h</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Days Logged</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{thisWeek.length}</div>
                        </CardContent>
                    </Card>
                </div>



                <DailyProgressList progressEntries={dailyProgress || []} />
            </div>
        </div>
    )
}