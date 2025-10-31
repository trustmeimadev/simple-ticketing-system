"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarChart, Ticket, Book, TrendingUp, Clipboard } from "lucide-react"

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: BarChart },
    { label: "Tickets", href: "/tickets", icon: Ticket },
    { label: "Learning", href: "/learning", icon: Book },
    { label: "Progress", href: "/progress", icon: TrendingUp },
    { label: "Reports", href: "/reports", icon: Clipboard },
]

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (state: boolean) => void }) {
    const pathname = usePathname()

    return (
        <>
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col flex-1 overflow-y-auto pt-5 pb-4 px-3">
                    <div className="flex items-center justify-center mb-8 px-2">
                        <h1 className="text-xl font-bold text-sidebar-foreground">Personal Tracker</h1>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 transition-colors",
                                        pathname === item.href
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}