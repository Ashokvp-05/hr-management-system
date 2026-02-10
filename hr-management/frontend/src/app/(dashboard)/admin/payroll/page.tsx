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
import { Loader2, UploadCloud, Users, Calendar, DollarSign, FileText } from "lucide-react"

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
                                <Label>Payslip PDF</Label>
                                <Input type="file" accept=".pdf" onChange={handleFileChange} />
                            </div>

                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={uploading}>
                                {uploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                Upload Securely
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List */}
                <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
                    <CardHeader>
                        <CardTitle>Recent Uploads</CardTitle>
                        <CardDescription>History of uploaded payslips.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {payslips.map((slip) => (
                                <div key={slip.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">
                                                {slip.user?.name || "Unknown User"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {slip.month} {slip.year} • ${parseFloat(slip.amount).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${slip.status === 'GENERATED' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {slip.status}
                                        </span>
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
