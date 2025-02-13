import WhoToFollow from "@/components/WhoToFollow";
import { PostDetailsSkeleton } from "@/components/PostDetailsSkeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 ">
      <div className="lg:col-span-6 border-l border-r border-t border-b rounded-lg px-1">
        <div>
          <PostDetailsSkeleton />
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 sticky top-20 space-y-4">
        <WhoToFollow />
      </div>
    </div>
  );
}
