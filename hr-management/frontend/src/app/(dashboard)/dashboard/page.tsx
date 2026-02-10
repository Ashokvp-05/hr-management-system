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
    CalendarPlus
} from "lucide-react"

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

    return (
        <div className="flex flex-col min-h-screen">
            <AnnouncementBanner token={token} />

            <div className="flex-1 p-4 lg:p-6 space-y-4 max-w-[1920px] mx-auto w-full h-[calc(100vh-80px)] overflow-hidden flex flex-col">

                {/* MODERN HR LAYOUT: TWO COLUMNS (Main Content + Sidebar) */}
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 h-full overflow-y-auto pr-2 pb-20">

                    {/* LEFT COLUMN: CONTEXT & DATA (8 cols) */}
                    <div className="xl:col-span-8 flex flex-col gap-8">

                        {/* 1. WELCOME BANNER & QUICK ACTIONS */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-colors" />
                            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-medium flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> System Online
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium opacity-80">
                                            {today}
                                        </div>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Good morning, {userName}</h1>
                                    <p className="text-indigo-100 font-medium text-lg">You're on track with your weekly goals.</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. KEY METRICS GRID */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Total Hours", value: summary.totalHours, unit: "h", icon: BarChart4, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
                                { label: "Overtime", value: summary.overtimeHours, unit: "h", icon: Zap, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                                { label: "Leave Balance", value: totalLeaves, unit: "Days", icon: Layers, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                                { label: "Work Streak", value: summary.daysWorked, unit: "Days", icon: Target, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
                            ].map((stat, i) => (
                                <Card key={i} className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-[1.5rem] hover:shadow-md transition-shadow">
                                    <CardContent className="p-5 flex flex-col gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                                {stat.value} <span className="text-sm font-medium text-muted-foreground">{stat.unit}</span>
                                            </p>
                                            <p className="text-xs font-medium text-muted-foreground mt-1">{stat.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* 3. ACTIVITY CHART */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Attendance Activity</h3>
                                    <p className="text-sm text-slate-500">Your visual timeline for this week</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-indigo-600 font-medium hover:bg-indigo-50 rounded-xl">
                                    View Detailed Report <ArrowUpRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                            <div className="h-[300px] w-full">
                                <AttendanceChart token={token} />
                            </div>
                        </div>

                        {/* 4. ANALYTICS METRICS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-full">
                                <TicketAnalytics token={token} />
                            </div>
                            <div className="h-full">
                                <ProductivityAnalytics token={token} />
                            </div>
                        </div>

                    </div>


                    {/* RIGHT COLUMN: TOOLS & SIDEBAR (4 cols) */}
                    <div className="xl:col-span-4 flex flex-col gap-6">

                        {/* 1. CLOCK WIDGET (Primary Sidebar Tool) */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-2 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 relative z-20">
                            <ClockWidget token={token} />
                        </div>

                        {/* 2. AI COACH */}
                        <SmartFocusWidget />

                        {/* 3. QUICK INFO TABS */}
                        <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-2 space-y-2 border border-slate-200 dark:border-slate-800">
                            <div className="p-4 bg-white dark:bg-black/20 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/50">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Upcoming Schedule</h4>
                                <UpcomingEventsWidget />
                            </div>
                            <div className="p-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Team Status</h4>
                                <TeamAvailabilityWidget />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}
