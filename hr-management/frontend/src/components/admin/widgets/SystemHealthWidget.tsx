import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Database, Activity, Wifi } from "lucide-react"

export function SystemHealthWidget({ health }: { health: any }) {
    if (!health) return null

    return (
        <Card className="shadow-sm border-0 ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    System Health
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                            <Server className="w-4 h-4" />
                            <span className="text-xs font-semibold">Server</span>
                        </div>
                        <span className="text-sm font-bold capitalize">{health.server}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <Database className="w-4 h-4" />
                            <span className="text-xs font-semibold">Database</span>
                        </div>
                        <span className="text-sm font-bold capitalize">{health.db}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                            <Wifi className="w-4 h-4" />
                            <span className="text-xs font-semibold">Latency</span>
                        </div>
                        <span className="text-sm font-bold">{health.apiLatency}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-400">
                            <Activity className="w-4 h-4" />
                            <span className="text-xs font-semibold">Backup</span>
                        </div>
                        <span className="text-sm font-bold">{health.lastBackup}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
