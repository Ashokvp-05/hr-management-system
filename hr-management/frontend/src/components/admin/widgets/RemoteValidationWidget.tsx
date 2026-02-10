import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, AlertTriangle, CheckCircle } from "lucide-react"

export function RemoteValidationWidget({ users }: { users: any[] }) {
    return (
        <Card className="shadow-sm border-0 ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Remote Validation
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {users.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No active remote users.</p>
                    ) : (
                        users.map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                        {u.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{u.name}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {u.location}
                                        </p>
                                    </div>
                                </div>
                                {u.location === 'Unknown' ? (
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
