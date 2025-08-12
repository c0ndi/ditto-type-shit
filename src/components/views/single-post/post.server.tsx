import { Suspense } from "react";
import { FirstLoadServer } from "./test_components/first-load.server";

export async function PostViewServer({ postId }: { postId: string }) {
  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto">
      <Suspense fallback={<div>Loading first load...</div>}>
        <FirstLoadServer postId={postId} />
      </Suspense>
    </div >
  );
}