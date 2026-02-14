"use client"

import { useState } from "react"
import { Megaphone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { API_BASE_URL } from "@/lib/config"

interface TeamAnnouncerProps {
    token: string;
    activeCount: number;
}

export function TeamAnnouncer({ token, activeCount }: TeamAnnouncerProps) {
    const [content, setContent] = useState("")
    const [priority, setPriority] = useState<"NORMAL" | "URGENT">("NORMAL")
    const [loading, setLoading] = useState(false)

    const handlePost = async () => {
        if (!content.trim()) {
            toast.error("Announcement content cannot be empty")
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/announcements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: priority === "URGENT" ? "Urgent Update" : "Team Announcement",
                    content,
                    priority,
                    type: priority === "URGENT" ? "ALERT" : "INFO"
                })
            })

            if (!res.ok) throw new Error("Failed to post announcement")

            toast.success("Announcement posted to the team!")
            setContent("")
        } catch (error) {
            console.error(error)
            toast.error("Failed to post announcement")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4 md:border-l md:pl-8 border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Megaphone className="w-4 h-4" /> Team Announcements
            </h4>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all shadow-sm">
                <textarea
                    className="w-full bg-transparent border-0 text-sm font-medium placeholder:text-slate-400 focus:ring-0 resize-none h-24 leading-relaxed"
                    placeholder="Type an urgent update for the team (e.g., 'Server maintenance at 5 PM')..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                />
                <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                            variant="outline"
                            className={`text-xs cursor-pointer transition-colors ${priority === "NORMAL" ? "bg-indigo-600 text-white border-indigo-500" : "bg-white dark:bg-slate-900 hover:bg-indigo-50"}`}
                            onClick={() => setPriority("NORMAL")}
                        >
                            Normal
                        </Badge>
                        <Badge
                            variant="outline"
                            className={`text-xs cursor-pointer transition-colors ${priority === "URGENT" ? "bg-amber-500 text-white border-amber-400" : "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400"}`}
                            onClick={() => setPriority("URGENT")}
                        >
                            Urgent
                        </Badge>
                    </div>
                    <Button
                        size="sm"
                        className="h-9 text-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 font-bold px-5 shadow-lg rounded-xl"
                        onClick={handlePost}
                        disabled={loading || !content.trim()}
                    >
                        {loading ? (
                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        ) : (
                            <Megaphone className="w-3.5 h-3.5 mr-2" />
                        )}
                        Post
                    </Button>
                </div>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Live broadcast to {activeCount} active members
            </p>
        </div>
    )
}
