"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

export function NavHeader({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (state: boolean) => void }) {
    const router = useRouter()
    const [userName, setUserName] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient()

            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                router.push("/auth/login")
                return
            }

            const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

            if (profile) {
                setUserName(`${profile.first_name} ${profile.last_name}`)
            } else {
                setUserName(user.email ?? null)
            }
        }

        fetchProfile()
    }, [router])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/auth/login")
    }

    return (
        <nav className="border-b border-border bg-card sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    <h1 className="text-xl font-bold text-foreground">Personal Tracker</h1>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                        {userName || "Loading..."}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    )
}