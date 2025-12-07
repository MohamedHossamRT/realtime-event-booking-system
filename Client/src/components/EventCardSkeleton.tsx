import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50 bg-card">
      {/* Image Skeleton */}
      <div className="aspect-[16/10] animate-shimmer" />

      <CardHeader className="pb-2">
        <div className="h-5 w-3/4 rounded-md animate-shimmer" />
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded animate-shimmer" />
            <div className="h-4 w-24 rounded animate-shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded animate-shimmer" />
            <div className="h-4 w-16 rounded animate-shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded animate-shimmer" />
            <div className="h-4 w-32 rounded animate-shimmer" />
          </div>
        </div>

        {/* Availability Bar Skeleton */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded animate-shimmer" />
            <div className="h-3 w-12 rounded animate-shimmer" />
          </div>
          <div className="h-1.5 w-full rounded-full animate-shimmer" />
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="h-10 w-full rounded-lg animate-shimmer" />
      </CardFooter>
    </Card>
  );
}
