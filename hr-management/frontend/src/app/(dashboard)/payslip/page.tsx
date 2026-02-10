"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2, Lock } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export default function PayslipPage() {
    const { data: session } = useSession()
    const [payslips, setPayslips] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPayslips = async () => {
            const token = (session?.user as any)?.accessToken
            if (!token) return
            try {
                const res = await fetch(`${API_URL}/payslips/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setPayslips(data)
                }
            } catch (e) {
                console.error(e)
                toast.error("Failed to load payslips")
            } finally {
                setLoading(false)
            }
        }
        if (session) fetchPayslips()
    }, [session])

    const handleDownload = async (id: string, filename: string) => {
        const token = (session?.user as any)?.accessToken
        if (!token) return

        try {
            const res = await fetch(`${API_URL}/payslips/${id}/download`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error("Download failed")

            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success("Payslip downloaded securely")
        } catch (e) {
            console.error(e)
            toast.error("Failed to download payslip")
        }
    }

    if (loading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>

    return (
        <div className="space-y-8 container max-w-6xl py-10 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">My Payslips</h1>
                <p className="text-slate-500 mt-2">Access your secure payroll documents.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {payslips.map((slip) => (
                    <Card key={slip.id} className="group relative overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4">
                            <Badge variant={slip.status === 'PAID' ? 'default' : 'secondary'} className={slip.status === 'PAID' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                {slip.status}
                            </Badge>
                        </div>
                        <CardHeader className="pb-2 pt-6">
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                                    <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                {slip.month} {slip.year}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Pay</span>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                                        <span className="text-lg font-normal text-slate-400">$</span>
                                        {parseFloat(slip.amount).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs font-medium text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <span>Generated {format(new Date(slip.createdAt), 'MMM d, yyyy')}</span>
                                </div>

                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
                                    onClick={() => handleDownload(slip.id, `Payslip_${slip.month}_${slip.year}.pdf`)}
                                >
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                </Button>

                                <div className="flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider justify-center bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg">
                                    <Lock className="w-3 h-3" /> 256-bit Encrypted
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {payslips.length === 0 && (
                    <div className="col-span-full py-16 text-center">
                        <div className="bg-slate-50 dark:bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No payslips available</h3>
                        <p className="text-slate-500 mt-1">Your payslips will appear here once generated.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
