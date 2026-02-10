"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Target,
    TrendingUp,
    Award,
    BookOpen,
    BarChart3,
    ArrowUpRight,
    CheckCircle2,
    AlertCircle,
    Briefcase,
    Zap
} from "lucide-react"

export default function PerformancePage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HERDER */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Performance & Growth</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track your professional goals, skills, and reviews.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <BookOpen className="w-4 h-4" /> View Career Path
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                        <Target className="w-4 h-4" /> New Goal
                    </Button>
                </div>
            </div>

            {/* TOP METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Overall Rating"
                    value="4.8/5.0"
                    sub="Top 5% Performer"
                    icon={Award}
                    trend="Exceeds Expectations"
                    color="text-indigo-600"
                    bg="bg-indigo-50 dark:bg-indigo-900/20"
                />
                <MetricCard
                    title="Review Status"
                    value="On Track"
                    sub="Cycle: Q1 2026"
                    icon={CheckCircle2}
                    trend="Due in 14 Days"
                    color="text-emerald-600"
                    bg="bg-emerald-50 dark:bg-emerald-900/20"
                />
                <MetricCard
                    title="Skill Growth"
                    value="+12%"
                    sub="vs Last Quarter"
                    icon={Zap}
                    trend="2 New Certifications"
                    color="text-amber-600"
                    bg="bg-amber-50 dark:bg-amber-900/20"
                />
                <MetricCard
                    title="Project Impact"
                    value="High"
                    sub="Major Contributor"
                    icon={Briefcase}
                    trend="3 Critical Projects"
                    color="text-rose-600"
                    bg="bg-rose-50 dark:bg-rose-900/20"
                />
            </div>

            {/* MAIN CONTENT TABS */}
            <Tabs defaultValue="goals" className="w-full">
                <TabsList className="mb-6 w-full md:w-auto grid grid-cols-3 md:inline-flex">
                    <TabsTrigger value="goals">Goals & OKRs</TabsTrigger>
                    <TabsTrigger value="skills">Skills Matrix</TabsTrigger>
                    <TabsTrigger value="feedback">360° Feedback</TabsTrigger>
                </TabsList>

                {/* GOALS TAB */}
                <TabsContent value="goals" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Current OKRs */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="w-5 h-5 text-indigo-600" /> Current Quarter Goals
                                        </CardTitle>
                                        <CardDescription>Q1 Objectives and Key Results</CardDescription>
                                    </div>
                                    <Badge>3 Active</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <GoalItem
                                    title="Lead Frontend Migration"
                                    deadline="Mar 31"
                                    progress={75}
                                    status="On Track"
                                    color="bg-emerald-500"
                                />
                                <GoalItem
                                    title="Reduce Bundle Size by 20%"
                                    deadline="Feb 28"
                                    progress={40}
                                    status="At Risk"
                                    color="bg-amber-500"
                                />
                                <GoalItem
                                    title="Mentor 2 Junior Devs"
                                    deadline="Ongoing"
                                    progress={90}
                                    status="Excellent"
                                    color="bg-indigo-500"
                                />
                            </CardContent>
                        </Card>

                        {/* Recent Achievements */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-900/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-amber-500" /> Recent Achievements
                                </CardTitle>
                                <CardDescription>Recognized milestones and wins</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <AchievementItem
                                    title="Deployed 2FA Module"
                                    date="Jan 15, 2026"
                                    desc="Successfully launched security upgrade with zero downtime."
                                    tag="Critical Impact"
                                />
                                <AchievementItem
                                    title="React Summit Speaker"
                                    date="Dec 10, 2025"
                                    desc="Represented the company Engineering team."
                                    tag="Brand Ambassador"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* SKILLS TAB */}
                <TabsContent value="skills">
                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Competencies</CardTitle>
                            <CardDescription>Your technical and leadership proficiency levels.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Technical Skills</h3>
                                <div className="space-y-4">
                                    <SkillBar skill="React / Next.js" level={95} />
                                    <SkillBar skill="TypeScript" level={90} />
                                    <SkillBar skill="Node.js System Design" level={75} />
                                    <SkillBar skill="Cloud Architecture (AWS)" level={60} />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Leadership & Soft Skills</h3>
                                <div className="space-y-4">
                                    <SkillBar skill="Mentorship" level={85} />
                                    <SkillBar skill="Project Management" level={80} />
                                    <SkillBar skill="Stakeholder Comm." level={70} />
                                    <SkillBar skill="Strategic Planning" level={50} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function MetricCard({ title, value, sub, icon: Icon, trend, color, bg }: any) {
    return (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${bg}`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <Badge variant="outline" className={`${color} bg-white dark:bg-slate-900`}>{trend}</Badge>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
                    <p className="text-xs font-medium text-slate-400 mt-1">{sub}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function GoalItem({ title, deadline, progress, status, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
                    <p className="text-xs text-slate-500">Due: {deadline}</p>
                </div>
                <Badge variant="outline" className={status === "At Risk" ? "text-rose-600 bg-rose-50 border-rose-200" : "text-slate-600"}>
                    {status}
                </Badge>
            </div>
            <Progress value={progress} className="h-2" color={status === "At Risk" ? "bg-rose-500" : undefined} />
            <p className="text-xs text-right font-medium text-slate-500">{progress}% Complete</p>
        </div>
    )
}

function AchievementItem({ title, date, desc, tag }: any) {
    return (
        <div className="flex gap-4 items-start p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="mt-1 h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
                    <Badge variant="secondary" className="text-[10px] h-5">{tag}</Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-1.5">{desc}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{date}</p>
            </div>
        </div>
    )
}

function SkillBar({ skill, level }: any) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">{skill}</span>
                <span className="font-bold text-slate-900 dark:text-white">{level}%</span>
            </div>
            <Progress value={level} className="h-2.5" />
        </div>
    )
}
