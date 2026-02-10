import { auth } from "@/auth"
import { API_BASE_URL } from "@/lib/config"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Activity,
    Users,
    FileText,
    ArrowUpRight,
    Briefcase,
    Shield,
    Clock,
    Building,
    Laptop,
    AlertTriangle,
    Settings,
    FileBarChart,
    Plus,
    Calendar,
    Zap,
    Target,
    Layers,
    Database,
    ShieldAlert,
    Search,
    MoreHorizontal
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SystemHealthWidget } from "@/components/admin/widgets/SystemHealthWidget"
import { ComplianceWidget } from "@/components/admin/widgets/ComplianceWidget"
import { QuickActionBar } from "@/components/admin/widgets/QuickActionBar"
import { AdminConsole } from "@/components/admin/AdminConsole"
import { OrganizationalHealthRadar } from "@/components/admin/widgets/OrganizationalHealthRadar"

export default async function AdminDashboardPage() {
    const session = await auth()

    const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'VIEWER_ADMIN', 'MANAGER']
    const role = (session?.user?.role || "USER").toUpperCase()

    if (!session || !ADMIN_ROLES.includes(role)) {
        redirect("/dashboard")
    }

    const token = (session.user as any)?.accessToken || ""
    const userName = session.user?.name || "Admin"

    // Fetch Admin Data
    let overview = {
        totalActiveUsers: 0,
        clockedIn: 0,
        remoteCount: 0,
        officeCount: 0,
        attendanceRate: 0,
        pendingApprovals: 0,
        alerts: [] as any[],
        recentActivity: [],
        remoteUsers: [],
        health: null,
        compliance: null
    }
    let pendingUsers = []
    let pendingLeaves = []

    try {
        const [overviewRes, pendingUsersRes, leavesRes] = await Promise.all([
            fetch(`${API_BASE_URL}/admin/overview`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
            fetch(`${API_BASE_URL}/admin/pending-users`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
            fetch(`${API_BASE_URL}/leaves/all`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
        ])

        if (overviewRes.ok) overview = await overviewRes.json()
        if (pendingUsersRes.ok) pendingUsers = await pendingUsersRes.json()
        if (leavesRes.ok) {
            const allLeaves = await leavesRes.json() as any[]
            pendingLeaves = allLeaves.filter(l => l.status === 'PENDING')
        }
    } catch (e) {
        console.error("Failed to fetch admin dashboard data", e)
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    return (

        <div className="flex flex-col min-h-screen">
            <div className="flex-1 space-y-6 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

                {/* ADMIN TABS WRAPPER */}
                <Tabs defaultValue="users" className="space-y-8">

                    {/* TOP HEADER & CONTROLS */}
                    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                        {/* HEADER */}
                        <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 p-2 pr-6 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Admin God Mode</h1>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>{role} Access</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                    <span>{today}</span>
                                </div>
                            </div>
                        </div>

                        {/* TAB LIST */}
                        <TabsList className="bg-slate-100 dark:bg-slate-800/50 p-1 h-12 rounded-xl">
                            <TabsTrigger value="overview" className="h-10 px-6 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-xs font-bold uppercase tracking-wide">Overview</TabsTrigger>
                            <TabsTrigger value="users" className="h-10 px-6 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                                <Users className="w-3.5 h-3.5" /> User Mgmt
                            </TabsTrigger>
                            <TabsTrigger value="system" className="h-10 px-6 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-xs font-bold uppercase tracking-wide">System Pulse</TabsTrigger>
                            <TabsTrigger value="security" className="h-10 px-6 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-xs font-bold uppercase tracking-wide">Security</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* TAB: OVERVIEW */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* METRICS STRIP */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Attendance Yield", value: `${overview.attendanceRate}%`, unit: "Live", icon: Clock, color: "text-indigo-500" },
                                { label: "Deployment Mix", value: `${overview.remoteCount}`, unit: "Remote", icon: Laptop, color: "text-emerald-500" },
                                { label: "Strategic Queue", value: overview.pendingApprovals, unit: "Actions", icon: FileText, color: "text-amber-500" },
                                { label: "System Uptime", value: "99.8", unit: "%", icon: Activity, color: "text-rose-500" },
                            ].map((stat, i) => (
                                <Card key={i} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* WIDGETS GRID */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            <div className="xl:col-span-2">
                                <AdminConsole role={role} token={token} overview={overview} pendingUsers={pendingUsers} pendingLeaves={pendingLeaves} />
                            </div>
                            <div className="space-y-6">
                                <OrganizationalHealthRadar token={token} />
                                <QuickActionBar />
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB: USER MANAGEMENT (GOD MODE) */}
                    <TabsContent value="users" className="space-y-6">
                        <Card className="border-indigo-100 dark:border-indigo-900/50 bg-white dark:bg-slate-900 shadow-md">
                            <CardHeader className="border-b border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/10 py-4 px-6 flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-black text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                                        <Database className="w-5 h-5" /> Master User Database
                                    </CardTitle>
                                    <CardDescription className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                                        Full Create / Read / Update / Delete Access
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="bg-white font-bold text-xs">
                                        <FileText className="w-3.5 h-3.5 mr-2" /> Export CSV
                                    </Button>
                                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs" asChild>
                                        <Link href="/admin/employees/new">
                                            <Plus className="w-3.5 h-3.5 mr-2" /> Add User
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-slate-800/10 border-b border-indigo-100 dark:border-indigo-900/50">
                                    <div className="relative">
                                        <Users className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input className="w-full h-9 pl-9 rounded-md border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-900" placeholder="Search users..." />
                                    </div>
                                    <select className="h-9 px-3 rounded-md border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-900">
                                        <option>Role: All</option>
                                        <option>Admin</option>
                                        <option>Manager</option>
                                        <option>Employee</option>
                                    </select>
                                    <select className="h-9 px-3 rounded-md border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-900">
                                        <option>Status: All</option>
                                        <option>Active</option>
                                        <option>Suspended</option>
                                    </select>
                                    <Button variant="secondary" className="h-9 font-bold text-xs">Bulk Actions</Button>
                                </div>

                                {/* GOD MODE TABLE HEADER */}
                                <div className="grid grid-cols-12 gap-4 p-4 text-[10px] uppercase tracking-widest font-black text-slate-400 border-b border-indigo-100 dark:border-indigo-900/50">
                                    <div className="col-span-4">User Identity</div>
                                    <div className="col-span-2">Role & Dept</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-2">Last Active</div>
                                    <div className="col-span-2 text-right">Controls</div>
                                </div>

                                {/* MOCK ROWS FOR GOD MODE */}
                                {[
                                    { name: "Sarah Connor", email: "sarah@nexus.com", role: "Manager", dept: "Engineering", status: "Active", last: "2m ago" },
                                    { name: "John Wick", email: "john@nexus.com", role: "Employee", dept: "Security", status: "Active", last: "1h ago" },
                                    { name: "Bruce Wayne", email: "bruce@nexus.com", role: "Admin", dept: "Executive", status: "Active", last: "Just now" },
                                    { name: "Peter Parker", email: "peter@nexus.com", role: "Intern", dept: "Research", status: "Suspended", last: "2d ago" },
                                ].map((u, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 group">
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900 dark:text-white">{u.name}</p>
                                                <p className="text-xs text-slate-500">{u.email}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <Badge variant="outline" className="text-[10px]">{u.role}</Badge>
                                            <p className="text-[10px] text-slate-400 mt-1">{u.dept}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`inline-flex h-2 w-2 rounded-full mr-2 ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{u.status}</span>
                                        </div>
                                        <div className="col-span-2 text-xs text-slate-500 font-medium">{u.last}</div>
                                        <div className="col-span-2 flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Settings className="w-3.5 h-3.5" /></Button>
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"><ShieldAlert className="w-3.5 h-3.5" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB: SYSTEM PULSE */}
                    <TabsContent value="system" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SystemHealthWidget health={overview.health} />
                            <ComplianceWidget stats={overview.compliance} />
                        </div>
                    </TabsContent>

                    {/* TAB: SECURITY OPERATIONS CENTER (SOC) */}
                    <TabsContent value="security" className="space-y-6">

                        {/* 1. THREAT MONITOR HEADER */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-black text-rose-600 dark:text-rose-400 uppercase tracking-tight flex items-center gap-2">
                                    <ShieldAlert className="w-6 h-6" /> Security Operations Center
                                </h2>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Live Threat Intelligence & Incident Response</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="gap-2 font-bold text-xs uppercase tracking-wide border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/20">
                                    <Zap className="w-3.5 h-3.5" /> Configure Alerts
                                </Button>
                                <Button className="gap-2 font-bold text-xs uppercase tracking-wide bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20">
                                    <Shield className="w-3.5 h-3.5" /> Lockdown Mode
                                </Button>
                            </div>
                        </div>

                        {/* 2. ADVANCED CONTROL DECK (Filters & Actions) */}
                        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                            <CardContent className="p-4 flex flex-col xl:flex-row gap-4 justify-between items-center">
                                {/* FILTERS */}
                                <div className="flex flex-1 w-full gap-3 overflow-x-auto pb-2 xl:pb-0">
                                    <div className="relative min-w-[200px]">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            className="w-full h-9 pl-9 rounded-lg border border-slate-200 dark:border-slate-800 text-sm bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                                            placeholder="Search IP, User, Event Payload..."
                                        />
                                    </div>
                                    <select className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wide bg-white dark:bg-slate-900 text-slate-600">
                                        <option>⚠ &nbsp; Risk: All Levels</option>
                                        <option>🔴 &nbsp; Critical</option>
                                        <option>🟠 &nbsp; High</option>
                                        <option>🟡 &nbsp; Medium</option>
                                    </select>
                                    <select className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wide bg-white dark:bg-slate-900 text-slate-600">
                                        <option>📅 &nbsp; Time: Last 24h</option>
                                        <option>Last 7 Days</option>
                                        <option>Custom Range</option>
                                    </select>
                                </div>

                                {/* BULK OP & EXPORT */}
                                <div className="flex gap-2 w-full xl:w-auto">
                                    <Button variant="outline" className="h-9 gap-2 font-bold text-xs uppercase tracking-wide border-dashed border-slate-300 text-slate-500">
                                        <Layers className="w-3.5 h-3.5" /> Bulk Actions
                                    </Button>
                                    <Button variant="secondary" className="h-9 gap-2 font-bold text-xs uppercase tracking-wide bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400">
                                        <FileText className="w-3.5 h-3.5" /> Export Log
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. LIVE EVENT STREAM TABLE */}
                        <Card className="border-rose-100 dark:border-rose-900/30 bg-white dark:bg-slate-900 overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50/80 dark:bg-slate-800/50 border-b border-rose-100 dark:border-rose-900/30 text-[10px] uppercase tracking-widest font-black text-slate-400">
                                <div className="col-span-1 flex justify-center"><input type="checkbox" className="rounded border-slate-300" /></div>
                                <div className="col-span-2">Severity</div>
                                <div className="col-span-3">Event Signature</div>
                                <div className="col-span-3">User / Origin</div>
                                <div className="col-span-2">Timestamp</div>
                                <div className="col-span-1 text-right">Action</div>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {[
                                    { action: "Brute Force Attack", user: "Unknown", ip: "192.168.1.105", time: "2 mins ago", risk: "CRITICAL", color: "bg-rose-600 border-rose-600 text-white" },
                                    { action: "Unauthorized Policy Edit", user: "Sarah Connor (Mgr)", ip: "Internal", time: "14 mins ago", risk: "HIGH", color: "bg-orange-500 border-orange-500 text-white" },
                                    { action: "Login from New Device", user: "Bruce Wayne (Admin)", ip: "London, UK", time: "45 mins ago", risk: "MEDIUM", color: "bg-amber-400 border-amber-400 text-white" },
                                    { action: "Bulk Data Export", user: "Ops Team", ip: "Internal", time: "2 hours ago", risk: "LOW", color: "bg-slate-200 border-slate-300 text-slate-600" },
                                    { action: "Password Reset Request", user: "John Wick", ip: "New York, USA", time: "5 hours ago", risk: "LOW", color: "bg-slate-200 border-slate-300 text-slate-600" },
                                ].map((log, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-colors group">
                                        <div className="col-span-1 flex justify-center"><input type="checkbox" className="rounded border-slate-300 accent-rose-500" /></div>
                                        <div className="col-span-2">
                                            <Badge variant="outline" className={`text-[10px] font-black rounded-md px-2 py-0.5 border ${log.color} shadow-sm`}>
                                                {log.risk}
                                            </Badge>
                                        </div>
                                        <div className="col-span-3 font-bold text-sm text-slate-900 dark:text-white">
                                            {log.action}
                                        </div>
                                        <div className="col-span-3">
                                            <div className="font-bold text-xs text-slate-700 dark:text-slate-300">{log.user}</div>
                                            <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                                                <Target className="w-3 h-3" /> {log.ip}
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-xs font-mono text-slate-400">{log.time}</div>
                                        <div className="col-span-1 flex justify-end">
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* PAGINATION FOOTER */}
                            <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Showing 5 of 142 Events</span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold" disabled>Prev</Button>
                                    <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold">Next</Button>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    )

}
