"use client"

import { useState, useEffect } from "react"
import { Bell, Info, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"

export default function NotificationBell() {
    const { data: session } = useSession()
    const [notifications, setNotifications] = useState<any[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    const token = (session?.user as any)?.accessToken

    useEffect(() => {
        if (token) {
            fetchNotifications()
            const interval = setInterval(fetchNotifications, 60000) // Poll every min
            return () => clearInterval(interval)
        }
    }, [token])

    const fetchNotifications = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setNotifications(data)
                setUnreadCount(data.filter((n: any) => !n.isRead).length)
            }
        } catch (e) {
            console.error("Failed to fetch notifications")
        }
    }

    const markAllRead = async () => {
        try {
            await fetch("http://localhost:4000/api/notifications/read-all", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            })
            setNotifications(notifications.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch (e) {
            console.error("Failed to mark all read")
        }
    }

    const typeIcons: any = {
        INFO: <Info className="h-4 w-4 text-blue-500" />,
        WARNING: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        ALERT: <AlertTriangle className="h-4 w-4 text-red-500" />,
        SUCCESS: <CheckCircle className="h-4 w-4 text-emerald-500" />
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-[10px] border-2 border-background">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                            Mark all read
                        </button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No notifications yet.
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${!n.isRead ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1">{typeIcons[n.type] || <Info className="h-4 w-4" />}</div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{n.title}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                                            <div className="flex items-center gap-1 pt-1">
                                                <Clock className="h-3 w-3 text-muted-foreground/50" />
                                                <span className="text-[10px] text-muted-foreground/50 uppercase">
                                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                        {!n.isRead && (
                                            <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-3 border-t text-center">
                    <Button variant="ghost" size="sm" className="text-xs w-full text-muted-foreground">
                        View All History
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
