"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("http://localhost:4000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to send reset email")
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white p-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] space-y-8"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Zap className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Rudratic</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Security Protocol</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2 text-center">
                        <h2 className="text-xl font-bold text-slate-900">Forgot Password</h2>
                        <p className="text-sm text-slate-500">Enter your email and we'll send you a link to reset your password.</p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-900 py-3">
                                    <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold text-slate-500 ml-1">Work Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl pl-10 focus-visible:ring-primary focus-visible:bg-white transition-all font-medium"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/10 transition-all hover:translate-y-[-1px] active:translate-y-0 mt-2"
                                disabled={loading}
                            >
                                {loading ? "Sending link..." : "Send Reset Link"}
                            </Button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-4"
                        >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-emerald-900 font-bold">Check your email</h3>
                                <p className="text-emerald-700 text-xs mt-1">We have sent a password reset link to <br /><strong>{email}</strong></p>
                            </div>
                            <Button variant="outline" className="w-full bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-100" onClick={() => setSuccess(false)}>
                                Back to reset
                            </Button>
                        </motion.div>
                    )}

                    <div className="pt-6 text-center">
                        <Link href="/login" className="inline-flex items-center gap-2 text-xs text-slate-500 font-bold hover:text-primary transition-colors">
                            <ArrowLeft className="w-3 h-3" /> Back to Login
                        </Link>
                    </div>
                </div>

                <div className="pt-8 text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                    © 2026 Rudratic Technologies
                </div>
            </motion.div>
        </div>
    )
}
