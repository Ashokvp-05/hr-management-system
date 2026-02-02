"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface LeaveRequest {
    id: string
    type: string
    startDate: string
    endDate: string
    reason: string
    status: string
    user: {
        name: string
        email: string
    }
    createdAt: string
}

export default function AdminLeaveTable({ token }: { token: string }) {
    const [requests, setRequests] = useState<LeaveRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const { toast } = useToast()
    const [rejectReason, setRejectReason] = useState("")
    const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
    const [isRejectOpen, setIsRejectOpen] = useState(false)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/leaves/all", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setRequests(data)
            }
        } catch (err) {
            console.error("Failed to load requests")
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (id: string) => {
        setActionLoading(id)
        try {
            const res = await fetch(`http://localhost:4000/api/leaves/${id}/approve`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error("Failed to approve")

            setRequests(prev => prev.map(req => req.id === id ? { ...req, status: "APPROVED" } : req))
            toast({ title: "Approved", description: "Leave request approved successfully" })
        } catch (err) {
            toast({ title: "Error", variant: "destructive", description: "Failed to approve request" })
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async () => {
        if (!selectedRequest) return
        setActionLoading(selectedRequest)
        try {
            const res = await fetch(`http://localhost:4000/api/leaves/${selectedRequest}/reject`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ reason: rejectReason })
            })
            if (!res.ok) throw new Error("Failed to reject")

            setRequests(prev => prev.map(req => req.id === selectedRequest ? { ...req, status: "REJECTED" } : req))
            toast({ title: "Rejected", description: "Leave request rejected" })
            setIsRejectOpen(false)
            setRejectReason("")
        } catch (err) {
            toast({ title: "Error", variant: "destructive", description: "Failed to reject request" })
        } finally {
            setActionLoading(null)
            setSelectedRequest(null)
        }
    }

    if (loading) return <Loader2 className="animate-spin" />

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.length === 0 ? (
                        <TableRow><TableCell colSpan={6} className="text-center">No leave requests found</TableCell></TableRow>
                    ) : (
                        requests.map(req => (
                            <TableRow key={req.id}>
                                <TableCell>
                                    <div className="font-medium">{req.user.name}</div>
                                    <div className="text-xs text-muted-foreground">{req.user.email}</div>
                                </TableCell>
                                <TableCell><Badge variant="outline">{req.type}</Badge></TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {format(new Date(req.startDate), "MMM dd")} - {format(new Date(req.endDate), "MMM dd, yyyy")}
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate" title={req.reason}>{req.reason}</TableCell>
                                <TableCell>
                                    <Badge variant={req.status === 'APPROVED' ? 'default' : req.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                                        {req.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {req.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 text-green-600" onClick={() => handleApprove(req.id)} disabled={!!actionLoading}>
                                                {actionLoading === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                            </Button>
                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 text-red-600" onClick={() => { setSelectedRequest(req.id); setIsRejectOpen(true); }} disabled={!!actionLoading}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Leave Request</DialogTitle>
                        <DialogDescription>Please provide a reason for rejecting this request.</DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="Reason for rejection..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={!rejectReason}>Reject</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
