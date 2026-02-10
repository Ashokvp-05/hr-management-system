import { auth } from "@/auth"
import { API_BASE_URL } from "@/lib/config"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Users,
    Calendar,
    CheckCircle,
    Clock,
    TrendingUp,
    MapPin,
    Building,
    ArrowUpRight,
    Search,
    Filter,
    Activity,
    Zap,
    Target,
    BarChart3,
    Shield,
    Flame,
    Briefcase,
    CreditCard,
    ShieldCheck,
    Star,
    ChevronRight,
    MoreHorizontal,
    Lock,
    ShieldAlert,
    Eye,
    Power,
    Check,
    X,
    FileText,
    Heart,
    AlertCircle,
    GraduationCap,
    Megaphone,
    Radio,
    UserPlus,
    FilePlus,
    Wallet,
    Laptop,
    ClipboardList,
    Download,
    Info
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PrivacyToggle } from "@/components/dashboard/PrivacyToggle"
import TeamCalendar from "@/components/dashboard/TeamCalendar"
import { PendingRequestsList } from "@/components/dashboard/PendingRequestsList"
import { Badge } from "@/components/ui/badge"
import { TeamPerformanceRadar } from "@/components/dashboard/TeamPerformanceRadar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 space-y-6 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* MODERN MANAGER LAYOUT */}
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 h-full overflow-y-auto pr-2 pb-20">

                    {/* LEFT COLUMN: TEAM OPS & LISTS (8 cols) */}
                    <div className="xl:col-span-8 flex flex-col gap-6">

                        {/* 1. MANAGER WELCOME BANNER */}
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-10 pb-14 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/30 transition-colors" />
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Operational
                                        </div>

                                        {/* ROLE GUIDE POPOVER */}
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/5 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5 cursor-help">
                                                    <Info className="w-3 h-3 text-indigo-300" /> Role Overview
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-96 p-5 bg-slate-900 border-slate-700 text-slate-300 shadow-xl">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-bold text-white text-sm mb-1">Manager Role Overview</h4>
                                                        <p className="text-xs leading-relaxed">The Manager acts as a team leader who supervises employees and ensures smooth daily operations.</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h5 className="font-bold text-white text-xs uppercase tracking-wider">Key Responsibilities</h5>
                                                        <ul className="text-xs space-y-1.5 list-disc pl-3 marker:text-indigo-500">
                                                            <li><strong className="text-slate-200">Supervise:</strong> Monitor workload & availability.</li>
                                                            <li><strong className="text-slate-200">Approve:</strong> Leaves, expenses, timesheets.</li>
                                                            <li><strong className="text-slate-200">Bridge:</strong> Connect employees & admins.</li>
                                                            <li><strong className="text-slate-200">Grow:</strong> Reviews & training support.</li>
                                                        </ul>
                                                    </div>
                                                    <div className="p-2 rounded bg-indigo-900/20 border border-indigo-500/30 text-[10px] text-indigo-200">
                                                        Note: Managers cannot modify system settings, salaries, or roles.
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Team Overview</h1>
                                    <p className="text-slate-300 font-medium text-lg">
                                        You have <span className="text-white font-bold">{overview.pendingApprovals} pending approvals</span> today.
                                    </p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <PrivacyToggle />
                                    <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl h-10 px-5 shadow-lg border-0" asChild>
                                        <Link href="/manager/reports">
                                            <BarChart3 className="w-4 h-4 mr-2" /> View Reports
                                        </Link>
                                    </Button>
                                    <Button className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl h-10 px-5 shadow-lg border-0" asChild>
                                        <Link href="/admin/leaves">
                                            <CheckCircle className="w-4 h-4 mr-2" /> Approvals
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 2. ACTIVE TEAM LIST (The "Who's Online" View) */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 py-6 px-8 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-600" /> Active Team Members
                                    </CardTitle>
                                    <CardDescription className="font-medium mt-1">
                                        Live status of your direct reports
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="gap-1.5 sensitive-data">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        {overview.totalActiveUsers} Online
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                {overview.remoteUsers.length === 0 ? (
                                    <div className="p-12 text-center text-slate-500 text-sm font-medium">
                                        No active sessions detected at the moment.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {overview.remoteUsers.map((user: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                                                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                            <Clock className="w-3 h-3" /> Clocked in at {new Date(user.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                            {user.location ? <MapPin className="w-3 h-3 text-indigo-500" /> : <Building className="w-3 h-3 text-indigo-500" />}
                                                            {user.location || "Office HQ"}
                                                        </div>
                                                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Location</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 rounded-full">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 2.5. PENDING APPROVALS QUEUE (Quick Actions) */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                            <CardHeader className="py-5 px-8 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                            Pending Requests
                                        </CardTitle>
                                        <CardDescription className="font-medium">
                                            3 items require your attention
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-sm font-bold text-indigo-600 hover:bg-indigo-50">
                                    View All
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <PendingRequestsList token={token} />
                            </CardContent>
                        </Card>

                        {/* 3. SMART WORKLOAD DISTRIBUTION */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                            <CardHeader className="py-6 px-8 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                            Smart Workload Distribution
                                        </CardTitle>
                                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100">AI Optimized</Badge>
                                    </div>
                                    <CardDescription className="font-medium">
                                        Real-time capacity monitoring & load balancing
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="hidden md:flex rounded-xl border-slate-200 text-slate-600 font-bold gap-2 hover:bg-slate-50">
                                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    Auto-Rebalance
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {[
                                        { name: "Sarah Connor", role: "Senior Dev", cap: 92, status: "Critical", tasks: 8, efficiency: "High", action: "Reassign 2 Tasks", color: "bg-rose-500" },
                                        { name: "James Bond", role: "UI Designer", cap: 45, status: "Available", tasks: 2, efficiency: "Optimal", action: "Assign New Epic", color: "bg-emerald-500" },
                                        { name: "Emily Blunt", role: "Product Owner", cap: 78, status: "Optimal", tasks: 5, efficiency: "Steady", action: "View Analytics", color: "bg-indigo-500" },
                                    ].map((user, i) => (
                                        <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                                            {/* User Info */}
                                            <div className="flex items-center gap-4 min-w-[200px]">
                                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} />
                                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</h4>
                                                    <p className="text-xs font-medium text-slate-500">{user.role}</p>
                                                </div>
                                            </div>

                                            {/* Capacity Bar */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                                                    <span>Bandwidth Utilization</span>
                                                    <span className={`font-bold ${user.cap > 90 ? 'text-rose-600' : user.cap < 50 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                                        {user.cap}%
                                                    </span>
                                                </div>
                                                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${user.color} rounded-full transition-all duration-1000`}
                                                        style={{ width: `${user.cap}%` }}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                                    <span>{user.tasks} Active Tasks</span>
                                                    <span>•</span>
                                                    <span>{user.efficiency} Efficiency</span>
                                                </div>
                                            </div>

                                            {/* Smart Action */}
                                            <div className="md:text-right min-w-[140px]">
                                                <div className="md:hidden text-xs font-bold text-slate-400 mb-1">Recommended Action</div>
                                                <Button size="sm" variant={user.cap > 90 ? "destructive" : "secondary"} className={`w-full rounded-lg font-bold text-xs shadow-sm ${user.cap > 90 ? '' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                                                    {user.action}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 5. CRITICAL AUTHORITY (High-Level Rights) */}
                        {/* 4. TEAM CALENDAR */}
                        <div className="h-full">
                            <TeamCalendar />
                        </div>

                        {/* 5. OPERATIONAL CONTROL (Shifts & Broadcast) */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                            <CardHeader className="py-4 px-6 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Radio className="w-4 h-4 text-emerald-500" /> Operational Control
                                </CardTitle>
                                <Badge variant="outline" className="text-[10px] gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Live Ops
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* LEFT: SHIFT & COVERAGE */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> Shift Coverage
                                    </h4>

                                    {/* On Call Card */}
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border border-white shadow-sm">
                                                <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah" />
                                                <AvatarFallback>SC</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Sarah Connor</p>
                                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Primary On-Call</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">Healthy</Badge>
                                    </div>

                                    {/* Shift Status */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Morning</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Full Staff</p>
                                        </div>
                                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 text-center border border-amber-100 dark:border-amber-900/20">
                                            <p className="text-[10px] font-bold text-amber-600/70 uppercase">Evening</p>
                                            <p className="text-sm font-bold text-amber-700 dark:text-amber-400">1 Short</p>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: TEAM ANNOUNCEMENTS */}
                                <div className="space-y-3 md:border-l md:pl-8 border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                                            <Megaphone className="w-3.5 h-3.5" /> Team Announcements
                                        </h4>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-inner">
                                            <textarea
                                                className="w-full bg-transparent border-0 text-sm font-medium placeholder:text-slate-400 focus:ring-0 resize-none h-20 leading-relaxed"
                                                placeholder="Type an urgent update for the team (e.g., 'Server maintenance at 5 PM')..."
                                            />
                                            <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px] bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-100 transition-colors">
                                                        Normal
                                                    </Badge>
                                                    <Badge variant="outline" className="text-[10px] border-rose-200 text-rose-600 bg-rose-50 dark:bg-rose-900/20 cursor-pointer hover:bg-rose-100 transition-colors">
                                                        Urgent
                                                    </Badge>
                                                </div>
                                                <Button size="sm" className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold px-4 shadow-sm">
                                                    Post
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 text-right mt-2 flex items-center justify-end gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                        Notifies 14 active members instantly
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                    </div>


                    {/* RIGHT COLUMN: METRICS & INSIGHTS (4 cols) */}
                    <div className="xl:col-span-4 flex flex-col gap-6">

                        {/* 1. KEY METRICS GRID (2x2) */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Attendance", value: `${overview.attendanceRate}%`, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
                                { label: "Remote", value: overview.remoteCount, icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                                { label: "Pending", value: overview.pendingApprovals, icon: CheckCircle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10" },
                                { label: "Efficiency", value: "94%", icon: Zap, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10" },
                            ].map((stat, i) => (
                                <Card key={i} className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-[1.5rem] hover:shadow-md transition-shadow">
                                    <CardContent className="p-5 flex flex-col gap-3">
                                        <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs font-medium text-muted-foreground mt-0.5">{stat.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* 2. QUICK ACTIONS HUB (Centralized Create) */}
                        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-sm">
                            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-slate-500" /> Quick Actions
                                </CardTitle>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">Shortcuts</Badge>
                            </CardHeader>
                            <CardContent className="p-4 grid grid-cols-2 gap-3">
                                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors group text-center">
                                    <div className="h-10 w-10 rounded-full bg-white dark:bg-indigo-900/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Onboard Talent</p>
                                        <p className="text-[10px] text-slate-500">Start hiring flow</p>
                                    </div>
                                </button>

                                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors group text-center">
                                    <div className="h-10 w-10 rounded-full bg-white dark:bg-rose-900/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <FilePlus className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Doc Studio</p>
                                        <p className="text-[10px] text-slate-500">Create Offer/PIP</p>
                                    </div>
                                </button>

                                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors group text-center">
                                    <div className="h-10 w-10 rounded-full bg-white dark:bg-amber-900/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <ClipboardList className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Assign Task</p>
                                        <p className="text-[10px] text-slate-500">Delegate work</p>
                                    </div>
                                </button>

                                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group text-center">
                                    <div className="h-10 w-10 rounded-full bg-white dark:bg-blue-900/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Export Report</p>
                                        <p className="text-[10px] text-slate-500">Weekly PDF Summary</p>
                                    </div>
                                </button>
                            </CardContent>
                        </Card>

                        {/* 3. STRATEGIC PRIORITIES (Goals & Velocity) */}
                        <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[1.5rem] relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Target className="w-32 h-32" />
                            </div>

                            <CardHeader className="pb-4 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                            <Target className="w-4 h-4 text-white" />
                                        </div>
                                        <CardTitle className="text-base font-bold text-white">Strategic Priorities</CardTitle>
                                    </div>
                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 font-bold backdrop-blur-md">Q1 Objectives</Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 relative z-10">
                                {/* Main Goal */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold">Launch Mobile App v2.0</h3>
                                        <span className="text-sm font-bold opacity-90">74%</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                                        <div className="h-full bg-emerald-400 rounded-full w-[74%] shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-indigo-100">
                                        <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                                        <span>Risk Factor: Moderate (Backend Delays)</span>
                                    </div>
                                </div>

                                {/* Key Results / Velocity Footer */}
                                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase opacity-60 tracking-wider">Dept Velocity</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <TrendingUp className="w-4 h-4 text-emerald-300" />
                                            <span className="text-xl font-bold">+18.2%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase opacity-60 tracking-wider">Team Morale</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                                            <span className="text-xl font-bold">High</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 4. TALENT & GROWTH ENGINE (Hiring & Development) */}
                        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-sm">
                            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-slate-500" /> Talent & Growth
                                    </CardTitle>
                                    <div className="flex gap-1">
                                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Hiring Active</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-5">
                                {/* Hiring Pipeline */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Positions</h4>
                                        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-indigo-600 hover:bg-indigo-50 px-2">View Pipeline</Button>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600">JD</div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Sr. Frontend Dev</p>
                                                    <p className="text-[10px] font-medium text-slate-500">Engineering • Round 2</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-0">Interviewing</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600">UX</div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Product Designer</p>
                                                    <p className="text-[10px] font-medium text-slate-500">Design • Finalizer</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-0">Offer Sent</Badge>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-slate-100 dark:bg-slate-800" />

                                {/* Development / Growth */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team Development</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Star className="w-3.5 h-3.5 text-amber-600" />
                                                <span className="text-xs font-bold text-amber-800 dark:text-amber-400">Reviews</span>
                                            </div>
                                            <p className="text-xl font-bold text-slate-900 dark:text-white">3 Pending</p>
                                            <p className="text-[10px] font-medium text-slate-500">Due in 2 days</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                            <div className="flex items-center gap-2 mb-1">
                                                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                                                <span className="text-xs font-bold text-blue-800 dark:text-blue-400">Budget</span>
                                            </div>
                                            <p className="text-xl font-bold text-slate-900 dark:text-white">$2.4k</p>
                                            <p className="text-[10px] font-medium text-slate-500">L&D Available</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 5. CRITICAL AUTHORITY (High-Level Rights) */}
                        <Card className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-[1.5rem] shadow-sm overflow-hidden">
                            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-slate-500" /> Critical Authority
                                    </CardTitle>
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300">
                                        Level 4
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-2">
                                <div className="space-y-1">
                                    {[
                                        { label: "Policy Override", desc: "Force approve exceptions", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
                                        { label: "Instant Approvals", desc: "Batch process all pending", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
                                        { label: "Delegation Access", desc: "Assign temp authority", icon: Users, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
                                    ].map((action, i) => (
                                        <div key={i} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm">
                                            <div className={`w-8 h-8 rounded-lg ${action.bg} flex items-center justify-center shrink-0`}>
                                                <action.icon className={`w-4 h-4 ${action.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                                                        {action.label}
                                                    </p>
                                                </div>
                                                <p className="text-[10px] font-medium text-slate-500">
                                                    {action.desc}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                </div>
            </div>
        </div >
    )
}

function BarChart({ variant, className }: { variant: string, className?: string }) {
    return <Users className={className} />
}
