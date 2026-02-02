import { auth } from "@/auth"
import { redirect } from "next/navigation"
import LeaveRequestForm from "@/components/leave/LeaveRequestForm"
import LeaveHistoryList from "@/components/leave/LeaveHistoryList"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default async function LeavePage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const token = (session.user as any)?.accessToken || ""

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/30">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Apply for Leave</CardTitle>
                    <CardDescription>
                        Submit your leave request below. It will be sent for approval.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LeaveRequestForm token={token} />
                </CardContent>
            </Card>

            <LeaveHistoryList token={token} />
        </div>
    )
}
