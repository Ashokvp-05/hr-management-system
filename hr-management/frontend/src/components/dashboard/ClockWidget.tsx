"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, Briefcase, Clock, PlayCircle, StopCircle } from "lucide-react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function ClockWidget({ token }: { token: string }) {
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [activeEntry, setActiveEntry] = useState<any>(null)
    const [clockType, setClockType] = useState("IN_OFFICE")
    const [isOnCall, setIsOnCall] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [error, setError] = useState("")
    const [showOvertimeModal, setShowOvertimeModal] = useState(false)

    useEffect(() => {
        fetchActiveEntry()
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (activeEntry && activeEntry.clockIn) {
            const startTime = new Date(activeEntry.clockIn).getTime()
            interval = setInterval(() => {
                setElapsedTime(Date.now() - startTime)
            }, 1000)
        } else {
            setElapsedTime(0)
        }
        return () => clearInterval(interval)
    }, [activeEntry])

    const fetchActiveEntry = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/time/active", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setActiveEntry(data) // null or object
            }
        } catch (err) {
            console.error("Failed to fetch active entry")
        } finally {
            setLoading(false)
        }
    }

    const handleClockIn = async () => {
        setError("")
        setActionLoading(true)
        try {
            let locationData = null
            if (clockType === "REMOTE") {
                if (!("geolocation" in navigator)) {
                    throw new Error("Geolocation is not supported by your browser");
                }

                try {
                    // Optional: Set a specific loading state text if you had one, using setActionLoading(true) implies work is happening.
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                        });
                    });

                    locationData = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                } catch (geoErr: any) {
                    console.error("Geolocation error:", geoErr);
                    if (geoErr.code === 1) {
                        throw new Error("Location permission denied. Please enable location services to clock in remotely.");
                    } else if (geoErr.code === 2) {
                        throw new Error("Location unavailable. Please check your network.");
                    } else if (geoErr.code === 3) {
                        throw new Error("Location request timed out.");
                    } else {
                        throw new Error("Failed to retrieve location.");
                    }
                }
            }

            const res = await fetch("http://localhost:4000/api/time/clock-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ type: clockType, location: locationData, isOnCall })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Clock in failed")
            }

            const data = await res.json()
            setActiveEntry(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleClockOutClick = () => {
        // Check if duration > 12 hours (12 * 60 * 60 * 1000 = 43200000 ms)
        if (elapsedTime > 43200000) {
            setShowOvertimeModal(true)
        } else {
            handleClockOut()
        }
    }

    const handleClockOut = async () => {
        setError("")
        setActionLoading(true)
        try {
            const res = await fetch("http://localhost:4000/api/time/clock-out", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!res.ok) {
                throw new Error("Clock out failed")
            }

            setActiveEntry(null)
            setShowOvertimeModal(false)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    if (loading) {
        return <Card className="w-full h-48 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></Card>
    }

    return (
        <>
            <Card className="w-full shadow-sm border-border/60">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground">
                        <span>Time Tracker</span>
                        <Clock className="w-4 h-4 opacity-50" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    {error && <Alert variant="destructive" className="py-2"><AlertDescription>{error}</AlertDescription></Alert>}

                    {activeEntry ? (
                        <div className="flex flex-col items-center justify-center space-y-1">
                            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                ACTIVE SESSION
                            </div>
                            <div className="text-5xl font-mono font-medium tracking-tight tabular-nums">
                                {formatTime(elapsedTime)}
                            </div>
                            <div className="text-xs text-muted-foreground flex flex-col items-center gap-1">
                                <div className="flex items-center gap-1">
                                    {activeEntry.clockType === 'REMOTE' ? <MapPin className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                                    {activeEntry.clockType === 'REMOTE' ? 'Remote' : 'Office'} &bull; Started at {new Date(activeEntry.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {activeEntry.clockType === 'REMOTE' && (
                                    <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                                        &bull; Location Captured
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-center py-2">
                                <span className="text-3xl font-mono text-muted-foreground/30">00:00:00</span>
                                <p className="text-xs text-muted-foreground mt-1">Ready to start your shift?</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div
                                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center gap-1 transition-all ${clockType === 'IN_OFFICE' ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'hover:bg-muted'}`}
                                    onClick={() => setClockType('IN_OFFICE')}
                                >
                                    <Briefcase className="w-5 h-5 mb-1 opacity-80" />
                                    <span className="text-xs font-medium">Office</span>
                                </div>
                                <div
                                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center gap-1 transition-all ${clockType === 'REMOTE' ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'hover:bg-muted'}`}
                                    onClick={() => setClockType('REMOTE')}
                                >
                                    <MapPin className="w-5 h-5 mb-1 opacity-80" />
                                    <span className="text-xs font-medium">Remote</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    {activeEntry ? (
                        <Button variant="destructive" className="w-full" onClick={handleClockOutClick} disabled={actionLoading}>
                            {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            End Shift
                        </Button>
                    ) : (
                        <Button className="w-full" size="lg" onClick={handleClockIn} disabled={actionLoading}>
                            {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Start Work
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <AlertDialog open={showOvertimeModal} onOpenChange={setShowOvertimeModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Overtime</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have worked for more than 12 hours. Please confirm that this is correct and authorized.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClockOut} className="bg-red-600 hover:bg-red-700">
                            Confirm Clock Out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
