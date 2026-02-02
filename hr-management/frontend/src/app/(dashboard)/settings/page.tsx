"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" })
    const [passLoading, setPassLoading] = useState(false)

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordData.new !== passwordData.confirm) {
            toast({ title: "Error", description: "Passwords do not match", variant: "destructive" })
            return
        }

        setPassLoading(true)
        try {
            const token = (session?.user as any)?.accessToken
            const res = await fetch("http://localhost:4000/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.current,
                    newPassword: passwordData.new
                })
            })

            const data = await res.json()
            if (res.ok) {
                toast({ title: "Success", description: "Password updated successfully" })
                setPasswordData({ current: "", new: "", confirm: "" })
            } else {
                toast({ title: "Error", description: data.error || "Failed to update password", variant: "destructive" })
            }
        } catch (e) {
            toast({ title: "Error", description: "Network error", variant: "destructive" })
        } finally {
            setPassLoading(false)
        }
    }

    return (
        <div className="container max-w-4xl py-10 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and security.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                {/* GENERAL SETTINGS */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance & Locale</CardTitle>
                            <CardDescription>Customize how the dashboard looks for you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Dark Mode</Label>
                                    <p className="text-sm text-muted-foreground">Enable dark theme for the interface.</p>
                                </div>
                                <Switch checked={false} />
                            </div>
                            <div className="space-y-2">
                                <Label>Language</Label>
                                <Select defaultValue="en">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Time Zone</Label>
                                <Select defaultValue="ist">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Timezone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                                        <SelectItem value="ist">India (GMT+5:30)</SelectItem>
                                        <SelectItem value="pst">Pacific (GMT-8)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SECURITY SETTINGS */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password & Authentication</CardTitle>
                            <CardDescription>Update your password to keep your account safe.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <Input
                                        type="password"
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <Input
                                            type="password"
                                            value={passwordData.new}
                                            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirm Password</Label>
                                        <Input
                                            type="password"
                                            value={passwordData.confirm}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" disabled={passLoading}>
                                    {passLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Password
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="mt-6 border-red-200 dark:border-red-900/50">
                        <CardHeader>
                            <CardTitle className="text-red-600">Active Sessions</CardTitle>
                            <CardDescription>Manage devices where you are currently logged in.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
                                <div>
                                    <p className="font-medium text-sm">Chrome on Windows</p>
                                    <p className="text-xs text-muted-foreground">Dallas, USA &bull; Active Now</p>
                                </div>
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Current</span>
                            </div>
                            <Button variant="outline" className="text-red-600 hover:bg-red-50">Log Out All Other Devices</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* NOTIFICATION SETTINGS */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>Choose what updates you want to receive.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="flex-1">7 PM Clock-Out Reminder</Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="flex-1">Leave Approval Alerts</Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="flex-1">System Announcements</Label>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
