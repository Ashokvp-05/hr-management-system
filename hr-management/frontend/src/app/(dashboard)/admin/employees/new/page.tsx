"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, UserPlus, Loader2, Building, Shield, Mail, User, Lock } from "lucide-react"

export default function NewEmployeePage() {
    const router = useRouter()
    const { data: session } = useSession()
    const { toast } = useToast()
    const token = (session?.user as any)?.accessToken

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "Password123!",
        department: "Engineering",
        designation: "Software Engineer",
        roleId: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast({ title: "Employee Created", description: "Successfully onboarded new member." })
                router.push("/admin/users")
            } else {
                const err = await res.json()
                toast({ title: "Error", description: err.message || "Failed to create employee", variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error", description: "Network error", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Onboard New Personnel</h2>
                    <p className="text-muted-foreground font-medium">Create a new organizational identity and set initial permissions.</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <Card className="border-0 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-8">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-indigo-600" />
                            Employee Credentials
                        </CardTitle>
                        <CardDescription>Enter the workspace details for the new staff member.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                        <User className="w-3.5 h-3.5" /> Full Name
                                    </label>
                                    <Input
                                        required
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-slate-50/50 dark:bg-slate-800/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5" /> Email Address
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-slate-50/50 dark:bg-slate-800/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                        <Building className="w-3.5 h-3.5" /> Department
                                    </label>
                                    <Input
                                        placeholder="Engineering"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="bg-slate-50/50 dark:bg-slate-800/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                        <Lock className="w-3.5 h-3.5" /> Set Password
                                    </label>
                                    <Input
                                        required
                                        type="text"
                                        placeholder="Enter secure password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="bg-slate-50/50 dark:bg-slate-800/50 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5" /> Designation
                                </label>
                                <Input
                                    placeholder="Lead Developer"
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    className="bg-slate-50/50 dark:bg-slate-800/50"
                                />
                            </div>

                            <div className="space-y-4 pt-4">
                                <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 py-6 text-lg font-bold">
                                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                                    Finalize Workspace Account
                                </Button>
                                <p className="text-center text-xs text-slate-400 font-medium"> Account will be initialized with status: <span className="text-emerald-500 font-bold uppercase tracking-widest">Active</span></p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
