"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle, Clock, Copy, Hash, User, MapPin, Tag, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { API_BASE_URL } from "@/lib/config"

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string;
    module: string;
    ticketNumber: number;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: {
            name: string;
        }
    };
}

export function AdminTicketBoard({ token }: { token: string }) {
    const { toast } = useToast()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("ALL")
    const [statusUpdating, setStatusUpdating] = useState<string | null>(null)

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/tickets/all`, { // Assuming an admin endpoint exists or reuse user endpoint with admin privileges
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setTickets(data)
            }
        } catch (error) {
            console.error("Failed to fetch tickets")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchTickets()
    }, [token])

    const updateStatus = async (id: string, newStatus: string) => {
        setStatusUpdating(id)
        try {
            const res = await fetch(`${API_BASE_URL}/tickets/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (res.ok) {
                setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
                toast({ title: "Status Updated", description: `Ticket marked as ${newStatus}` })
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" })
        } finally {
            setStatusUpdating(null)
        }
    }

    const filteredTickets = filter === "ALL" ? tickets : tickets.filter(t => t.status === filter)

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'CRITICAL': return "bg-rose-100 text-rose-700 border-rose-200 animate-pulse";
            case 'HIGH': return "bg-orange-100 text-orange-700 border-orange-200";
            case 'MEDIUM': return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    }

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'OPEN': return "bg-indigo-50 text-indigo-700 border-indigo-200";
            case 'IN_PROGRESS': return "bg-amber-50 text-amber-700 border-amber-200";
            case 'RESOLVED': return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case 'CLOSED': return "bg-slate-100 text-slate-500 border-slate-200 opacity-70";
            default: return "bg-slate-100";
        }
    }

    if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading Operation Center...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Tickets</SelectItem>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                    Total: {tickets.length} | Open: {tickets.filter(t => t.status === 'OPEN').length}
                </div>
            </div>

            <ScrollArea className="h-[600px] w-full pr-4">
                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredTickets.map((ticket) => (
                            <motion.div
                                key={ticket.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300"
                            >
                                {/* Header Row */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="font-mono text-[10px] bg-slate-50 text-slate-500">
                                            #{ticket.ticketNumber}
                                        </Badge>
                                        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                                            {ticket.title}
                                        </h3>
                                        <Badge variant="secondary" className={`text-[10px] font-bold h-5 ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </Badge>
                                    </div>
                                    <Select
                                        defaultValue={ticket.status}
                                        onValueChange={(v) => updateStatus(ticket.id, v)}
                                        disabled={statusUpdating === ticket.id}
                                    >
                                        <SelectTrigger className={`h-6 text-[10px] font-bold w-[110px] border-0 ${getStatusColor(ticket.status)}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OPEN">Open</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                                            <SelectItem value="CLOSED">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Body */}
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 pl-1 border-l-2 border-indigo-100 dark:border-indigo-900/50">
                                    {ticket.description}
                                </p>

                                {/* Meta Info Footer - The "Source Detection" Feature */}
                                <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">

                                    {/* User Info */}
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${ticket.user?.name}`} />
                                            <AvatarFallback className="text-[9px]">{ticket.user?.name?.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{ticket.user?.name}</span>
                                            <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                                                <User className="w-2.5 h-2.5" />
                                                {ticket.user?.role?.name || "User"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Source Module Badge - THIS IS THE REQUESTED FEATURE */}
                                    {ticket.module && (
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700" title="Source Page where error occurred">
                                            <MapPin className="w-3 h-3 text-indigo-500" />
                                            <span className="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-400 max-w-[150px] truncate">
                                                {ticket.module}
                                            </span>
                                        </div>
                                    )}

                                    {/* Date */}
                                    <div className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(ticket.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </div>
    )
}
