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

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="flex min-h-screen flex-col bg-background/50">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
                <div className="container flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="mr-8 flex items-center">
                        <Link href="/dashboard" className="mr-10 flex items-center space-x-2 group">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
                                <Zap className="h-4 w-4 text-white fill-white" />
                            </div>
                            <span className="font-black text-lg tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Rudratic</span>
                        </Link>
                        {/* @ts-ignore */}
                        <Navbar role={session.user?.role} />
                    </div>

                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            <SearchButton />
                        </div>
                        <div className="flex items-center gap-2">
                            {/* @ts-ignore */}
                            <NotificationBell token={session?.user?.accessToken || "mock-token-need-backend-jwt"} />
                            <ModeToggle />
                            <div className="h-8 w-[1px] bg-border/50 mx-1 hidden md:block" />
                            <UserNav />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto w-full">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
        </div>
    )
}
