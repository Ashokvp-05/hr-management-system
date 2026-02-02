"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Zap } from "lucide-react"

function LoginForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            })

            if (result?.error) {
                throw new Error("Invalid credentials")
            }

            router.push("/dashboard")
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#ffffff] text-slate-900 selection:bg-slate-200">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[360px] px-6"
            >
                {/* 1. Ultra Minimal Header */}
                <div className="text-center mb-10 space-y-2">
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200">
                        <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        Sign in to Rudratic
                    </h1>
                    <p className="text-sm text-slate-500">
                        Welcome back! Please enter your details.
                    </p>
                </div>

                {/* 2. Clean Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="overflow-hidden"
                            >
                                <Alert variant="destructive" className="bg-red-50 border-none text-red-600 py-3 px-4 rounded-xl">
                                    <AlertDescription className="text-xs font-semibold text-center">{error}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 ml-1">Email</label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="h-11 bg-white border-slate-200 rounded-xl px-4 text-sm font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-0 transition-all placeholder:text-slate-400"
                                required
                                autoFocus
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 ml-1">Password</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-11 bg-white border-slate-200 rounded-xl px-4 text-sm font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-0 transition-all placeholder:text-slate-400"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {/* Optional: Checkbox for 'Remember me' if needed later */}
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-lg shadow-slate-200 hover:translate-y-[-1px] active:translate-y-0"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold tracking-wide transition-all"
                        onClick={() => signIn("google")}
                    >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </Button>
                </form>

                <div className="mt-8 text-center text-xs text-slate-400">
                    <p>© 2026 Rudratic Technologies</p>
                </div>
            </motion.div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <LoginForm />
        </Suspense>
    )
}
