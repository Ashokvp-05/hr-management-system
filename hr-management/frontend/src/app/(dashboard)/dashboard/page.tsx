import { auth } from "@/auth"
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
    MoreHorizontal
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ClockWidget from "@/components/dashboard/ClockWidget"
import TimeSummary from "@/components/dashboard/TimeSummary"
import TeamAvailabilityWidget from "@/components/dashboard/TeamAvailabilityWidget"
import AttendanceChart from "@/components/dashboard/AttendanceChart"
import NotificationBell from "@/components/layout/NotificationBell"
import SystemStatusWidget from "@/components/dashboard/SystemStatusWidget"
import ComplianceWidget from "@/components/dashboard/ComplianceWidget"

export default async function DashboardPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const token = (session.user as any)?.accessToken || ""
    const userName = session.user?.name || "Employee"

    // Fetch Real Stats from Backend
    let summary = { totalHours: "0.00", overtimeHours: "0.00", daysWorked: 0 }
    let leaveBalance = { sick: 0, casual: 0, earned: 0 }

    try {
        const [summaryRes, balanceRes] = await Promise.all([
            fetch(`http://localhost:4000/api/time/summary`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`http://localhost:4000/api/leaves/balance`, { headers: { Authorization: `Bearer ${token}` } })
        ])

        if (summaryRes.ok) summary = await summaryRes.json()
        if (balanceRes.ok) leaveBalance = await balanceRes.json()
    } catch (e) {
        console.error("Failed to fetch dashboard data")
    }

    const totalLeaves = leaveBalance.sick + leaveBalance.casual + leaveBalance.earned

    // Modern Date Format
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{today}</p>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                        Welcome back, <span className="text-indigo-600">{userName}</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationBell />
                    <Button variant="outline" className="rounded-full shadow-none border-border/60 hover:bg-muted" asChild>
                        <Link href="/profile">My Profile</Link>
                    </Button>
                    <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20" asChild>
                        <Link href="/leave" className="flex items-center gap-2">
                            Apply Leave <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            <Separator className="bg-border/60" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Prime Actions & Analytics (8 cols) */}
                <div className="lg:col-span-8 space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Clock Widget Card */}
                        <ClockWidget token={token} />

                        {/* Analytic Overview */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-500" />
                                Week at a Glance
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="shadow-sm border-l-4 border-l-emerald-500">
                                    <CardContent className="p-4 flex flex-col justify-center">
                                        <p className="text-xs text-muted-foreground uppercase font-bold">Past 7 Days</p>
                                        <div className="text-2xl font-bold mt-1">{summary.totalHours}h</div>
                                        <p className="text-[10px] text-muted-foreground">{summary.daysWorked} Days Active</p>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm border-l-4 border-l-blue-500">
                                    <CardContent className="p-4 flex flex-col justify-center">
                                        <p className="text-xs text-muted-foreground uppercase font-bold">Overtime</p>
                                        <div className="text-2xl font-bold mt-1">+{summary.overtimeHours}h</div>
                                        <p className="text-[10px] text-emerald-600 font-medium">Confirmed</p>
                                    </CardContent>
                                </Card>
                                <Card className="col-span-2 shadow-sm border-dashed">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold">Leave Balance</p>
                                            <div className="text-xl font-bold mt-1">{totalLeaves} Days</div>
                                            <p className="text-[10px] text-muted-foreground">S:{leaveBalance.sick} C:{leaveBalance.casual} E:{leaveBalance.earned}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href="/leave" className="text-xs">Apply Now →</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Department Activity</h2>
                            <Button variant="link" size="sm" className="text-indigo-600 p-0 h-auto" asChild>
                                <Link href="/reports">View Detailed Analytics</Link>
                            </Button>
                        </div>
                        <AttendanceChart token={token} />
                    </div>

                </div>

                {/* RIGHT COLUMN: Context & Social (4 cols) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Team Widget - Redesigned container */}
                    <div className="bg-muted/30 rounded-xl p-1 border border-border/50">
                        <TeamAvailabilityWidget />
                    </div>

                    {/* System Status & Compliance */}
                    <SystemStatusWidget />
                    <ComplianceWidget />

                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-sm">Design Team</h4>
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-600 font-bold text-xs">JD</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Project "Titan" Sync</p>
                                    <p className="text-xs text-muted-foreground">10:00 AM &bull; Room 302</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-xs">HR</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Performance Review</p>
                                    <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
