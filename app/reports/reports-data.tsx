import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ReportsPage from "./reports-page"

export default async function ReportsData() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

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

    const { data: dailyProgress } = await supabase
        .from("daily_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("progress_date", { ascending: false })

    return (
        <ReportsPage
            tickets={tickets || []}
            learningLogs={learningLogs || []}
            dailyProgress={dailyProgress || []}
        />
    )
}