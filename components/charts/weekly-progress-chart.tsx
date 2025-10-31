'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

type WeeklyProgressDatum = {
    date: string
    hours: number
    tasks: number
}

export default function WeeklyProgressChart({ data }: { data: WeeklyProgressDatum[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Legend />
                <Bar dataKey="hours" fill="var(--chart-1)" name="Hours Worked" />
                <Bar dataKey="tasks" fill="var(--chart-2)" name="Tasks Completed" />
            </BarChart>
        </ResponsiveContainer>
    )
}


