"use client"

import React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        const supabase = createClient()
        setIsLoading(true)
        setError(null)

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`,
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    },
                },
            })
            if (signUpError) throw signUpError
            router.push("/auth/check-email")
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-foreground">DOLE Work Tracker</h1>
                        <p className="text-muted-foreground mt-2">Create your account</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Sign Up</CardTitle>
                            <CardDescription>Create an account to get started</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="John"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                {error && <p className="text-sm text-destructive">{error}</p>}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Creating account..." : "Sign Up"}
                                </Button>
                            </form>
                            <div className="mt-4 text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
                                    Login
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
