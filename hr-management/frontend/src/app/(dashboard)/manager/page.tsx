import { auth } from "@/auth"
import { API_BASE_URL } from "@/lib/config"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Users, Calendar, CheckCircle, Clock, TrendingUp, MapPin, Building,
    ArrowUpRight, Search, Filter, Activity, Zap, Target, BarChart3,
    Briefcase, Star, ChevronRight, Heart, AlertCircle, GraduationCap,
    Megaphone, Radio, UserPlus, FilePlus, ClipboardList, Download,
    Info, Bell, RefreshCw, TrendingDown, Award, Coffee
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PrivacyToggle } from "@/components/dashboard/PrivacyToggle"
import TeamCalendar from "@/components/dashboard/TeamCalendar"
import { PendingRequestsList } from "@/components/dashboard/PendingRequestsList"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { TeamAnnouncer } from "@/components/dashboard/TeamAnnouncer"

export default async function ManagerDashboardPage() {
    const session = await auth()
    const role = (session?.user?.role || "USER").toUpperCase()
    const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'VIEWER_ADMIN']

    if (!session || (role !== 'MANAGER' && !ADMIN_ROLES.includes(role))) {
        redirect("/dashboard")
    }

    const token = (session.user as any)?.accessToken || ""
    const userName = session.user?.name || "Manager"

    let overview = {
        totalActiveUsers: 0,
        clockedIn: 0,
        remoteCount: 0,
        officeCount: 0,
        attendanceRate: 0,
        pendingApprovals: 0,
        alerts: [] as any[],
        remoteUsers: [] as any[]
    }

    try {
        const res = await fetch(`${API_BASE_URL}/admin/overview`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        })
        if (res.ok) overview = await res.json()
    } catch (e) {
        console.error("Failed to fetch manager data")
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
            <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* MODERN MANAGER LAYOUT */}
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 h-full overflow-y-auto pr-2 pb-20">

                    {/* LEFT COLUMN: TEAM OPS & LISTS (8 cols) */}
                    <div className="xl:col-span-8 flex flex-col gap-6">

                        {/* 1. ENHANCED MANAGER WELCOME BANNER */}
                        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-8 md:p-10 pb-12 md:pb-14 text-white shadow-2xl shadow-indigo-900/50 overflow-hidden group">
                            {/* Animated Background Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-indigo-400/30 transition-all duration-700" />
                            <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/20 rounded-full -ml-16 -mb-16 blur-3xl group-hover:bg-violet-500/30 transition-all duration-700" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                                        <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-bold flex items-center gap-2 shadow-lg">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                            </span>
                                            Operational
                                        </div>

                                        {/* ROLE GUIDE POPOVER */}
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-xs font-medium text-slate-200 transition-all duration-300 flex items-center gap-2 cursor-help shadow-lg hover:shadow-xl hover:scale-105">
                                                    <Info className="w-3.5 h-3.5 text-indigo-200" /> Role Guide
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-96 p-6 bg-slate-900 border-slate-700 text-slate-300 shadow-2xl rounded-2xl">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                                                            <Award className="w-5 h-5 text-indigo-400" />
                                                            Manager Role Overview
                                                        </h4>
                                                        <p className="text-sm leading-relaxed text-slate-400">The Manager acts as a team leader who supervises employees and ensures smooth daily operations.</p>
                                                    </div>
                                                    <Separator className="bg-slate-700" />
                                                    <div className="space-y-3">
                                                        <h5 className="font-bold text-white text-sm uppercase tracking-wider">Key Responsibilities</h5>
                                                        <ul className="text-sm space-y-2 list-none pl-0">
                                                            <li className="flex items-start gap-3">
                                                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                                                <span><strong className="text-slate-200">Supervise:</strong> Monitor workload & availability.</span>
                                                            </li>
                                                            <li className="flex items-start gap-3">
                                                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                                                <span><strong className="text-slate-200">Approve:</strong> Leaves, expenses, timesheets.</span>
                                                            </li>
                                                            <li className="flex items-start gap-3">
                                                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                                                <span><strong className="text-slate-200">Bridge:</strong> Connect employees & admins.</span>
                                                            </li>
                                                            <li className="flex items-start gap-3">
                                                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                                                <span><strong className="text-slate-200">Grow:</strong> Reviews & training support.</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                        <span>Note: Managers cannot modify system settings, salaries, or user roles.</span>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>

                                        <div className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {today}
                                        </div>
                                    </div>

                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-3 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                                        Team Command Center
                                    </h1>

                                    <p className="text-slate-200 font-medium text-base md:text-lg max-w-2xl">
                                        You have <span className="text-white font-black text-xl" data-privacy="true">{overview.pendingApprovals}</span> pending approvals requiring your attention today.
                                    </p>

                                    <div className="flex items-center gap-4 mt-6 flex-wrap">
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                                            <Users className="w-4 h-4 text-emerald-300" />
                                            <span className="text-sm font-bold">{overview.totalActiveUsers} Active</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                                            <Activity className="w-4 h-4 text-blue-300" />
                                            <span className="text-sm font-bold">{overview.attendanceRate}% Attendance</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-center flex-wrap">
                                    <PrivacyToggle />
                                    <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl h-11 px-6 shadow-xl border-0 hover:scale-105 transition-all duration-300" asChild>
                                        <Link href="/manager/reports">
                                            <BarChart3 className="w-4 h-4 mr-2" /> View Reports
                                        </Link>
                                    </Button>
                                    <Button className="bg-indigo-500 text-white hover:bg-indigo-400 font-bold rounded-xl h-11 px-6 shadow-xl border-0 hover:scale-105 transition-all duration-300" asChild>
                                        <Link href="/admin/leaves">
                                            <CheckCircle className="w-4 h-4 mr-2" /> Approvals ({overview.pendingApprovals})
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 2. ENHANCED ACTIVE TEAM LIST with Search & Filter */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 py-6 px-6 md:px-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                                Active Team Members
                                            </CardTitle>
                                            <CardDescription className="font-medium mt-1">
                                                Live status of your direct reports
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <Badge variant="outline" className="gap-2 px-3 py-1.5 bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            {overview.totalActiveUsers} Online
                                        </Badge>
                                        <Button variant="outline" size="sm" className="rounded-xl hover:bg-slate-50">
                                            <RefreshCw className="w-3.5 h-3.5 mr-2" />
                                            Refresh
                                        </Button>
                                    </div>
                                </div>

                                {/* Search & Filter Bar */}
                                <div className="flex gap-3 mt-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            placeholder="Search team members..."
                                            className="pl-10 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <Button variant="outline" size="icon" className="rounded-xl shrink-0">
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                {overview.remoteUsers.length === 0 ? (
                                    <div className="p-16 text-center">
                                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Coffee className="w-10 h-10 text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 text-base font-semibold mb-1">No active sessions detected</p>
                                        <p className="text-slate-400 text-sm">Team members will appear here when they clock in</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {overview.remoteUsers.map((user: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-5 md:px-8 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-800/50 transition-all duration-300 cursor-pointer group">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-2 ring-slate-100 dark:ring-slate-800">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} />
                                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold">
                                                            {user.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" data-privacy="true">
                                                            {user.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                            <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5" data-privacy="true">
                                                                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                                                Clocked in at {new Date(user.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                            <span className="text-slate-300">•</span>
                                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                                {user.location ? <MapPin className="w-3.5 h-3.5 text-emerald-500" /> : <Building className="w-3.5 h-3.5 text-blue-500" />}
                                                                {user.location || "Office HQ"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full shrink-0">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 3. ENHANCED PENDING APPROVALS */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="py-6 px-6 md:px-8 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                                            <Bell className="w-6 h-6 text-white animate-pulse" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                                Pending Requests
                                            </CardTitle>
                                            <CardDescription className="font-medium mt-1">
                                                {overview.pendingApprovals} items require your attention
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl" asChild>
                                        <Link href="/admin/leaves">
                                            View All <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <PendingRequestsList token={token} />
                            </CardContent>
                        </Card>

                        {/* 4. TEAM CALENDAR */}
                        <div className="h-full">
                            <TeamCalendar />
                        </div>

                        {/* 5. OPERATIONAL CONTROL */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="py-5 px-6 md:px-8 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                            <Radio className="w-5 h-5 text-white" />
                                        </div>
                                        <CardTitle className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                                            Operational Control
                                        </CardTitle>
                                    </div>
                                    <Badge variant="outline" className="text-xs gap-2 px-3 py-1 bg-emerald-50 border-emerald-200 text-emerald-700">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        Live Ops
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Shift Coverage */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Shift Coverage
                                    </h4>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-100 dark:border-emerald-900/20">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                                                <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah" />
                                                <AvatarFallback className="bg-emerald-500 text-white font-bold">SC</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Sarah Connor</p>
                                                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">Primary On-Call</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-0 shadow-lg">Healthy</Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center border border-slate-100 dark:border-slate-800">
                                            <p className="text-xs font-bold text-slate-400 uppercase">Morning</p>
                                            <p className="text-base font-bold text-slate-700 dark:text-slate-200 mt-1">Full Staff</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 text-center border border-amber-200 dark:border-amber-900/20">
                                            <p className="text-xs font-bold text-amber-600 uppercase">Evening</p>
                                            <p className="text-base font-bold text-amber-700 dark:text-amber-400 mt-1">1 Short</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Announcements */}
                                <TeamAnnouncer token={token} activeCount={overview.totalActiveUsers} />
                            </CardContent>
                        </Card>

                    </div>

                    {/* RIGHT COLUMN: METRICS & INSIGHTS (4 cols) */}
                    <div className="xl:col-span-4 flex flex-col gap-6">

                        {/* 1. ENHANCED KEY METRICS GRID */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Attendance", value: `${overview.attendanceRate}%`, icon: Activity, color: "text-indigo-600", bg: "bg-gradient-to-br from-indigo-500 to-violet-600", trend: "+2.3%" },
                                { label: "Remote", value: overview.remoteCount, icon: MapPin, color: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-500 to-teal-600", trend: "+5" },
                                { label: "Pending", value: overview.pendingApprovals, icon: Bell, color: "text-amber-600", bg: "bg-gradient-to-br from-amber-500 to-orange-600", trend: "-3" },
                                { label: "Efficiency", value: "94%", icon: Zap, color: "text-rose-600", bg: "bg-gradient-to-br from-rose-500 to-pink-600", trend: "+1.2%" },
                            ].map((stat, i) => (
                                <Card key={i} className="border-0 shadow-lg bg-white dark:bg-slate-900 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden">
                                    <CardContent className="p-5 relative">
                                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-500`} />
                                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shadow-lg mb-3`}>
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                                                {stat.value}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-bold text-slate-500">{stat.label}</p>
                                                <p className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'} flex items-center gap-1`}>
                                                    {stat.trend.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    {stat.trend}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* 2. ENHANCED QUICK ACTIONS */}
                        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-amber-500 fill-amber-500" /> Quick Actions
                                    </CardTitle>
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-bold">4 Shortcuts</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 grid grid-cols-2 gap-3">
                                <Link href="/manager/team" className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border-2 border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300 group text-center">
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-indigo-900/50 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <UserPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Onboard Talent</p>
                                        <p className="text-xs text-slate-500">Start hiring flow</p>
                                    </div>
                                </Link>

                                <Link href="/manager/reports" className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-rose-100 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-lg transition-all duration-300 group text-center">
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-rose-900/50 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <FilePlus className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Doc Studio</p>
                                        <p className="text-xs text-slate-500">Create Offer/PIP</p>
                                    </div>
                                </Link>

                                <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-100 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-lg transition-all duration-300 group text-center">
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-amber-900/50 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <ClipboardList className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Assign Task</p>
                                        <p className="text-xs text-slate-500">Delegate work</p>
                                    </div>
                                </button>

                                <Link href="/manager/reports" className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300 group text-center">
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-blue-900/50 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Export Report</p>
                                        <p className="text-xs text-slate-500">Weekly Summary</p>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* 3. STRATEGIC PRIORITIES */}
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 text-white rounded-3xl relative overflow-hidden group hover:shadow-2xl transition-shadow">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Target className="w-40 h-40 group-hover:rotate-12 transition-transform duration-700" />
                            </div>
                            <CardHeader className="pb-4 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-lg font-bold text-white">Strategic Priorities</CardTitle>
                                    </div>
                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 font-bold backdrop-blur-md shadow-lg">Q1 Objectives</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 relative z-10">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-bold">Launch Mobile App v2.0</h3>
                                        <span className="text-lg font-bold opacity-90">74%</span>
                                    </div>
                                    <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full w-[74%] shadow-[0_0_16px_rgba(52,211,153,0.8)] transition-all duration-1000" />
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 text-sm font-medium text-indigo-100">
                                        <AlertCircle className="w-4 h-4 text-amber-300" />
                                        <span>Risk Factor: Moderate (Backend Delays)</span>
                                    </div>
                                </div>
                                <Separator className="bg-white/10" />
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold uppercase opacity-60 tracking-wider mb-2">Dept Velocity</p>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-emerald-300" />
                                            <span className="text-2xl font-black">+18.2%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase opacity-60 tracking-wider mb-2">Team Morale</p>
                                        <div className="flex items-center gap-2">
                                            <Heart className="w-5 h-5 text-rose-300 fill-rose-300" />
                                            <span className="text-2xl font-black">High</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 4. TALENT & GROWTH */}
                        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                            <Briefcase className="w-5 h-5 text-white" />
                                        </div>
                                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                            Talent & Growth
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-bold text-slate-500 uppercase">Hiring Active</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Positions</h4>
                                        <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 hover:bg-indigo-50 px-3 rounded-lg font-bold">
                                            View Pipeline →
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { role: "Sr. Frontend Dev", dept: "Engineering", stage: "Round 2", status: "Interviewing", color: "indigo" },
                                            { role: "Product Designer", dept: "Design", stage: "Finalizer", status: "Offer Sent", color: "emerald" }
                                        ].map((hire, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${hire.color === 'indigo' ? 'from-indigo-500 to-violet-600' : 'from-emerald-500 to-teal-600'} flex items-center justify-center font-bold text-sm text-white shadow-md`}>
                                                        {hire.role.split(' ').map(w => w[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{hire.role}</p>
                                                        <p className="text-xs font-medium text-slate-500">{hire.dept} • {hire.stage}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className={`${hire.color === 'indigo' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'} border-0 font-bold`}>
                                                    {hire.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Separator className="bg-slate-100 dark:bg-slate-800" />
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Team Development</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-900/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                                                <span className="text-xs font-bold text-amber-800 dark:text-amber-400">Reviews</span>
                                            </div>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">3</p>
                                            <p className="text-xs font-medium text-slate-500 mt-1">Due in 2 days</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-100 dark:border-blue-900/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <GraduationCap className="w-4 h-4 text-blue-600" />
                                                <span className="text-xs font-bold text-blue-800 dark:text-blue-400">Budget</span>
                                            </div>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">$2.4k</p>
                                            <p className="text-xs font-medium text-slate-500 mt-1">L&D Available</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                </div>
            </div>
        </div>
    )
}
