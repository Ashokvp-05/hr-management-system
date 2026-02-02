"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

const leaveSchema = z.object({
    type: z.enum(["CASUAL", "MEDICAL", "OTHER", "EARNED", "UNPAID"]),
    startDate: z.date(),
    endDate: z.date(),
    reason: z.string().min(5, "Reason must be at least 5 characters"),
}).refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
})

export default function LeaveRequestForm({ token }: { token: string }) {
    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState<any>(null)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof leaveSchema>>({
        resolver: zodResolver(leaveSchema),
        defaultValues: {
            reason: "",
        },
    })

    const selectedType = form.watch("type")

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/leaves/balance", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) setBalance(await res.json())
            } catch (e) {
                console.error("Failed to fetch balance")
            }
        }
        if (token) fetchBalance()
    }, [token])

    async function onSubmit(data: z.infer<typeof leaveSchema>) {
        setLoading(true)
        try {
            const res = await fetch("http://localhost:4000/api/leaves/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Failed to submit request")
            }

            toast({ title: "Success", description: "Leave request submitted successfully" })
            form.reset()
        } catch (error: any) {
            toast({ title: "Submission Failed", description: error.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const typeBalance = balance ? {
        CASUAL: balance.casual,
        MEDICAL: balance.sick,
        EARNED: balance.earned,
        OTHER: "N/A",
        UNPAID: "N/A"
    }[selectedType] : "..."

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex gap-4 items-end">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Leave Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select leave type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="CASUAL">Casual Leave</SelectItem>
                                        <SelectItem value="MEDICAL">Medical Leave</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                        <SelectItem value="EARNED">Earned Leave</SelectItem>
                                        <SelectItem value="UNPAID">Unpaid Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {selectedType && (
                        <div className="p-3 bg-muted/50 rounded-lg text-xs flex items-center gap-2 border border-border/50 animate-in fade-in duration-300">
                            <Info className="w-3 h-3 text-indigo-500" />
                            <span>Available: <b>{typeBalance} Days</b></span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reason</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Tell us why you need leave" className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Request
                </Button>
            </form>
        </Form>
    )
}
