import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostDetailsSkeleton() {
  return (
    <Card className="overflow-hidden border-l-0 border-r-0 border-t border-b-0 rounded-none shadow-none">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <div className="flex space-x-3 sm:space-x-4">
              <Skeleton className="w-12 h-12 rounded-full border-4 border-secondary" />
              <div className="min-w-0 text-sm flex-1">
                <div className="flex flex-col items-start justify-center h-full gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>

            <div className="py-2">
              <Skeleton className="h-8 w-full" />
            </div>

            <Skeleton className="w-full h-60 rounded-lg" />

            <div className="flex flex-row items-center gap-2 mt-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex space-x-3 h-40">
              <Skeleton className="w-10 h-10 rounded-full border-4 border-secondary" />
              <div className="flex-1 gap-4 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            <div className="flex flex-row items-end justify-end">
              <div className="px-4 py-2">
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex space-x-3 pl-4 py-4 pr-2 rounded-lg bg-secondary/25"
                >
                  <Skeleton className="w-10 h-10 rounded-full border-4 border-secondary" />
                  <div className="flex-1 min-w-0 px-1">
                    <div className="text-sm text-muted-foreground space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
