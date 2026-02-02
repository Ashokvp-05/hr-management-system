"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Zap,
    ArrowRight,
    Check,
    ChevronLeft,
    ShieldCheck,
    Fingerprint,
    Cpu
} from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await apiRes.json()

            if (!apiRes.ok) {
                throw new Error(data.error || "Registration failed")
            }

            router.push("/login?registered=true")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] selection:bg-emerald-500/10 relative overflow-hidden">
            {/* Background elements to match Login "Clear" theme */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-[500px] z-10 px-6 py-12"
            >
                {/* Navigation Back */}
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-colors mb-8 group"
                >
                    <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                    Back to Auth
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden relative">
                    {/* Header Branding */}
                    <div className="bg-slate-50/50 border-b border-slate-100 p-10 text-center space-y-4">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 -rotate-3 transition-transform hover:rotate-0">
                                <Zap className="w-6 h-6 text-white fill-white" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Rudratic</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Technologies</span>
                            </div>
                        </Link>
                        <div className="pt-2">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900">Provision Identity</h2>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1 italic">New Registry Instance</p>
                        </div>
                    </div>

                    <div className="p-10 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                                        <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-900 rounded-2xl">
                                            <AlertDescription className="text-[11px] font-bold uppercase tracking-tight italic">{error}</AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">Legal Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Identification Name"
                                        className="h-14 bg-slate-50 border-slate-200 rounded-2xl px-5 focus-visible:ring-emerald-500 focus-visible:bg-white transition-all text-md font-medium"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">Identity Resource (Email)</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@rudratic.tech"
                                        className="h-14 bg-slate-50 border-slate-200 rounded-2xl px-5 focus-visible:ring-emerald-500 focus-visible:bg-white transition-all text-md font-medium"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">Passphrase</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl px-5 focus-visible:ring-emerald-500 focus-visible:bg-white transition-all text-md"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">Verify</Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl px-5 focus-visible:ring-emerald-500 focus-visible:bg-white transition-all text-md"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-md font-black uppercase tracking-[0.1em] shadow-xl shadow-emerald-500/10 transition-all hover:translate-y-[-2px] active:translate-y-0 mt-4"
                                disabled={loading}
                            >
                                {loading ? "Syncing Registry..." : "Initialize Identity"}
                            </Button>
                        </form>

                        <div className="text-center space-y-6">
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                                Already authenticated? {" "}
                                <Link href="/login" className="text-emerald-600 font-black hover:underline italic">
                                    Login to Portal →
                                </Link>
                            </p>

                            {/* Pro-Level Trust Bar for Light Theme Registry */}
                            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-slate-100 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                <div className="flex flex-col items-center gap-2">
                                    <Fingerprint className="w-5 h-5 text-emerald-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Biometric Identity</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">SOC-II Ready</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Cpu className="w-5 h-5 text-emerald-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Auto-Provision</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50/50 px-10 py-4 text-center text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
                        RUD-TECH // GLOBAL_IDENTITY_NETWORK
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
