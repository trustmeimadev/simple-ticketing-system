"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

export default function TicketStatusPie({
    statusData,
    colors,
}: {
    statusData: Array<{ name: string; value: number }>
    colors: string[]
}) {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                    {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}