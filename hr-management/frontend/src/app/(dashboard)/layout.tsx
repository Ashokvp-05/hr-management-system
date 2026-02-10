import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import NotificationBell from "@/components/layout/NotificationBell"
import Navbar from "@/components/layout/Navbar"
import PageTransition from "@/components/layout/PageTransition"
import { Zap } from "lucide-react"


import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/layout/UserNav"
import { SearchButton } from "@/components/layout/SearchButton"
import { NexusChatWidget } from "@/components/ai/NexusChatWidget"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const token = (session.user as any)?.accessToken || ""

    return (
        <div className="flex min-h-screen flex-col bg-background/50">
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40 transition-all duration-300">
                <div className="container flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="mr-8 flex items-center">
                        <Link href="/dashboard" className="mr-8 flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-indigo-500/30">
                                <Zap className="h-5 w-5 text-white fill-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Rudratic</span>
                        </Link>
                        {/* @ts-ignore */}
                        <Navbar role={session.user?.role} />
                    </div>

                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            <SearchButton />
                        </div>
                        <div className="flex items-center gap-2">
                            <NotificationBell token={token} />
                            <ModeToggle />
                            <div className="h-8 w-[1px] bg-border/50 mx-1 hidden md:block" />
                            <UserNav />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>

            <NexusChatWidget token={token} />
        </div>
    )
}
