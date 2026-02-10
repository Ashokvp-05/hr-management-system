"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
    Clock,
    CreditCard,
    FileText,
    Check,
    X,
    Eye,
    Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"
import { API_BASE_URL } from "@/lib/config"

interface PendingRequestsListProps {
    token: string;
}

interface LeaveRequest {
    id: string;
    userId: string;
    type: string;
    startDate: string;
    endDate: string;
    reason?: string;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
        department?: string;
    }
}

export function PendingRequestsList({ token }: PendingRequestsListProps) {
    const { toast } = useToast()
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/leaves/all`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data: LeaveRequest[] = await res.json()
                    // Filter pending only
                    const pending = data.filter(r => r.status === 'PENDING').map(r => {
                        // Map to display format
                        const isSick = r.type === 'SICK'
                        const days = Math.ceil((new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1

                        return {
                            id: r.id,
                            user: r.user.name || "Unknown User",
                            type: formatLeaveType(r.type),
                            detail: `${days} Day${days > 1 ? 's' : ''} • ${new Date(r.startDate).toLocaleDateString()}`,
                            status: isSick ? "Urgent" : "Review",
                            badgeColor: isSick ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-indigo-100 text-indigo-700 border-indigo-200",
                            icon: isSick ? Clock : Briefcase,
                            original: r
                        }
                    })
                    setRequests(pending)
                }
            } catch (error) {
                console.error("Failed to fetch requests", error)
            } finally {
                setLoading(false)
            }
        }

        if (token) fetchRequests()
    }, [token])

    const formatLeaveType = (type: string) => {
        switch (type) {
            case 'SICK': return 'Sick Leave';
            case 'CASUAL': return 'Casual Leave';
            case 'EARNED': return 'Earned Leave';
            case 'MEDICAL': return 'Medical Leave';
            case 'UNPAID': return 'Unpaid Leave';
            default: return 'Leave Request';
        }
    }

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        const req = requests.find(r => r.id === id)
        if (!req) return

        // Optimistic UI update
        setRequests(prev => prev.filter(r => r.id !== id))

        try {
            const res = await fetch(`${API_BASE_URL}/leaves/${id}/${action}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(action === 'reject' ? { reason: "Manager Action" } : {})
            })

            if (!res.ok) throw new Error("Action failed")

            toast({
                title: action === 'approve' ? "Request Approved" : "Request Rejected",
                description: `Successfully ${action}ed request for ${req.user}.`,
                className: action === 'approve'
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-slate-900 border-slate-800 text-white"
            })

        } catch (error) {
            // Revert on error (could be handled better but keeping simple)
            toast({
                title: "Error",
                description: "Failed to update request status.",
                variant: "destructive"
            })
            // Ideally refetch here
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider animate-pulse">Loading Requests...</div>
    }

    if (requests.length === 0) {
        return (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="font-medium text-sm">All caught up! No pending requests.</p>
            </div>
        )
    }

    return (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {requests.map((req) => (
                <div key={req.id} className="p-5 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300 group">

                    {/* AVATAR & INFO (Col 1-7) */}
                    <div className="col-span-12 md:col-span-7 flex items-start gap-4">
                        <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${req.user}`} />
                            <AvatarFallback>{req.user[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{req.user}</h4>
                                <Badge variant="secondary" className={cn("text-[10px] h-5 px-2 font-bold border", req.badgeColor)}>
                                    {req.status}
                                </Badge>
                            </div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <req.icon className="w-3 h-3 text-slate-400" />
                                {req.type}
                            </p>
                            <p className="text-[10px] font-medium text-slate-500 mt-0.5 ml-4.5">{req.detail}</p>
                        </div>
                    </div>

                    {/* ACTIONS (Col 8-12) */}
                    <div className="col-span-12 md:col-span-5 flex items-center justify-end gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                            onClick={() => toast({ title: "Details", description: req.original.reason || "No additional details provided." })}
                        >
                            <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                        </Button>

                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block" />

                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 rounded-full border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all hover:scale-105 active:scale-95"
                                onClick={() => handleAction(req.id, 'reject')}
                                title="Reject Request"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/20 border border-indigo-500 transition-all hover:scale-105 active:scale-95 hover:shadow-lg"
                                onClick={() => handleAction(req.id, 'approve')}
                                title="Approve Request"
                            >
                                <Check className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
