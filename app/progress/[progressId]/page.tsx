import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
// import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProgressDetailContent } from "@/components/progress/progress-detail-content"

interface ProgressDetailPageProps {
    params: Promise<{ progressId: string }>
}

export default async function ProgressDetailPage({ params }: ProgressDetailPageProps) {
    const { progressId } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/auth/login")
    }

    // const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const { data: progressEntry } = await supabase
        .from("daily_progress")
        .select("*")
        .eq("id", progressId)
        .eq("user_id", user.id)
        .single()

    if (!progressEntry) {
        redirect("/progress")
    }

    return (
        <div className="min-h-screen bg-background">
            {/* <NavHeader userName={profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user.email} /> */}

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            {new Date(progressEntry.progress_date).toLocaleDateString()}
                        </h1>
                        <p className="text-muted-foreground mt-2">Daily progress summary</p>
                    </div>
                    <Link href="/progress">
                        <Button variant="outline">Back to Progress</Button>
                    </Link>
                </div>

                <ProgressDetailContent progressEntry={progressEntry} />
            </div>
        </div>
    )
}
