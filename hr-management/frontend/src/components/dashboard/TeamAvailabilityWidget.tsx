"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users } from "lucide-react"

const TEAM = [
    { name: "Sarah Connor", role: "Product Manager", status: "ONLINE" },
    { name: "John Doe", role: "Senior Dev", status: "MEETING" },
    { name: "Mike Ross", role: "Designer", status: "OFFLINE" },
    { name: "Rachel Green", role: "HR Lead", status: "LEAVE" },
]

export default function TeamAvailabilityWidget() {
    return (
        <Card className="shadow-sm border border-border/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Team Status
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {TEAM.map((member) => (
                        <div key={member.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} />
                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="text-sm font-medium leading-none">{member.name}</div>
                                    <div className="text-[10px] text-muted-foreground">{member.role}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className={`h-2 w-2 rounded-full ${member.status === 'ONLINE' ? 'bg-emerald-500' :
                                    member.status === 'MEETING' ? 'bg-amber-500' :
                                        member.status === 'LEAVE' ? 'bg-red-500' : 'bg-slate-300'
                                    }`} />
                                <span className="text-[10px] font-medium text-muted-foreground">{member.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
