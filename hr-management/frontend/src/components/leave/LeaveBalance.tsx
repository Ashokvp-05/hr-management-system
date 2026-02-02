"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress" // Assuming I'll need to create this or use simple divs

interface Balance {
    sick: number
    casual: number
    earned: number
}

export default function LeaveBalance({ token }: { token: string }) {
    const [balance, setBalance] = useState<Balance | null>(null)

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/leaves/balance", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) setBalance(await res.json())
            } catch (e) {
                console.error("Failed to fetch balance")
            }
        }
        fetchBalance()
    }, [token])

    if (!balance) return null

    // Defaults: Sick 10, Casual 10, Earned 15
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Leave Balance (2025)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Sick Leave</span>
                        <span className="font-bold">{balance.sick}/10</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${(balance.sick / 10) * 100}%` }} />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Casual Leave</span>
                        <span className="font-bold">{balance.casual}/10</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${(balance.casual / 10) * 100}%` }} />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Earned Leave</span>
                        <span className="font-bold">{balance.earned}/15</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${(balance.earned / 15) * 100}%` }} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
