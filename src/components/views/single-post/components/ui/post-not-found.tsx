import { Card, CardContent } from "@/components/ui/card";

type Props = {
  postError: string | null;
}

export function PostNotFound({ postError }: Props) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6 text-center">
        <p className="text-destructive">{postError ?? "Post not found"}</p>
      </CardContent>
    </Card>
  )
}