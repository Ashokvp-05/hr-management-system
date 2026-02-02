"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Command } from "cmdk"
import {
    LayoutDashboard,
    Calendar,
    User,
    Search,
    Settings,
    LogOut,
    Database,
    Clock,
    HelpCircle,
    FileText
} from "lucide-react"

export function CommandMenu() {
    const { data: session } = useSession()
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        const openEvent = () => setOpen(true)

        document.addEventListener("keydown", down)
        document.addEventListener("open-command-menu", openEvent)
        return () => {
            document.removeEventListener("keydown", down)
            document.removeEventListener("open-command-menu", openEvent)
        }
    }, [])

    const runCommand = (command: () => void) => {
        setOpen(false)
        command()
    }

    if (!open) return null

    const role = (session?.user as any)?.role
    const roleName = typeof role === 'object' ? role.name : role

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-popover text-popover-foreground border shadow-2xl rounded-xl overflow-hidden animate-in zoom-in-95 duration-200">
                <Command className="flex flex-col h-full">
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Command.Input
                            placeholder="Search actions or pages... (Type 'L' for Leave)"
                            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            autoFocus
                        />
                    </div>
                    <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
                        <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>

                        <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/dashboard"))}
                                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">D</span>
                                </kbd>
                            </Command.Item>

                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/attendance"))}
                                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                            >
                                <Clock className="h-4 w-4" />
                                <span>Attendance History</span>
                                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">A</span>
                                </kbd>
                            </Command.Item>

                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/leave"))}
                                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                            >
                                <Calendar className="h-4 w-4" />
                                <span>Apply for Leave</span>
                                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">L</span>
                                </kbd>
                            </Command.Item>

                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/reports"))}
                                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                            >
                                <FileText className="h-4 w-4" />
                                <span>My Reports</span>
                                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">R</span>
                                </kbd>
                            </Command.Item>

                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/profile"))}
                                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                            >
                                <User className="h-4 w-4" />
                                <span>Profile</span>
                                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">P</span>
                                </kbd>
                            </Command.Item>

                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/settings"))}
                                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                            >
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">S</span>
                                </kbd>
                            </Command.Item>

                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/help"))}
                                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                            >
                                <HelpCircle className="h-4 w-4" />
                                <span>Help & Support</span>
                                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">H</span>
                                </kbd>
                            </Command.Item>

                            {roleName === 'ADMIN' && (
                                <Command.Item
                                    onSelect={() => runCommand(() => router.push("/admin/database"))}
                                    className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                                >
                                    <Database className="h-4 w-4" />
                                    <span>Database Explorer</span>
                                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                        <span className="text-xs">B</span>
                                    </kbd>
                                </Command.Item>
                            )}
                        </Command.Group>
                        <Command.Separator className="h-px bg-border mx-2 my-2" />
                        <Command.Group heading="Actions" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <Command.Item
                                onSelect={() => runCommand(() => window.location.href = "/api/auth/signout")}
                                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Log Out</span>
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                </Command>
                <div className="p-3 border-t bg-muted/30 text-[10px] text-muted-foreground flex justify-between">
                    <span>Press ESC to close</span>
                    <span>Tip: Use ↑↓ and Enter</span>
                </div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={() => setOpen(false)} />
        </div>
    )
}
