import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LearningLogDetailContent } from "@/components/learning/learning-log-detail-content"

interface LearningLogDetailPageProps {
    params: Promise<{ learningId: string }>
}

export default async function LearningLogDetailPage({ params }: LearningLogDetailPageProps) {
    const { learningId } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/auth/login")
    }

    // const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const { data: learningLog } = await supabase
        .from("learning_logs")
        .select("*")
        .eq("id", learningId)
        .eq("user_id", user.id)
        .single()

    if (!learningLog) {
        redirect("/learning")
    }

    return (
        <div className="min-h-screen bg-background">
            {/* <NavHeader userName={profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user.email} /> */}

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{learningLog.title}</h1>
                        <p className="text-muted-foreground mt-2">{new Date(learningLog.log_date).toLocaleDateString()}</p>
                    </div>
                    <Link href="/learning">
                        <Button variant="outline">Back to Learning</Button>
                    </Link>
                </div>

                <LearningLogDetailContent learningLog={learningLog} />
            </div>
        </div>
    )
}
