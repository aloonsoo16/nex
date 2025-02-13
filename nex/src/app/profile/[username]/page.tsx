import {
  getProfileByUsername,
  getUserPosts,
  getUserLikedPosts,
  isFollowing,
  getUserRepostedPosts,
} from "@/actions/profile.action";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";
import WhoToFollow from "@/components/WhoToFollow";
import UserTab from "@/components/UserTab";
import { getDbUserId } from "@/actions/user.action";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const ownUser = await getProfileByUsername(params.username);
  if (!ownUser)
    return {
      title: "Usuario no encontrado",
      description: "El usuario no existe",
    };

  return {
    title: `Perfil de ${ownUser.username ?? ownUser.name}`,
    description: ownUser.bio || `Perfil de Nex de ${ownUser.username}`,
  };
}

async function ProfilePageServer({ params }: { params: { username: string } }) {
  const ownUser = await getProfileByUsername(params.username);
  const dbUserId = await getDbUserId();

  if (!ownUser) notFound();
  const [posts, likedPosts, repostedPosts, isCurrentUserFollowing] =
    await Promise.all([
      getUserPosts(ownUser.id),
      getUserLikedPosts(ownUser.id),
      getUserRepostedPosts(ownUser.id),
      isFollowing(ownUser.id),
    ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6 lg:border-l lg:border-r lg:border-b rounded-xl pb-2">
        <ProfilePageClient
          user={ownUser}
          isFollowing={isCurrentUserFollowing}
        />
        <UserTab
          ownUser={ownUser}
          posts={posts}
          likedPosts={likedPosts}
          repostedPosts={repostedPosts}
          isFollowing={isCurrentUserFollowing}
          dbUserId={dbUserId}
        />
      </div>

      <div className="hidden lg:block lg:col-span-4 space-y-4">
        <WhoToFollow />
      </div>
    </div>
  );
}

export default ProfilePageServer;
