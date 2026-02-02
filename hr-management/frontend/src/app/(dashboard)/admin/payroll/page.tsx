import { auth } from "@/auth"
import { redirect } from "next/navigation"
import PayrollTable from "@/components/admin/PayrollTable"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

export default async function PayrollPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const token = (session.user as any)?.accessToken || ""

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Payroll Management</h2>
                <p className="text-muted-foreground">Automated salary calculation and disbursement.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Payout Pending</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$17,400</div>
                        <p className="text-xs text-muted-foreground">For current month</p>
                    </CardContent>
                </Card>
                {/* Add more stats cards here if needed */}
            </div>

            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle>Salary Disbursement</CardTitle>
                    <CardDescription>
                        Generate payslips and process payments for your workforce.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PayrollTable token={token} />
                </CardContent>
            </Card>
        </div>
    )
}
