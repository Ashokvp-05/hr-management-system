import { auth } from "@/auth"
import { API_BASE_URL } from "@/lib/config"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Bell,
    Calendar,
    Clock,
    User,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Zap,
    TrendingUp,
    Users,
    ArrowUpRight,
    MoreHorizontal,
    Activity,
    Layers,
    LayoutDashboard,
    Cpu,
    Target,
    BarChart4,
    Shield,
    CalendarPlus,
    Calculator
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ClockWidget from "@/components/dashboard/ClockWidget"
import TimeSummary from "@/components/dashboard/TimeSummary"
import TeamAvailabilityWidget from "@/components/dashboard/TeamAvailabilityWidget"
import AttendanceChart from "@/components/dashboard/AttendanceChart"
import NotificationBell from "@/components/layout/NotificationBell"
import { ProductivityAnalytics } from "@/components/dashboard/ProductivityAnalytics"
import { TicketAnalytics } from "@/components/dashboard/TicketAnalytics"
import { UpcomingEventsWidget } from "@/components/dashboard/UpcomingEventsWidget"
import { AnnouncementBanner } from "@/components/dashboard/AnnouncementBanner"
import ProfessionalStatusWidget from "@/components/dashboard/ProfessionalStatusWidget"
import MoodPulseWidget from "@/components/dashboard/MoodPulseWidget"
import SystemStatusWidget from "@/components/dashboard/SystemStatusWidget"
import SmartFocusWidget from "@/components/dashboard/SmartFocusWidget"


export default async function DashboardPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const role = (session.user?.role || "EMPLOYEE").toUpperCase()
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'VIEWER_ADMIN'].includes(role)

    // Redirect non-employees to their specific dashboards
    if (isAdmin) {
        redirect("/admin")
    } else if (role === 'MANAGER') {
        redirect("/manager")
    }

    const token = (session.user as any)?.accessToken || ""
    const userName = session.user?.name || "Employee"

    // Fetch Real Stats from Backend
    let summary = { totalHours: "0.00", overtimeHours: "0.00", daysWorked: 0 }
    let leaveBalance = { sick: 0, casual: 0, earned: 0 }

    try {
        const [summaryRes, balanceRes] = await Promise.all([
            fetch(`${API_BASE_URL}/time/summary`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/leaves/balance`, { headers: { Authorization: `Bearer ${token}` } })
        ])

        if (summaryRes.ok) summary = await summaryRes.json()
        if (balanceRes.ok) leaveBalance = await balanceRes.json()
    } catch (e) {
        console.error("Failed to fetch dashboard data")
    }

    const totalLeaves = leaveBalance.sick + leaveBalance.casual + leaveBalance.earned
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    const attendanceRate = "57.5" // Mock for visual alignment with image
    const averageLate = "0.80" // Mock for visual alignment with image
    const employeesPresent = "33" // Mock for visual alignment with image

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
            <AnnouncementBanner token={token} />

            <div className="flex-1 p-4 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">

                {/* TWO COLUMN LAYOUT: Main Content (Left) + Tools (Right) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: 8 cols */}
                    <div className="xl:col-span-8 space-y-8">

                        {/* 1. GREETING CARD */}
                        <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-sm font-bold opacity-80 mb-2 uppercase tracking-widest">{role} / {role.toLowerCase()}</p>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Good morning, {userName.split(' ')[0]}</h1>
                                <p className="text-indigo-100 font-medium text-lg">Time to check in with your weekly goals.</p>
                            </div>
                        </div>

                        {/* 2. ATTENDANCE SUMMARY (3 COLS) */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white px-2">Attendance Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: "Attendance Rate", value: `${attendanceRate}%` },
                                    { label: "Average Late", value: averageLate },
                                    { label: "Employees Present", value: employeesPresent },
                                ].map((stat, i) => (
                                    <Card key={i} className="border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] p-6 transition-all hover:shadow-md">
                                        <CardContent className="p-0">
                                            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                                {stat.value}
                                                {stat.label === "Attendance Rate" && <span className="text-lg text-slate-400 ml-1">%</span>}
                                            </p>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* 3. ATTENDANCE ACTIVITY */}
                        <Card className="border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Attendance Activity</h3>
                                    <p className="text-sm text-slate-500">See your attendance with past week</p>
                                </div>
                                <Button variant="ghost" asChild className="text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl flex items-center gap-1 group">
                                    <Link href="/reports">
                                        View Detailed Report <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{attendanceRate}<span className="text-lg text-slate-400 ml-1">%</span></p>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Attendance Rate</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{averageLate}<span className="text-sm text-slate-400 ml-1">h/d</span></p>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Average Rate</p>
                                </div>
                            </div>

                            <div className="h-[250px] w-full">
                                <AttendanceChart token={token} />
                            </div>
                        </Card>

                        {/* 4. TODAY'S SCHEDULE (BOTTOM) */}
                        <Card className="border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Today's Schedule</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { time: "8:30", title: "Strategic Meeting", location: "Meeting Room 1", status: "Online", color: "bg-emerald-400" },
                                    { time: "10:00", title: "Client Consultation", location: "Acme Corp", status: "In A Meeting", color: "bg-amber-400" },
                                    { time: "11:30", title: "Lunch Break", location: "", status: "On Leave", color: "bg-indigo-400" },
                                    { time: "13:00", title: "Team Presentation", location: "Conference Room", status: "Offline", color: "bg-rose-400" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{item.time}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white underline decoration-slate-200 underline-offset-4 group-hover:decoration-indigo-500 transition-colors">{item.title}</p>
                                                    {item.location && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.location}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2",
                                            item.status === 'Online' ? "bg-emerald-50 text-emerald-600" :
                                                item.status === 'In A Meeting' ? "bg-amber-50 text-amber-600" :
                                                    item.status === 'On Leave' ? "bg-indigo-50 text-indigo-600" :
                                                        "bg-rose-50 text-rose-600"
                                        )}>
                                            <span className={cn("w-2 h-2 rounded-full", item.color)} />
                                            {item.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: 4 cols */}
                    <div className="xl:col-span-4 space-y-8">
                        {/* 1. TIME TRACKER */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 relative z-20 overflow-hidden">
                            <ClockWidget token={token} />
                        </div>

                        {/* 2. PRODUCTIVITY METRICS */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6 p-2">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-600">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Productivity</h3>
                            </div>
                            <ProductivityAnalytics token={token} />
                        </div>

                        {/* 3. RECENT PAYSLIP WIDGET */}
                        <Card className="border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-600">
                                        <Calculator className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Recent Payslip</h3>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">January 2026</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold text-slate-400">$</span>
                                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">4,250.00</span>
                                    </div>
                                </div>

                                <Button asChild className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95">
                                    <Link href="/payslip" className="flex items-center justify-center gap-2">
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </Card>

                        {/* 4. TODAY'S SCHEDULE (VERTICAL) */}
                        <Card className="border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Schedule</h3>
                            </div>
                            <div className="space-y-8 relative">
                                <div className="absolute left-10 top-2 bottom-2 w-px bg-slate-100 dark:bg-slate-800" />
                                {[
                                    { time: "8:30", title: "Strategic Meeting", location: "Meeting Room 1", color: "bg-emerald-400" },
                                    { time: "10:00", title: "Client Consultation", location: "Acme Corp", color: "bg-amber-400" },
                                    { time: "11:30", title: "Lunch Break", location: "", color: "bg-indigo-400" },
                                    { time: "13:00", title: "Team Presentation", location: "Conference Room", color: "bg-rose-400" },
                                    { time: "2:30", title: "Code Review", location: "Web Team", color: "bg-pink-400" },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 relative z-10">
                                        <div className="w-12 pt-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className={`w-3 h-3 rounded-full ${item.color} mt-1.5 shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_#0f172a]`} />
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                                                {item.location && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.location}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

