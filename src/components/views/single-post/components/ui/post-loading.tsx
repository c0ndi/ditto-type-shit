import { Card, CardContent } from "@/components/ui/card";

export function PostLoading() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="aspect-square bg-muted rounded-lg" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-32" />
              <div className="h-3 bg-muted rounded w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}