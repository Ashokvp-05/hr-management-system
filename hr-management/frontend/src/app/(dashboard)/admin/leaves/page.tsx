"use client"

import { useSession } from "next-auth/react"
import AdminLeaveTable from "@/components/admin/AdminLeaveTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLeavesPage() {
    const { data: session } = useSession()

    // In real app, check for ADMIN role here also

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Leave Requests Management</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* @ts-ignore */}
                    <AdminLeaveTable token={session?.user?.accessToken || "mock-token-need-backend-jwt"} />
                </CardContent>
            </Card>
        </div>
    )
}
