"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2, Lock, LayoutDashboard, Calculator, History, User, MessageSquare, ShieldCheck, Zap, Calendar, DollarSign, Check, X, Search, MoreHorizontal, Building } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Trash2, Plus, Upload as UploadIcon, Filter, ArrowUpDown } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export default function PayslipPage() {
    const { data: session } = useSession()
    const [payslips, setPayslips] = useState<any[]>([])
    const [pendingRelease, setPendingRelease] = useState<any[]>([])
    const [allUsers, setAllUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [releasing, setReleasing] = useState<string | null>(null)
    const [bulkReleasing, setBulkReleasing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [mounted, setMounted] = useState(false)

    // Generate Form State
    const [showGenerateModal, setShowGenerateModal] = useState(false)
    const [genData, setGenData] = useState({ userId: "", month: "", year: new Date().getFullYear().toString(), amount: "" })
    const [generating, setGenerating] = useState(false)

    // Upload Form State
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [uploadData, setUploadData] = useState({ userId: "", month: "", year: new Date().getFullYear().toString(), amount: "" })
    const [uploadFile, setUploadFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    const role = (session?.user?.role || "USER").toUpperCase()
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'FINANCE_ADMIN'].includes(role)
    const userName = session?.user?.name?.split(' ')[0] || "User"

    useEffect(() => {
        setMounted(true)
        const init = async () => {
            const token = (session?.user as any)?.accessToken
            if (!token) return

            try {
                // Fetch PERSONAL payslips
                const myRes = await fetch(`${API_URL}/payslips/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (myRes.ok) setPayslips(await myRes.json())

                // If ADMIN, fetch GLOBAL pending release AND all users
                if (isAdmin) {
                    const globalRes = await fetch(`${API_URL}/payslips/all?status=GENERATED`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (globalRes.ok) setPendingRelease(await globalRes.json())

                    const usersRes = await fetch(`${API_URL}/users`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (usersRes.ok) setAllUsers(await usersRes.json())
                }

            } catch (e) {
                console.error(e)
                toast.error("Failed to sync financial data")
            } finally {
                setLoading(false)
            }
        }
        if (session) init()
    }, [session, isAdmin])

    const handleRelease = async (id: string) => {
        const token = (session?.user as any)?.accessToken
        if (!token) return

        setReleasing(id)
        try {
            const res = await fetch(`${API_URL}/payslips/${id}/release`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                setPendingRelease(prev => prev.filter(p => p.id !== id))
                toast.success("Payslip released to employee portal")
            } else {
                toast.error("Failed to release payslip")
            }
        } catch (e) {
            toast.error("Network error during distribution")
        } finally {
            setReleasing(null)
        }
    }

    const handleBulkRelease = async () => {
        if (selectedIds.length === 0) return
        const token = (session?.user as any)?.accessToken
        if (!token) return

        setBulkReleasing(true)
        try {
            const res = await fetch(`${API_URL}/payslips/bulk-release`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ids: selectedIds })
            })

            if (res.ok) {
                setPendingRelease(prev => prev.filter(p => !selectedIds.includes(p.id)))
                setSelectedIds([])
                toast.success(`Successfully released ${selectedIds.length} payslips`)
            } else {
                toast.error("Bulk release failed")
            }
        } catch (e) {
            toast.error("Network error during bulk dispatch")
        } finally {
            setBulkReleasing(false)
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        )
    }

    const filteredPending = pendingRelease.filter(slip =>
        slip.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slip.month.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleGenerate = async () => {
        const { userId, month, year, amount } = genData
        if (!userId || !month || !year || !amount) {
            return toast.error("Please fill all fields")
        }

        const token = (session?.user as any)?.accessToken
        setGenerating(true)
        try {
            const res = await fetch(`${API_URL}/payslips/generate`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, month, year: parseInt(year), amount: parseFloat(amount) })
            })

            if (res.ok) {
                const newSlip = await res.json()
                setPendingRelease(prev => [newSlip, ...prev])
                setShowGenerateModal(false)
                setGenData({ userId: "", month: "", year: new Date().getFullYear().toString(), amount: "" })
                toast.success("Payslip generated and queued for release")
            } else {
                const err = await res.json()
                toast.error(err.message || "Failed to generate payslip")
            }
        } catch (e) {
            toast.error("Internal generation failure")
        } finally {
            setGenerating(false)
        }
    }

    const handleUpload = async () => {
        const { userId, month, year, amount } = uploadData
        if (!userId || !month || !year || !amount || !uploadFile) {
            return toast.error("Please fill all fields and select a file")
        }

        const token = (session?.user as any)?.accessToken
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("userId", userId)
            formData.append("month", month)
            formData.append("year", year)
            formData.append("amount", amount)
            formData.append("file", uploadFile)

            const res = await fetch(`${API_URL}/payslips/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            })

            if (res.ok) {
                const newSlip = await res.json()
                setPendingRelease(prev => [newSlip, ...prev])
                setShowUploadModal(false)
                setUploadData({ userId: "", month: "", year: new Date().getFullYear().toString(), amount: "" })
                setUploadFile(null)
                toast.success("External payslip record uploaded")
            } else {
                toast.error("Upload failed")
            }
        } catch (e) {
            toast.error("Encryption upload error")
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this record?")) return

        const token = (session?.user as any)?.accessToken
        try {
            const res = await fetch(`${API_URL}/payslips/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                setPendingRelease(prev => prev.filter(p => p.id !== id))
                toast.success("Record expunged from database")
            } else {
                toast.error("Failed to delete record")
            }
        } catch (e) {
            toast.error("Operation failed")
        }
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredPending.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredPending.map(p => p.id))
        }
    }

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

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="animate-spin h-12 w-12 text-indigo-600 opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Decrypting Payroll Data...</p>
        </div>
    )

    return (
        <div className="max-w-[1400px] mx-auto w-full p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">

            {/* PROFESSIONAL HEADER BAR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100 dark:border-white/5">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Calculator className="w-8 h-8 text-indigo-600" />
                        Payroll & Documents
                    </h1>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
                        Secure Access Portal • {isAdmin ? "ADMINISTRATOR" : "EMPLOYEE"} LEVEL
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {isAdmin && (
                        <div className="flex items-center gap-2 mr-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowUploadModal(true)}
                                className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <UploadIcon className="w-4 h-4" />
                                External Upload
                            </Button>
                            <Button
                                onClick={() => setShowGenerateModal(true)}
                                className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                            >
                                <Plus className="w-4 h-4" />
                                Generate New
                            </Button>
                        </div>
                    )}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm transition-all hover:bg-slate-50">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Security Status</p>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Fully Encrypted</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK STATS - High Professionalism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Distributed", value: payslips.length, unit: "Documents", icon: FileText, color: "indigo" },
                    { label: "Average Monthly", value: mounted ? `$${(payslips.reduce((acc, s) => acc + parseFloat(s.amount), 0) / (payslips.length || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "0.00", icon: DollarSign, color: "emerald" },
                    { label: "Next Projected", value: mounted ? format(new Date(), 'MMM yyyy') : "Pending", icon: Calendar, color: "amber" }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow rounded-3xl overflow-hidden group">
                        <CardContent className="p-6 flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-950/20 flex items-center justify-center border border-${stat.color}-100 dark:border-${stat.color}-900/30 group-hover:scale-105 transition-transform`}>
                                <stat.icon className={`w-7 h-7 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value} <span className="text-xs font-bold text-slate-400 opacity-60 ml-1">{stat.unit}</span></p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* 2. SIDEBAR - Navigation & Privacy (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl p-2 space-y-1 shadow-sm">
                        {[
                            { name: "My Archive", icon: LayoutDashboard, value: "personal", active: true },
                            isAdmin && { name: "Audit Console", icon: ShieldCheck, value: "management", active: false },
                            { name: "Timesheet", icon: History, href: "/attendance" },
                        ].filter(Boolean).map((item: any) => (
                            <div
                                key={item.name}
                                className={cn(
                                    "flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-xs transition-all group relative cursor-pointer",
                                    item.active
                                        ? "bg-slate-900 text-white dark:bg-indigo-600 shadow-lg shadow-indigo-500/10"
                                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", item.active ? "text-white" : "text-slate-400 group-hover:text-indigo-500")} />
                                {item.name}
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl text-white space-y-4 shadow-xl shadow-indigo-500/20 relative overflow-hidden hidden lg:block">
                        <Lock className="absolute top-0 right-0 w-32 h-32 text-white/5 -mr-10 -mt-10" />
                        <h4 className="text-lg font-black tracking-tight leading-tight">Advanced Privacy</h4>
                        <p className="text-[10px] text-indigo-100/60 leading-relaxed font-medium">
                            Isolated AES-256 bank-grade encryption.
                        </p>
                    </div>
                </div>

                {/* 3. MAIN CONTENT (7 cols) */}
                <div className="lg:col-span-7">
                    <Tabs defaultValue={isAdmin ? "management" : "personal"} className="w-full">
                        {isAdmin && (
                            <div className="flex items-center justify-between mb-8 p-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm max-w-sm">
                                <TabsList className="bg-transparent h-10 w-full p-0">
                                    <TabsTrigger value="personal" className="flex-1 rounded-xl data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 text-[10px] font-black uppercase tracking-widest">Personal</TabsTrigger>
                                    <TabsTrigger value="management" className="flex-1 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest">Audit Terminal</TabsTrigger>
                                </TabsList>
                            </div>
                        )}

                        <TabsContent value="personal">
                            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-black/50 bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="p-8 lg:p-10 border-b border-slate-50 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">Payslip History</CardTitle>
                                            <CardDescription className="font-medium text-slate-500">Displaying payslips for the last 12 months.</CardDescription>
                                        </div>
                                        <Badge variant="outline" className="px-4 py-1.5 rounded-full border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                                            Personal View
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-10">
                                    <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Month</th>
                                                    <th className="px-6 py-4 text-right"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                                {payslips.map((slip) => (
                                                    <tr key={slip.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <span className="font-bold text-slate-700 dark:text-slate-200">{slip.month} {slip.year}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDownload(slip.id, `Payslip_${slip.month}_${slip.year}.pdf`)}
                                                                className="h-9 px-6 rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white dark:border-indigo-900 transition-all active:scale-95"
                                                            >
                                                                Download PDF
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5 text-amber-600" />
                                        <p className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-500 tracking-tight">
                                            Payslips older than 1 year require admin approval. Request below.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {isAdmin && (
                            <TabsContent value="management">
                                <Card className="border-none shadow-xl bg-slate-900 dark:bg-black text-white rounded-[2.5rem] overflow-hidden">
                                    <CardHeader className="p-8 border-b border-white/5 bg-gradient-to-br from-slate-900 to-indigo-950">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <CardTitle className="text-2xl font-black flex items-center gap-3">
                                                    <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
                                                    Distribution Queue
                                                </CardTitle>
                                                <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Authorized Payroll Dispatch</CardDescription>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search Employee..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="bg-white/5 border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 ring-indigo-500 w-48 transition-all"
                                                    />
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={toggleSelectAll}
                                                    className="h-9 rounded-xl text-[9px] font-black uppercase border-white/10 hover:bg-white/10"
                                                >
                                                    {selectedIds.length === filteredPending.length ? "Deselect All" : "Select All"}
                                                </Button>
                                                {selectedIds.length > 0 && (
                                                    <Button
                                                        onClick={handleBulkRelease}
                                                        disabled={bulkReleasing}
                                                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[9px] px-4 rounded-xl h-9 animate-in zoom-in-95 duration-200"
                                                    >
                                                        {bulkReleasing ? "Dispatching..." : `Release Selection (${selectedIds.length})`}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <ScrollArea className="h-[600px] w-full">
                                            <div className="p-4 space-y-3">
                                                {filteredPending.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                                        <Check className="w-12 h-12 mb-4 opacity-10" />
                                                        <p className="font-bold text-sm">No pending distributions found.</p>
                                                    </div>
                                                ) : (
                                                    filteredPending.map((slip) => (
                                                        <div
                                                            key={slip.id}
                                                            onClick={() => toggleSelect(slip.id)}
                                                            className={cn(
                                                                "p-5 rounded-3xl border transition-all group cursor-pointer relative overflow-hidden",
                                                                selectedIds.includes(slip.id)
                                                                    ? "bg-indigo-600/20 border-indigo-500/50"
                                                                    : "bg-white/5 border-white/5 hover:bg-white/10"
                                                            )}
                                                        >
                                                            {selectedIds.includes(slip.id) && (
                                                                <div className="absolute top-0 right-0 p-2">
                                                                    <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                                                                        <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={cn(
                                                                        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors",
                                                                        selectedIds.includes(slip.id) ? "bg-indigo-500/20 border-indigo-500/40" : "bg-white/5 border-white/10"
                                                                    )}>
                                                                        <User className={cn("w-6 h-6", selectedIds.includes(slip.id) ? "text-indigo-400" : "text-slate-500")} />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-black text-lg group-hover:text-indigo-300 transition-colors">{slip.user?.name}</h4>
                                                                        <div className="flex items-center gap-3 mt-1">
                                                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] font-black px-2 py-0">READY</Badge>
                                                                            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                                                                                <Calendar className="w-3 h-3" /> {slip.month} {slip.year}
                                                                                <span className="h-1 w-1 rounded-full bg-slate-700" />
                                                                                <Building className="w-3 h-3" /> {slip.user?.department || "HR"}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="flex items-center justify-end gap-1 text-indigo-400 font-black text-xl">
                                                                        <DollarSign className="w-4 h-4" />
                                                                        {mounted ? parseFloat(slip.amount).toLocaleString() : slip.amount}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-3">
                                                                        <Button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDelete(slip.id);
                                                                            }}
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-8 w-8 p-0 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleRelease(slip.id);
                                                                            }}
                                                                            disabled={releasing === slip.id}
                                                                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[9px] rounded-xl px-5 h-8 transition-all"
                                                                        >
                                                                            {releasing === slip.id ? "..." : "Release"}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                    <div className="bg-white/[0.02] p-6 text-center border-t border-white/5">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                            Authorized Admin Dispatch System • 256-bit AES Compliance
                                        </p>
                                    </div>
                                </Card>
                            </TabsContent>
                        )}
                    </Tabs>
                </div>

                {/* 4. RIGHT SIDEBAR (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-black/50 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <History className="w-5 h-5 text-indigo-600" />
                                Legacy Portal
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                Documents older than 1 year require administrative authorization.
                            </p>
                        </div>
                        <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 text-[10px]">
                            Request Clearance
                        </Button>
                        <div className="pt-4 border-t border-slate-50 dark:border-white/5">
                            <div className="flex items-center gap-3 text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-dotted border-slate-200">
                                <MessageSquare className="w-4 h-4 text-amber-500" />
                                <p className="text-[9px] font-bold leading-tight italic uppercase tracking-tighter">
                                    Direct encryption handoff will trigger upon approval.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Enterprise Compliance</h4>
                        <div className="space-y-4">
                            {[
                                { label: "Encryption", val: "AES-256", status: "Active" },
                                { label: "Protocol", val: "HTTPS/TLS", status: "Verified" },
                                { label: "Data Residency", val: "Domestic", status: "Secure" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[10px]">
                                    <span className="font-bold text-slate-500">{item.label}</span>
                                    <span className="font-black text-slate-900 dark:text-white uppercase px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* GENERATE MODAL */}
            <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
                <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900">Auto-Generate Payslip</DialogTitle>
                        <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Secure Template Engine v2.0</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Employee Select</Label>
                            <Select onValueChange={(v) => setGenData({ ...genData, userId: v })}>
                                <SelectTrigger className="rounded-xl h-11 border-slate-100 bg-slate-50 font-bold">
                                    <SelectValue placeholder="Choose target..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100">
                                    {allUsers.map(u => (
                                        <SelectItem key={u.id} value={u.id} className="font-bold text-xs">{u.name} ({u.email})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Month</Label>
                                <Select onValueChange={(v) => setGenData({ ...genData, month: v })}>
                                    <SelectTrigger className="rounded-xl h-11 border-slate-100 bg-slate-50 font-bold">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100">
                                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                            <SelectItem key={m} value={m} className="font-bold text-xs">{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Year</Label>
                                <Input
                                    type="number"
                                    defaultValue={new Date().getFullYear()}
                                    onChange={(e) => setGenData({ ...genData, year: e.target.value })}
                                    className="rounded-xl h-11 border-slate-100 bg-slate-50 font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Basic Salary Amount ($)</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 5000.00"
                                onChange={(e) => setGenData({ ...genData, amount: e.target.value })}
                                className="rounded-xl h-11 border-slate-100 bg-slate-50 font-bold"
                            />
                        </div>
                    </div>
                    <DialogFooter className="pt-8">
                        <Button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20"
                        >
                            {generating ? "Synthesizing PDF..." : "Execute Generation"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* UPLOAD MODAL */}
            <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900">Manual Archive Upload</DialogTitle>
                        <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-slate-400">External Document Handoff</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target User</Label>
                            <Select onValueChange={(v) => setUploadData({ ...uploadData, userId: v })}>
                                <SelectTrigger className="rounded-xl h-11 border-slate-100 bg-slate-50 font-bold">
                                    <SelectValue placeholder="Choose beneficiary..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100">
                                    {allUsers.map(u => (
                                        <SelectItem key={u.id} value={u.id} className="font-bold text-xs">{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Month</Label>
                                <Select onValueChange={(v) => setUploadData({ ...uploadData, month: v })}>
                                    <SelectTrigger className="rounded-xl h-11 border-slate-100 bg-slate-50 font-bold">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100">
                                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                            <SelectItem key={m} value={m} className="font-bold text-xs">{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Year</Label>
                                <Input
                                    type="number"
                                    defaultValue={new Date().getFullYear()}
                                    onChange={(e) => setUploadData({ ...uploadData, year: e.target.value })}
                                    className="rounded-xl h-11 border-slate-100 bg-slate-50 font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Amount Display ($)</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                onChange={(e) => setUploadData({ ...uploadData, amount: e.target.value })}
                                className="rounded-xl h-11 border-slate-100 bg-slate-50 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select PDF</Label>
                            <Input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                className="rounded-xl h-11 border-slate-100 bg-slate-50 font-bold pt-2 text-[10px]"
                            />
                        </div>
                    </div>
                    <DialogFooter className="pt-8">
                        <Button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full h-12 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl"
                        >
                            {uploading ? "Uploading Securely..." : "Archive Document"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
