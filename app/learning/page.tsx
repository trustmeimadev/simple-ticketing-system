import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LearningLogList } from "@/components/learning/learning-log-list"

export default async function LearningPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/auth/login")
    }


    const { data: learningLogs } = await supabase
        .from("learning_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("log_date", { ascending: false })

    const totalHours = learningLogs?.reduce((sum, log) => sum + (log.duration_hours || 0), 0) || 0

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Learning Logs</h1>
                        <p className="text-muted-foreground mt-2">Track your professional development and skills</p>
                    </div>
                    <Link href="/learning/create">
                        <Button>Add Learning Log</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Logs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{learningLogs?.length || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{totalHours.toFixed(1)}h</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Duration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {learningLogs?.length ? (totalHours / learningLogs.length).toFixed(1) : 0}h
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <LearningLogList logs={learningLogs || []} />
            </div>
        </div>
    )
}
