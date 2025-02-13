import WhoToFollow from "@/components/WhoToFollow";
import ProfileSkeleton from "@/components/ProfileSkeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 ">
      <div className="lg:col-span-6 border-none rounded-lg">
        <div>
          <ProfileSkeleton />
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 space-y-4">
        <WhoToFollow />
      </div>
    </div>
  );
}
