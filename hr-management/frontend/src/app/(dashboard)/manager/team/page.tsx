"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    Search,
    Filter,
    Mail,
    Phone,
    MapPin,
    Star,
    TrendingUp,
    Clock,
    Shield,
    FileText,
    Loader2
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { API_BASE_URL } from "@/lib/config"

export default function TeamDirectoryPage() {
    const { data: session } = useSession()
    const token = (session?.user as any)?.accessToken
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedMember, setSelectedMember] = useState<any | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (token) fetchMembers()
    }, [token])

    const fetchMembers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                // Enrich with mock fields for the UX
                const enriched = data.map((m: any) => ({
                    ...m,
                    role: m.designation || "Employee",
                    dept: m.department || "Operations",
                    status: m.status === 'ACTIVE' ? "Active" : "Away",
                    location: "Remote",
                    avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${m.name}`,
                    performance: (Math.random() * (5 - 3) + 3).toFixed(1),
                    potential: Math.random() > 0.7 ? "Top Talent" : "High",
                    skills: [
                        { name: "Communication", level: 90 },
                        { name: "Teamwork", level: 85 },
                        { name: "Technical", level: Math.floor(Math.random() * 30) + 70 }
                    ],
                    history: [
                        { role: m.designation || "Employee", date: "Jan 2025 - Present" }
                    ]
                }))
                setMembers(enriched)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Accessing Personnel Files...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Team Directory</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your {members.length} team members and their growth.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search team..."
                            className="pl-9 w-[250px] bg-white dark:bg-slate-900"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>
            </div>

            {/* TEAM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                    <Card key={member.id} className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-all group overflow-hidden">
                        <CardContent className="p-0">
                            {/* COVER & AVATAR */}
                            <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
                                <div className="absolute top-2 right-2">
                                    <Badge variant={member.status === "Active" ? "default" : "secondary"} className={member.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                                        {member.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="px-6 relative">
                                <Avatar className="h-20 w-20 border-4 border-white dark:border-slate-950 absolute -top-10 shadow-sm">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="pt-12 pb-6 space-y-4">
                                    {/* INFO */}
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{member.name}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{member.role}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                            <MapPin className="w-3 h-3" /> {member.location}
                                        </div>
                                    </div>

                                    {/* METRICS */}
                                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-100 dark:border-slate-800">
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Performance</p>
                                            <div className="flex items-center justify-center gap-1 mt-1">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                <span className="font-bold text-slate-900 dark:text-white">{member.performance}</span>
                                            </div>
                                        </div>
                                        <div className="text-center border-l border-slate-100 dark:border-slate-800">
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Potential</p>
                                            <p className={`mt-1 font-bold text-sm ${member.potential === "Top Talent" ? "text-indigo-600" : "text-slate-700 dark:text-slate-300"}`}>
                                                {member.potential}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex gap-2">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button
                                                    onClick={() => setSelectedMember(member)}
                                                    variant="default"
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold"
                                                >
                                                    View Profile
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                                                <SheetHeader className="mb-6">
                                                    <SheetTitle>Employee Profile</SheetTitle>
                                                    <SheetDescription>Detailed records and performance history.</SheetDescription>
                                                </SheetHeader>
                                                {selectedMember && <MemberProfileDetail member={selectedMember} />}
                                            </SheetContent>
                                        </Sheet>
                                        <Button variant="outline" size="icon">
                                            <Mail className="w-4 h-4 text-slate-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {filteredMembers.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500 font-medium">No team members found matching "{searchQuery}"</p>
                </div>
            )}
        </div>
    )
}

function MemberProfileDetail({ member }: { member: any }) {
    return (
        <div className="space-y-8">
            {/* HEADER SECTION */}
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                        <p className="text-slate-500 font-medium">{member.role}</p>
                        <div className="flex flex-col gap-1 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {member.email}</span>
                            <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {member.phone || "No phone listed"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="docs">Documents</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* SKILLS MATRIX */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Skills Matrix
                        </h4>
                        <div className="space-y-3">
                            {member.skills.map((skill: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{skill.level}%</span>
                                    </div>
                                    <Progress value={skill.level} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MANAGER ACTIONS */}
                    <Card className="border-indigo-100 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-900/10">
                        <CardHeader className="p-4 pb-2">
                            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Manager Actions</p>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3 p-4">
                            <Button variant="outline" className="bg-white dark:bg-slate-900 border-indigo-200 hover:border-indigo-300 text-indigo-700 dark:text-indigo-300 h-auto py-3 justify-start px-4">
                                <div className="text-left">
                                    <div className="font-bold text-xs">Recommend Promotion</div>
                                    <div className="text-[10px] opacity-70">Log request for HR</div>
                                </div>
                            </Button>
                            <Button variant="outline" className="bg-white dark:bg-slate-900 border-indigo-200 hover:border-indigo-300 text-indigo-700 dark:text-indigo-300 h-auto py-3 justify-start px-4">
                                <div className="text-left">
                                    <div className="font-bold text-xs">Correction Plan</div>
                                    <div className="text-[10px] opacity-70">Initiate PIP</div>
                                </div>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* HISTORY TAB */}
                <TabsContent value="history" className="mt-6">
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Career Timeline
                        </h4>
                        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-2 space-y-8 pl-6">
                            {member.history.map((item: any, i: number) => (
                                <div key={i} className="relative">
                                    <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 shadow-sm" />
                                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">{item.role}</h5>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* DOCS TAB */}
                <TabsContent value="docs" className="mt-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Personnel Files
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-indigo-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded bg-rose-50 flex items-center justify-center text-rose-600">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-slate-900 dark:text-white">Employment Contract.pdf</p>
                                        <p className="text-xs text-slate-500">Document system active</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost">View</Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
