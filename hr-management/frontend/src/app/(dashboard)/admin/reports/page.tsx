"use client"

import * as React from "react"
import { format, subDays } from "date-fns"
import { Calendar as CalendarIcon, Download, Search } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useSession } from "next-auth/react"

export default function ReportsPage() {
    const { data: session } = useSession()
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
    })
    const [reportData, setReportData] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)

    const handleGenerate = async () => {
        if (!date?.from || !date?.to) return;

        setLoading(true);
        try {
            const start = date.from.toISOString();
            const end = date.to.toISOString();
            const res = await fetch(`http://localhost:4000/api/time/reports?start=${start}&end=${end}`, {
                headers: { Authorization: `Bearer ${session?.user?.accessToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReportData(data);
            }
        } catch (err) {
            console.error("Failed to fetch report", err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (reportData.length === 0) return;

        const headers = ["Employee", "Department", "Date", "Clock In", "Clock Out", "Hours"];
        const rows = reportData.map(entry => [
            entry.user.name,
            entry.user.department || "-",
            format(new Date(entry.clockIn), "yyyy-MM-dd"),
            format(new Date(entry.clockIn), "HH:mm"),
            entry.clockOut ? format(new Date(entry.clockOut), "HH:mm") : "-",
            entry.hoursWorked || "0"
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_report_${format(new Date(), "yyyyMMdd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
                <p className="text-muted-foreground">Generate attendance and work hour reports.</p>
            </div>

            <div className="flex items-center space-x-2">
                <div className={cn("grid gap-2")}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button onClick={handleGenerate} disabled={loading}>
                    <Search className="mr-2 h-4 w-4" /> Generate
                </Button>
                <Button variant="outline" onClick={handleExport} disabled={reportData.length === 0}>
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Attendance Report</CardTitle>
                    <CardDescription>Found {reportData.length} records.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Clock In</TableHead>
                                    <TableHead>Clock Out</TableHead>
                                    <TableHead>Hours</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center h-24">No data generated</TableCell></TableRow>
                                ) : (
                                    reportData.map((entry: any) => (
                                        <TableRow key={entry.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{entry.user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{entry.user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{format(new Date(entry.clockIn), "MMM dd, yyyy")}</TableCell>
                                            <TableCell>{format(new Date(entry.clockIn), "HH:mm")}</TableCell>
                                            <TableCell>{entry.clockOut ? format(new Date(entry.clockOut), "HH:mm") : "-"}</TableCell>
                                            <TableCell>{entry.hoursWorked}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Automation Settings</CardTitle>
                        <CardDescription>Configure automated reporting tasks.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-semibold">Weekly Email Report</h4>
                                <p className="text-xs text-muted-foreground italic">Mondays at 8:00 AM</p>
                            </div>
                            <Button size="sm" variant="outline">Configured</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg opacity-50">
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-semibold">Daily Attendance Summary</h4>
                                <p className="text-xs text-muted-foreground italic">Everyday at 11:59 PM</p>
                            </div>
                            <Button size="sm" variant="ghost">Disabled</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>External Sync</CardTitle>
                        <CardDescription>Synchronize data with external providers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Google Spreadsheet ID</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="1A2B3C4D..."
                                    className="flex-1 px-3 py-2 bg-muted/50 border rounded-md text-sm outline-none focus:ring-1 focus:ring-primary"
                                    id="sheetsId"
                                />
                                <Button
                                    className="h-10"
                                    onClick={async () => {
                                        const id = (document.getElementById('sheetsId') as HTMLInputElement).value;
                                        if (!id) return alert("Please enter a Spreadsheet ID");
                                        const res = await fetch('http://localhost:4000/api/admin/sync/sheets', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${session?.user?.accessToken}`
                                            },
                                            body: JSON.stringify({ spreadsheetId: id })
                                        });
                                        const data = await res.json();
                                        alert(data.message || (data.success ? "Sync Successful!" : "Sync Failed"));
                                    }}
                                >
                                    Sync Now
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Note: Requires service account credentials in the backend .env</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

