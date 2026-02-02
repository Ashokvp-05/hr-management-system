"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AttendanceChart({ token }: { token: string }) {
    const [chartData, setChartData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch more entries to ensure we have enough to aggregate over the week
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
                const res = await fetch(`${apiUrl}/time/history?limit=20`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const history = await res.json()

                    // Group by date to aggregate multiple entries on the same day
                    const dayMap: { [key: string]: number } = {}

                    history.forEach((entry: any) => {
                        const dateKey = new Date(entry.clockIn).toLocaleDateString('en-US', { weekday: 'short' })
                        dayMap[dateKey] = (dayMap[dateKey] || 0) + (entry.hoursWorked ? Number(entry.hoursWorked) : 0)
                    })

                    // Order days logically (Sun -> Sat or similar)
                    const daysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                    const today = new Date().getDay()

                    // Get last 7 days in order
                    const last7Days = []
                    for (let i = 6; i >= 0; i--) {
                        const d = new Date()
                        d.setDate(d.getDate() - i)
                        const dayName = daysOrder[d.getDay()]
                        last7Days.push({
                            day: dayName,
                            hours: Number((dayMap[dayName] || 0).toFixed(1))
                        })
                    }

                    setChartData(last7Days)
                }
            } catch (e) {
                console.error("Failed to fetch chart data")
            } finally {
                setLoading(false)
            }
        }
        if (token) fetchStats()
    }, [token])

    if (loading) return <div className="h-[250px] flex items-center justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Week Performance</CardTitle>
                <CardDescription>Visual log of your daily work hours.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[220px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="day"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                stroke="#888888"
                            />
                            <YAxis
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                stroke="#888888"
                                tickFormatter={(val) => `${val}h`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar
                                dataKey="hours"
                                fill="#6366f1"
                                radius={[6, 6, 0, 0]}
                                barSize={32}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
