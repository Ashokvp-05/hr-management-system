"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar as CalendarIcon, Loader2, FileText, FileSpreadsheet, BarChart3, PieChart as PieIcon } from "lucide-react"
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

export default function AdminReportsPage() {
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/attendance?start=${startDate}&end=${endDate}`, {
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

    const handleExport = (type: 'excel' | 'pdf') => {
        const url = `http://localhost:4000/api/reports/export/${type}?start=${startDate}&end=${endDate}`
        const link = document.createElement('a')
        link.href = url
        // @ts-ignore
        link.headers = { Authorization: `Bearer ${token}` } // This doesn't work for direct links usually.
        // Better: Open in new tab or use fetch/blob
    }

    // Better export handler using fetch to pass headers
    const handleSecureExport = async (type: 'excel' | 'pdf') => {
        if (!token) return
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/export/${type}?start=${startDate}&end=${endDate}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `Attendance_Report_${startDate}_to_${endDate}.${type === 'excel' ? 'xlsx' : 'pdf'}`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            }
        } catch (error) {
            console.error(`Failed to export ${type}`, error)
        }
    }

    // Aggregate data for charts
    const chartData = reportData.reduce((acc: any[], current: any) => {
        const date = new Date(current.clockIn).toLocaleDateString('en-US', { weekday: 'short' })
        const existing = acc.find(item => item.name === date)
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
        const existing = acc.find(item => item.name === type)
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Analytics</h2>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Generate and export system-wide attendance intelligence.</p>
                </div>
                <div className="flex items-center gap-3">
                    {(session?.user as any)?.role === 'ADMIN' && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                                onClick={() => handleSecureExport('excel')}
                            >
                                <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-500" /> Export Excel
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                                onClick={() => handleSecureExport('pdf')}
                            >
                                <FileText className="mr-2 h-4 w-4 text-rose-500" /> Export PDF
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-indigo-500" />
                        <CardTitle className="text-lg">Report Configuration</CardTitle>
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
                                className="w-48 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">End Date</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-48 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                            />
                        </div>
                        <Button
                            onClick={fetchReport}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
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
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-bold">Total Work Distribution</CardTitle>
                            <CardDescription>Aggregation of work hours recorded over the selected period.</CardDescription>
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
                                        {chartData.map((_entry, index) => (
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
                            <CardTitle className="text-xl font-bold">Work Modality</CardTitle>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <PieIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <CardDescription>Breakdown of OFFICE vs REMOTE vs FIELD check-ins.</CardDescription>
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
                                        {typeData.map((_entry, index) => (
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
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                                <span className="text-sm font-medium">Total Entries</span>
                                <span className="text-lg font-bold text-indigo-600">{reportData.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card className="lg:col-span-12 border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                        <CardTitle className="text-lg font-bold">Detailed Activity Log</CardTitle>
                        <CardDescription>Comprehensive report of all validated time entries.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest pl-8">Employee</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Clock In</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Clock Out</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right pr-8">Hours</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((row, idx) => (
                                        <tr key={idx} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4 pl-8">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-white">{row.user.name}</span>
                                                    <span className="text-xs text-slate-500">{row.user.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm font-medium">{new Date(row.clockIn).toLocaleDateString()}</td>
                                            <td className="p-4 text-sm font-mono text-emerald-600 dark:text-emerald-400">{new Date(row.clockIn).toLocaleTimeString()}</td>
                                            <td className="p-4 text-sm font-mono text-rose-600 dark:text-rose-400">
                                                {row.clockOut ? new Date(row.clockOut).toLocaleTimeString() : 'N/A'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${row.clockType === 'IN_OFFICE' ? 'bg-indigo-100 text-indigo-700' :
                                                    row.clockType === 'REMOTE' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                    {row.clockType}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right pr-8 font-bold text-slate-900 dark:text-white">
                                                {Number(row.hoursWorked).toFixed(2)}h
                                            </td>
                                        </tr>
                                    ))}
                                    {reportData.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-slate-500 italic">
                                                No records found for the selected period.
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
