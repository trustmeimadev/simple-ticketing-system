import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TicketList } from "@/components/tickets/ticket-list"

export default async function TicketsPage() {
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

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Ticket Management</h1>
                        <p className="text-muted-foreground mt-2">Track and manage your support tickets</p>
                    </div>
                    <Link href="/tickets/create">
                        <Button>Create Ticket</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{tickets?.length || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {tickets?.filter((t) => t.status === "open").length || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {tickets?.filter((t) => t.status === "resolved").length || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <TicketList tickets={tickets || []} />
            </div>
        </div>
    )
}
