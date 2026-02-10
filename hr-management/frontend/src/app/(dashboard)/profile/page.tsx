"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Save, User, Smartphone, Mail, Hash, Briefcase, Lock, KeyRound, LogOut, Clock } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().min(10, "Phone number must be valid.").optional().or(z.literal("")),
    discordId: z.string().optional().or(z.literal("")),
})

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [mount, setMount] = useState(false)

    // Profile data state
    const [userData, setUserData] = useState<any>(null)

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            discordId: "",
        },
    })

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    useEffect(() => {
        setMount(true)
        const fetchProfile = async () => {
            const token = (session?.user as any)?.accessToken
            if (!token) return
            try {
                const res = await fetch(`${API_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setUserData(data)
                    form.reset({
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        discordId: data.discordId || "",
                    })
                }
            } catch (e) {
                console.error("Failed to load profile", e)
            }
        }
        fetchProfile()
    }, [session, form])

    async function onSubmit(data: z.infer<typeof profileSchema>) {
        setLoading(true)
        try {
            const token = (session?.user as any)?.accessToken
            const res = await fetch(`${API_URL}/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (!res.ok) throw new Error("Failed to update")

            const updatedUser = await res.json()
            setUserData(updatedUser)

            // Update next-auth session
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: data.name,
                    email: data.email
                }
            })

            toast.success("Profile Updated")
        } catch (error) {
            toast.error("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    async function onPasswordSubmit(data: z.infer<typeof passwordSchema>) {
        setPasswordLoading(true)
        try {
            const token = (session?.user as any)?.accessToken
            const res = await fetch(`${API_URL}/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword
                })
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.error || "Failed to update password")

            toast.success("Password Updated")
            setIsPasswordModalOpen(false)
            passwordForm.reset()
        } catch (error: any) {
            toast.error(error.message || "Failed to change password.")
        } finally {
            setPasswordLoading(false)
        }
    }

    if (!mount) return null

    const initial = userData?.name?.charAt(0).toUpperCase() || "U"
    const roleName = typeof userData?.role === 'object' ? userData.role.name : (userData?.role || "EMPLOYEE")
    const joinedDate = userData?.joiningDate ? format(new Date(userData.joiningDate), "MMM yyyy") : "Jan 2026"

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-8">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <AvatarFallback className="text-4xl font-bold text-slate-500">{initial}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">{userData?.name}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">
                            Full-Time Employee
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {userData?.workMode || "Hybrid"}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Col: Details Form */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your contact details and preferences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input className="pl-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Work Email</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input className="pl-9" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input className="pl-9" placeholder="+1 234 567 890" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="discordId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Discord ID</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input className="pl-9" placeholder="username#1234" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>Used for team notifications.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col: Security & Access */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Lock className="mr-2 h-4 w-4" /> Change Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Change Password</DialogTitle>
                                        <DialogDescription>
                                            Enter your current password and a new one to update your security.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...passwordForm}>
                                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 py-4">
                                            <FormField
                                                control={passwordForm.control}
                                                name="currentPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Current Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                <Input type="password" placeholder="••••••••" className="pl-9" {...field} />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={passwordForm.control}
                                                name="newPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>New Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                <Input type="password" placeholder="••••••••" className="pl-9" {...field} />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={passwordForm.control}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Confirm New Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                <Input type="password" placeholder="••••••••" className="pl-9" {...field} />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <DialogFooter className="pt-4">
                                                <Button type="submit" disabled={passwordLoading} className="w-full sm:w-auto">
                                                    {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Update Password
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => signOut()}>
                                <LogOut className="mr-2 h-4 w-4" /> Log Out All Devices
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Role & Access</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Role</span>
                                    <span className="font-medium text-purple-600">
                                        {roleName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Work Mode</span>
                                    <span className="font-medium">Hybrid</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Joined</span>
                                    <span className="font-medium">{joinedDate}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-50 dark:bg-slate-900 border-none">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold">0h</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Hours this week
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
