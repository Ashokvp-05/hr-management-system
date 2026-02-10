"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Loader2, BarChart3, PieChart as PieIcon, Users, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend
} from "recharts"

export default function ManagerReportsPage() {
    const { data: session } = useSession()
    const token = (session?.user as any)?.accessToken

    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0])
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
    const [loading, setLoading] = useState(false)
    const [reportData, setReportData] = useState<any[]>([])

    const fetchReport = async () => {
        if (!token) return
        setLoading(true)
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
            const res = await fetch(`${apiUrl}/reports/attendance?start=${startDate}&end=${endDate}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setReportData(data)
            }
        } catch (error) {
            console.error("Failed to fetch report", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReport()
    }, [startDate, endDate, token])

    // Aggregate data for charts
    const chartData = reportData.reduce((acc: any[], current: any) => {
        const date = new Date(current.clockIn).toLocaleDateString('en-US', { weekday: 'short' })
        const existing = acc.find((item: any) => item.name === date)
        const hours = Number(current.hoursWorked) || 0
        if (existing) {
            existing.hours += hours
        } else {
            acc.push({ name: date, hours })
        }
        return acc
    }, []).reverse()

    const typeData = reportData.reduce((acc: any[], current: any) => {
        const type = current.clockType
        const existing = acc.find((item: any) => item.name === type)
        if (existing) {
            existing.value++
        } else {
            acc.push({ name: type, value: 1 })
        }
        return acc
    }, [])

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        Team <span className="text-indigo-600">Analytics</span>
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">Deep-dive into your department's attendance trends and productivity metrics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-full shadow-sm" onClick={() => window.print()}>
                        <FileText className="w-4 h-4 mr-2" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Active Hours</p>
                        <div className="text-3xl font-black text-indigo-600 mt-1">
                            {chartData.reduce((a, b) => a + b.hours, 0).toFixed(1)}h
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Team Size</p>
                        <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                            {new Set(reportData.map(r => r.user.id)).size} Members
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Average Per Day</p>
                        <div className="text-3xl font-black text-emerald-600 mt-1">
                            {(chartData.reduce((a, b) => a + b.hours, 0) / (chartData.length || 1)).toFixed(1)}h
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Records Logged</p>
                        <div className="text-3xl font-black text-amber-600 mt-1">
                            {reportData.length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-indigo-500" />
                        <CardTitle className="text-lg">Date Range Selector</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-end gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Start Date</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-48 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">End Date</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-48 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
                            />
                        </div>
                        <Button
                            onClick={fetchReport}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 rounded-full px-6"
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                            Update Analytics
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* BAR CHART: Hours per Day */}
                <Card className="lg:col-span-8 border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 text-indigo-400">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-bold">Team Workloads</CardTitle>
                            <CardDescription>Total aggregated work hours of your department.</CardDescription>
                        </div>
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        unit="h"
                                    />
                                    <RechartsTooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                                        {chartData.map((_entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* PIE CHART: Attendance Type */}
                <Card className="lg:col-span-4 border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold">Work Mode</CardTitle>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <PieIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <CardDescription>How your team is working (Remote vs Office).</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={typeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {typeData.map((_entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-3 mt-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                                <span className="text-xs font-bold uppercase text-slate-500">Total Validated Entries</span>
                                <span className="text-lg font-black text-indigo-600">{reportData.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card className="lg:col-span-12 border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                        <CardTitle className="text-lg font-bold">Team Activity Logs</CardTitle>
                        <CardDescription>Comprehensive audit trail of your team's work sessions.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-8">Employee</th>
                                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clock In</th>
                                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clock Out</th>
                                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mode</th>
                                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right pr-8">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((row, idx) => (
                                        <tr key={idx} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4 pl-8">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 dark:text-white">{row.user.name}</span>
                                                    <span className="text-[10px] text-slate-500 font-medium">{row.user.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm font-semibold">{new Date(row.clockIn).toLocaleDateString()}</td>
                                            <td className="p-4 text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold">{new Date(row.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td className="p-4 text-sm font-mono text-rose-600 dark:text-rose-400 font-bold">
                                                {row.clockOut ? new Date(row.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ACTIVE'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${row.clockType === 'IN_OFFICE' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
                                                    row.clockType === 'REMOTE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                                                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                    }`}>
                                                    {row.clockType}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right pr-8 font-black text-slate-900 dark:text-white">
                                                {Number(row.hoursWorked).toFixed(2)}h
                                            </td>
                                        </tr>
                                    ))}
                                    {reportData.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-20 text-center text-slate-400 font-medium italic">
                                                No team records found for the selected period.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
