import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, CalendarCheck, FileText, AlertCircle, MapPin, TrendingUp, CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import { OverviewChart } from "@/components/admin/OverviewChart"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ActiveUserList from "@/components/admin/ActiveUserList"

async function getAdminStats() {
    const session = await auth()
    const token = (session?.user as any)?.accessToken
    if (!token) return null

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 0 }
        })
        if (!res.ok) return null
        return res.json()
    } catch (e) {
        console.error(e)
        return null
    }
}

export default async function AdminDashboardPage() {
    const session = await auth()
    const token = (session?.user as any)?.accessToken || ""

    const stats = await getAdminStats() || {
        totalUsers: 0,
        pendingLeaves: 0,
        activeShifts: 0
    }

    return (
        <div className="flex-1 space-y-8">
            {/* 1. Header Section */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Executive Overview</h2>
                    <p className="text-muted-foreground">Welcome to the command center. System status is <span className="text-emerald-500 font-medium">Optimal</span>.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">Download Report</Button>
                    <Button>Invite Employee</Button>
                </div>
            </div>

            {/* 2. KPI Strip */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Workforce</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Active employees</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingLeaves}</div>
                        <p className="text-xs text-muted-foreground">Requests waiting review</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeShifts}</div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-emerald-500 font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live Updates
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payroll Est.</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$17.4k</div>
                        <p className="text-xs text-muted-foreground">Projected for this month</p>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Action Center & Analytics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Analytics Chart */}
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Workforce Analytics</CardTitle>
                        <CardDescription>Attendance trends over the past 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart />
                    </CardContent>
                </Card>

                {/* Operations Column */}
                <div className="col-span-3 space-y-4">
                    {/* Action Center */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-amber-500" /> Actions Required
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-1">
                            {stats.pendingLeaves > 0 ? (
                                <Link href="/admin/leaves" className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors border border-amber-500/20">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                                        <span className="text-sm font-medium text-amber-700 dark:text-amber-400">{stats.pendingLeaves} Leave Requests</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-amber-500" />
                                </Link>
                            ) : (
                                <div className="p-4 text-center text-xs text-muted-foreground bg-muted/30 rounded-lg">
                                    All caught up! No pending actions.
                                </div>
                            )}

                            <Link href="/admin/payroll" className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors border border-blue-500/20 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Review Payroll Batch</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-blue-500" />
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Quick Ops */}
                    <ActiveUserList token={token} />
                </div>
            </div>
        </div>
    )
}
