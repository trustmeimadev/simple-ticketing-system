import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckEmailPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Check Your Email</CardTitle>
                        <CardDescription>We&apos;ve sent you a confirmation link to verify your email address.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">
                            Click the link in the email to confirm your account. Once confirmed, you can log in to your tracker.
                        </p>
                        <Link href="/auth/login">
                            <Button className="w-full">Back to Login</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
