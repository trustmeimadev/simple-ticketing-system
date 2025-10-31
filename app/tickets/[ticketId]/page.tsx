import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TicketDetailContent } from "@/components/tickets/ticket-detail-content"

interface TicketDetailPageProps {
    params: Promise<{ ticketId: string }>
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
    const { ticketId } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/auth/login")
    }

    const { data: ticket } = await supabase.from("tickets").select("*").eq("id", ticketId).eq("user_id", user.id).single()

    if (!ticket) {
        redirect("/tickets")
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{ticket.title}</h1>
                        <p className="text-muted-foreground mt-2">Ticket #{ticket.ticket_number}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/tickets">
                            <Button variant="outline">Back to Tickets</Button>
                        </Link>
                        <Link href={`/pomodoro?ticketNumber=${ticket.ticket_number}`}>
                            <Button>Start Working</Button>
                        </Link>
                    </div>
                </div>

                <TicketDetailContent ticket={ticket} />
            </div>
        </div>
    )
}