"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Star,
    TrendingUp,
    Award,
    Clock,
    Shield,
    FileText
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// MOCK DATA - Would come from API
const TEAM_MEMBERS = [
    {
        id: "1",
        name: "Sarah Connor",
        role: "Senior Frontend Engineer",
        dept: "Engineering",
        status: "Active",
        location: "New York (Remote)",
        email: "sarah.c@nexus.com",
        phone: "+1 (555) 012-3456",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah",
        performance: 4.8,
        potential: "High",
        skills: [
            { name: "React", level: 95 },
            { name: "TypeScript", level: 90 },
            { name: "System Design", level: 85 }
        ],
        history: [
            { role: "Senior Engineer", date: "Jan 2025 - Present" },
            { role: "Software Engineer", date: "Jun 2023 - Dec 2024" }
        ]
    },
    {
        id: "2",
        name: "James Bond",
        role: "Product Designer",
        dept: "Design",
        status: "On Leave",
        location: "London (Office)",
        email: "james.b@nexus.com",
        phone: "+44 7700 900077",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=James",
        performance: 4.5,
        potential: "Medium",
        skills: [
            { name: "Figma", level: 98 },
            { name: "UI/UX", level: 92 },
            { name: "User Research", level: 80 }
        ],
        history: [
            { role: "Product Designer", date: "Mar 2024 - Present" }
        ]
    },
    {
        id: "3",
        name: "Emily Blunt",
        role: "Product Manager",
        dept: "Product",
        status: "Active",
        location: "San Francisco",
        email: "emily.b@nexus.com",
        phone: "+1 (555) 987-6543",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Emily",
        performance: 4.9,
        potential: "Top Talent",
        skills: [
            { name: "Strategy", level: 95 },
            { name: "Roadmapping", level: 90 },
            { name: "Agile", level: 92 }
        ],
        history: [
            { role: "Product Manager", date: "Jan 2024 - Present" },
            { role: "Assoc. PM", date: "Jan 2022 - Dec 2023" }
        ]
    }
]

export default function TeamDirectoryPage() {
    const [selectedMember, setSelectedMember] = useState<typeof TEAM_MEMBERS[0] | null>(null)

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Team Directory</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your 14 direct reports and their growth.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input placeholder="Search team..." className="pl-9 w-[250px] bg-white dark:bg-slate-900" />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>
            </div>

            {/* TEAM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEAM_MEMBERS.map((member) => (
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
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
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
        </div>
    )
}

// 360 PROFILE DETAIL COMPONENT
function MemberProfileDetail({ member }: { member: typeof TEAM_MEMBERS[0] }) {
    return (
        <div className="space-y-8">
            {/* HEADER SECTION */}
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                        <p className="text-slate-500 font-medium">{member.role}</p>
                        <div className="flex flex-col gap-1 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {member.email}</span>
                            <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {member.phone}</span>
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
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Manager Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
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
                                        <p className="text-xs text-slate-500">Signed Jan 2025</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost">View</Button>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-indigo-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-slate-900 dark:text-white">NDA_Agreement.pdf</p>
                                        <p className="text-xs text-slate-500">Signed Jan 2025</p>
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
