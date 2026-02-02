import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-9 w-[150px]" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-[200px] rounded-xl" />
                <Skeleton className="h-[200px] rounded-xl" />
                <Skeleton className="h-[200px] rounded-xl" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-[350px] rounded-xl" />
                <Skeleton className="col-span-3 h-[350px] rounded-xl" />
            </div>
        </div>
    )
}
