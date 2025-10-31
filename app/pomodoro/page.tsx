"use client"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function PomodoroPage() {
    const searchParams = useSearchParams()
    const ticketNumber = searchParams.get("ticketNumber")

    type TimerType = "pomodoro" | "shortBreak" | "longBreak"
    const [timerType, setTimerType] = useState<TimerType>("pomodoro")
    const [durations, setDurations] = useState({
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
    })
    const [timeLeft, setTimeLeft] = useState(durations.pomodoro)
    const [isRunning, setIsRunning] = useState(false)

    const toggleTimer = () => {
        setIsRunning((prev) => !prev)
    }

    useEffect(() => {
        setTimeLeft(durations[timerType])
        setIsRunning(false)
    }, [timerType, durations])

    useEffect(() => {
        if (!isRunning) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    notifyUser()
                    setIsRunning(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isRunning])

    const notifyUser = () => {
        if (Notification.permission === "granted") {
            new Notification("Time's up!", {
                body: `Your ${timerType} timer has ended.`,
            })
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification("Time's up!", {
                        body: `Your ${timerType} timer has ended.`,
                    })
                }
            })
        }
    }

    const adjustDuration = (type: TimerType, adjustment: number) => {
        setDurations((prev) => ({
            ...prev,
            [type]: Math.max(1 * 60, prev[type] + adjustment * 60),
        }))
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-foreground">Pomodoro Timer</h1>
            <p className="text-muted-foreground mt-2">
                Working on <span className="text-blue-500 font-bold animate-pulse" style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6)" }}>
                    {ticketNumber}
                </span>
            </p>

            <div className="flex gap-4 my-4">
                <Button
                    variant={timerType === "pomodoro" ? "default" : "outline"}
                    onClick={() => setTimerType("pomodoro")}
                >
                    Pomodoro
                </Button>
                <Button
                    variant={timerType === "shortBreak" ? "default" : "outline"}
                    onClick={() => setTimerType("shortBreak")}
                >
                    Short Break
                </Button>
                <Button
                    variant={timerType === "longBreak" ? "default" : "outline"}
                    onClick={() => setTimerType("longBreak")}
                >
                    Long Break
                </Button>
            </div>

            <div className="text-6xl font-bold my-8">
                {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:
                {(timeLeft % 60).toString().padStart(2, "0")}
            </div>

            <Button onClick={toggleTimer} className="mb-4">
                {isRunning ? "Pause" : "Start"}
            </Button>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">Pomodoro: {durations.pomodoro / 60} min</span>
                    <Button onClick={() => adjustDuration("pomodoro", 1)}>+</Button>
                    <Button variant="outline" onClick={() => adjustDuration("pomodoro", -1)}>
                        -
                    </Button>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">Short Break: {durations.shortBreak / 60} min</span>
                    <Button onClick={() => adjustDuration("shortBreak", 1)}>+</Button>
                    <Button variant="outline" onClick={() => adjustDuration("shortBreak", -1)}>
                        -
                    </Button>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">Long Break: {durations.longBreak / 60} min</span>
                    <Button onClick={() => adjustDuration("longBreak", 1)}>+</Button>
                    <Button variant="outline" onClick={() => adjustDuration("longBreak", -1)}>
                        -
                    </Button>
                </div>
            </div>
        </div>
    )
}