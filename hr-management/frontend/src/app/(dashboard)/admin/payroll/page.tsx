"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Loader2, UploadCloud, Users, Calendar, DollarSign, FileText, Zap } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export default function PayrollPage() {
    const { data: session } = useSession()

    // Data state
    const [users, setUsers] = useState<any[]>([])
    const [payslips, setPayslips] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Form state
    const [selectedUser, setSelectedUser] = useState("")
    const [month, setMonth] = useState("January")
    const [year, setYear] = useState("2026")
    const [amount, setAmount] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const init = async () => {
            const token = (session?.user as any)?.accessToken
            if (!token) return

            try {
                // Fetch Users
                const usersRes = await fetch(`${API_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (usersRes.ok) setUsers(await usersRes.json())

                // Fetch All Payslips
                const payslipsRes = await fetch(`${API_URL}/payslips/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (payslipsRes.ok) setPayslips(await payslipsRes.json())
            } catch (error) {
                console.error("Failed to load data", error)
                toast.error("Failed to load payroll data")
            } finally {
                setLoading(false)
            }
        }
        if (session) init()
    }, [session])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !selectedUser || !amount) {
            toast.error("Please fill all fields")
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append("userId", selectedUser)
        formData.append("month", month)
        formData.append("year", year)
        formData.append("amount", amount)
        formData.append("file", file)

        try {
            const token = (session?.user as any)?.accessToken
            const res = await fetch(`${API_URL}/payslips/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Upload failed")
            }

            const newPayslip = await res.json()
            setPayslips([newPayslip, ...payslips])
            toast.success("Payslip uploaded successfully")

            // Reset form
            setAmount("")
            setFile(null)
            // Keep user/date selections for batch uploads
        } catch (error: any) {
            toast.error(error.message || "Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const [generating, setGenerating] = useState(false)

    const handleGenerate = async () => {
        if (!selectedUser || !amount) {
            toast.error("Please select an employee and enter an amount")
            return
        }

        setGenerating(true)
        try {
            const token = (session?.user as any)?.accessToken
            const res = await fetch(`${API_URL}/payslips/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: selectedUser,
                    month,
                    year,
                    amount
                })
            })

            if (!res.ok) throw new Error("Generation failed")

            const newPayslip = await res.json()
            setPayslips([newPayslip, ...payslips])
            toast.success("Payslip generated from system template")
            setAmount("")
        } catch (error: any) {
            toast.error(error.message || "Generation failed")
        } finally {
            setGenerating(false)
        }
    }

    const handleRelease = async (id: string) => {
        try {
            const token = (session?.user as any)?.accessToken
            const res = await fetch(`${API_URL}/payslips/${id}/release`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                const updatedSlip = await res.json()
                setPayslips(prev => prev.map(s => s.id === id ? updatedSlip : s))
                toast.success("Payslip released to employee")
            }
        } catch (error) {
            toast.error("Failed to release payslip")
        }
    }

    if (loading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>

    return (
        <div className="space-y-8 container max-w-6xl py-10 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Payroll Management</h1>
                <p className="text-slate-500 mt-2">Upload and manage employee payslips securely.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Form */}
                <Card className="lg:col-span-1 border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 h-fit sticky top-24">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UploadCloud className="w-5 h-5 text-indigo-600" />
                            Upload Payslip
                        </CardTitle>
                        <CardDescription>Upload PDF payslip for an employee.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Employee</Label>
                                <Select onValueChange={setSelectedUser} value={selectedUser}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Month</Label>
                                    <Select onValueChange={setMonth} value={month}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                                                <SelectItem key={m} value={m}>{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Year</Label>
                                    <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Net Amount</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-9"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Payslip PDF (Optional for Template)</Label>
                                <Input type="file" accept=".pdf" onChange={handleFileChange} className="cursor-pointer" />
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button type="submit" className="w-full bg-slate-900 border-indigo-500/30 hover:bg-slate-800 text-white font-black uppercase tracking-widest h-12 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/10" disabled={uploading || !file}>
                                    {uploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <UploadCloud className="mr-2 h-4 w-4 text-indigo-400" />}
                                    Manual Upload
                                </Button>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100 dark:border-slate-800"></span></div>
                                    <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400 bg-white dark:bg-slate-900 px-2 tracking-widest">or use intelligence</div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleGenerate}
                                    className="w-full bg-white dark:bg-slate-950 border-2 border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 text-indigo-600 font-black uppercase tracking-widest h-12 rounded-xl transition-all active:scale-95 group"
                                    disabled={generating}
                                >
                                    {generating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Zap className="mr-2 h-4 w-4 group-hover:animate-pulse" />}
                                    Generate & Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* List */}
                <Card className="lg:col-span-2 border-indigo-50/50 dark:border-indigo-900/20 shadow-2xl bg-white dark:bg-slate-950 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 dark:bg-black/20 border-b border-border/50">
                        <CardTitle className="text-xl font-black tracking-tight">Financial Stream Log</CardTitle>
                        <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">History of all payroll transactions</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {payslips.map((slip) => (
                                <div key={slip.id} className="flex items-center justify-between p-6 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                                {slip.user?.name || "Unknown User"}
                                                {slip.fileUrl.includes('System_Generated') && (
                                                    <Badge variant="outline" className="text-[8px] font-black uppercase border-indigo-200 text-indigo-500 bg-indigo-50">Template</Badge>
                                                )}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                                                <Calendar className="w-3 h-3" /> {slip.month} {slip.year}
                                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                <DollarSign className="w-3 h-3" /> {mounted ? `$ ${parseFloat(slip.amount).toLocaleString()}` : slip.amount}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${slip.status === 'GENERATED' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                slip.status === 'SENT' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                                                    'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                }`}>
                                                {slip.status}
                                            </span>
                                        </div>
                                        {slip.status === 'GENERATED' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 px-2 text-[10px] font-black uppercase tracking-widest border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                                onClick={() => handleRelease(slip.id)}
                                            >
                                                Release
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {payslips.length === 0 && (
                                <div className="text-center py-10 text-slate-500">No payslips found.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
