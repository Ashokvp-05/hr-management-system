"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, startOfMonth, endOfMonth } from "date-fns"
import {
    Download,
    FileSpreadsheet,
    FileText,
    Calendar as CalendarIcon,
    Filter,
    Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export default function ReportsPage() {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
    })
    const [summary, setSummary] = useState({ totalHours: "0.00", overtimeHours: "0.00", daysWorked: 0 })
    const [loading, setLoading] = useState(false)

    const token = (session?.user as any)?.accessToken

    useEffect(() => {
        const fetchReportData = async () => {
            if (!token) return
            setLoading(true)
            try {
                // Fetch summary for the selected range or global
                // Currently summary API is global last 7 days, but let's use the report API here
                const res = await fetch(`http://localhost:4000/api/time/reports?start=${dateRange.from.toISOString()}&end=${dateRange.to.toISOString()}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const entries = await res.json()
                    let total = 0
                    let ot = 0
                    entries.forEach((e: any) => {
                        total += Number(e.hoursWorked || 0)
                        if (Number(e.hoursWorked || 0) > 9) ot += (Number(e.hoursWorked) - 9)
                    })
                    setSummary({
                        totalHours: total.toFixed(1),
                        overtimeHours: ot.toFixed(1),
                        daysWorked: entries.length
                    })
                }
            } catch (e) {
                toast({ title: "Error", description: "Failed to load report data", variant: "destructive" })
            } finally {
                setLoading(false)
            }
        }
        fetchReportData()
    }, [token, dateRange])

    const handleDownload = async (type: string) => {
        if (!token) return

        toast({
            title: `Exporting ${type}...`,
            description: "Data for " + format(dateRange.from, "MMM yyyy") + " is being generated.",
        })

        try {
            const formatType = type.toLowerCase() === 'excel' ? 'excel' : 'pdf'
            const res = await fetch(`http://localhost:4000/api/time/reports/${formatType}?start=${dateRange.from.toISOString()}&end=${dateRange.to.toISOString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!res.ok) throw new Error("Export failed")

            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `Attendance_Report_${format(dateRange.from, "MMM_yyyy")}.${formatType === 'excel' ? 'xlsx' : 'pdf'}`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast({ title: "Download Started", description: `Your ${type} report is ready.` })
        } catch (error) {
            toast({ title: "Export Failed", description: "Something went wrong while generating the file.", variant: "destructive" })
        }
    }

    return (
        <div className="container max-w-5xl py-10 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-indigo-900">Personal Reports</h1>
                    <p className="text-muted-foreground text-lg">Detailed work summaries and exports.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start text-left font-normal border-indigo-200">
                                <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                                {format(dateRange.from, "MMM yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={dateRange.from}
                                onSelect={(d) => d && setDateRange({ from: startOfMonth(d), to: endOfMonth(d) })}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-indigo-600 font-semibold uppercase text-[10px] tracking-wider">Total House</CardDescription>
                        <CardTitle className="text-3xl font-bold">{summary.totalHours}h</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">{summary.daysWorked} Days logged in range</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-600 font-semibold uppercase text-[10px] tracking-wider">Overtime</CardDescription>
                        <CardTitle className="text-3xl font-bold">{summary.overtimeHours}h</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Calculated &gt; 9h threshold</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-purple-600 font-semibold uppercase text-[10px] tracking-wider">Avg Daily</CardDescription>
                        <CardTitle className="text-3xl font-bold">
                            {summary.daysWorked > 0 ? (Number(summary.totalHours) / summary.daysWorked).toFixed(1) : "0"}h
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Productivity index</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-2xl shadow-indigo-100/40 overflow-hidden bg-white">
                <CardHeader className="bg-indigo-600 text-white pb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Download className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Export Center</CardTitle>
                            <CardDescription className="text-indigo-100">Download your files for compliance and records.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 -mt-4 bg-white rounded-t-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-start gap-4 p-6 rounded-2xl border-2 border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all cursor-pointer group"
                            onClick={() => handleDownload("Excel")}>
                            <div className="p-4 bg-emerald-100 rounded-xl text-emerald-600 group-hover:scale-110 transition-all shadow-md">
                                <FileSpreadsheet className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Spreadsheet (.xlsx)</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Perfect for accounting and manual verification. Includes all timestamps.</p>
                                <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                    Generate <span className="ml-1 group-hover:ml-3 transition-all">→</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 rounded-2xl border-2 border-slate-50 hover:border-red-100 hover:bg-red-50/20 transition-all cursor-pointer group"
                            onClick={() => handleDownload("PDF")}>
                            <div className="p-4 bg-red-100 rounded-xl text-red-600 group-hover:scale-110 transition-all shadow-md">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Document (.pdf)</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Formal HR-ready document with branding and summary charts.</p>
                                <div className="mt-4 flex items-center text-xs font-bold text-red-600 uppercase tracking-widest">
                                    Generate <span className="ml-1 group-hover:ml-3 transition-all">→</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
