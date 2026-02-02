"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2, CalendarX2 } from "lucide-react"

interface LeaveRequest {
    id: string
    type: string
    startDate: string
    endDate: string
    status: string
    reason?: string
}

export default function LeaveHistoryList({ token }: { token: string }) {
    const [requests, setRequests] = useState<LeaveRequest[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/leaves/my-requests", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setRequests(data)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchRequests()
    }, [token])

    if (loading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>

    if (requests.length === 0) return null

    return (
        <Card className="mt-8 border-none shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarX2 className="w-5 h-5 text-muted-foreground mr-2" />
                    My Recent Requests
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {requests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{req.type}</span>
                                <Badge variant={
                                    req.status === 'APPROVED' ? 'default' :
                                        req.status === 'REJECTED' ? 'destructive' : 'secondary'
                                } className="text-[10px] h-5">
                                    {req.status}
                                </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {format(new Date(req.startDate), "MMM d, yyyy")} - {format(new Date(req.endDate), "MMM d, yyyy")}
                            </div>
                        </div>
                        {req.reason && (
                            <div className="text-xs text-muted-foreground max-w-[150px] truncate hidden sm:block">
                                "{req.reason}"
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
