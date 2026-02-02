"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Leave", href: "/leave" },
    { name: "Reports", href: "/reports" },
    { name: "Profile", href: "/profile" },
]

const adminItems = [
    { name: "Admin Overview", href: "/admin" },
    { name: "Employees", href: "/admin/employees" },
    { name: "Approvals", href: "/admin/leaves" },
    { name: "Payroll", href: "/admin/payroll" },
    { name: "Database", href: "/admin/database" },
]

export default function Navbar({ role }: { role?: string }) {
    const pathname = usePathname()

    const renderLink = (item: { name: string; href: string }, isRed = false) => {
        const isActive = pathname === item.href
        return (
            <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                    "transition-all duration-200 hover:text-foreground/80 text-sm font-medium px-3 py-2 rounded-md",
                    isActive
                        ? (isRed ? "text-red-600 bg-red-50 dark:bg-red-900/20" : "text-primary bg-primary/10")
                        : "text-foreground/60 hover:bg-muted"
                )}
            >
                {item.name}
            </Link>
        )
    }

    return (
        <nav className="flex items-center space-x-2">
            {navItems.map(item => renderLink(item))}
            {role === 'ADMIN' && (
                <div className="flex items-center space-x-2 border-l pl-2 ml-2 border-border/50">
                    {adminItems.map((item, idx) => renderLink(item, idx === 0))}
                </div>
            )}
        </nav>
    )
}
