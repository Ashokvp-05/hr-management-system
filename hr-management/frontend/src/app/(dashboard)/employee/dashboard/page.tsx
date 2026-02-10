"use client"

import { EmployeeOnly } from "@/components/auth/RoleGate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar, Clock, Smile } from "lucide-react"

export default function EmployeeDashboardPage() {
    return (
        <EmployeeOnly fallback={
            <div className="flex h-[50vh] items-center justify-center text-slate-500">
                Access Denied: You must be authenticated as an employee.
            </div>
        }>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                        Personal Dashboard
                    </h1>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20 text-green-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">Employee Portal</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                    <Card className="bg-slate-900/50 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Attendance</CardTitle>
                            <Clock className="w-4 h-4 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">100%</div>
                            <p className="text-xs text-slate-500">This month</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Leave Balance</CardTitle>
                            <Calendar className="w-4 h-4 text-yellow-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">12 Days</div>
                            <p className="text-xs text-slate-500">Annual leave remaining</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Kudos</CardTitle>
                            <Smile className="w-4 h-4 text-pink-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">5</div>
                            <p className="text-xs text-slate-500">Received this quarter</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Next Holiday</CardTitle>
                            <Calendar className="w-4 h-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold text-white truncate">Labor Day</div>
                            <p className="text-xs text-slate-500">In 14 days</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 bg-slate-900/50 border-white/10 h-[400px]">
                        <CardHeader>
                            <CardTitle className="text-white">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>Checked in at 09:00 AM</span>
                                    <span className="ml-auto text-xs">Today</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span>Ticket #1234 resolved</span>
                                    <span className="ml-auto text-xs">Yesterday</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    <span>Review updated</span>
                                    <span className="ml-auto text-xs">2 days ago</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-white/10 h-[400px]">
                        <CardHeader>
                            <CardTitle className="text-white">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <button className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-slate-300 border border-white/5">
                                + Request Leave
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-slate-300 border border-white/5">
                                + Submit Expense
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-slate-300 border border-white/5">
                                + Report Issue
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </EmployeeOnly>
    )
}
