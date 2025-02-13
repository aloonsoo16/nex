import { getPostById } from "@/actions/post.action";
import { notFound } from "next/navigation";
import PostDetails from "@/components/PostDetails";
import WhoToFollow from "@/components/WhoToFollow";
import { getDbUserId } from "@/actions/user.action";
import { isFollowing } from "@/actions/profile.action";

export async function generateMetadata({
  params,
}: {
  params: { postId: string };
}) {
  const response = await getPostById(params.postId);

  if (!response.success || !response.post) {
    return {
      title: "Publicación no encontrada",
      description: "La publicación que buscas no existe",
    };
  }

  const post = response.post;
  const content = post.content?.trim();

  return {
    title: content
      ? `${post.author.name ?? post.author.username} en Nex: "${content}"`
      : "Alonso en Nex",
    description: content
      ? `${post.author.name ?? post.author.username} en Nex: "${content}"`
      : "Alonso en Nex",
  };
}

async function PostDetailPage({ params }: { params: { postId: string } }) {
  const response = await getPostById(params.postId);
  const dbUserId = await getDbUserId();

  if (!response.success || !response.post) {
    return notFound();
  }

  const post = response.post;
  const isCurrentUserFollowing = await isFollowing(post.author.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6 lg:border-l lg:border-r lg:border-t lg:border-b rounded-xl py-2">
        <div>
          <PostDetails
            key={post.id}
            post={post}
            dbUserId={dbUserId}
            text={""}
            isFollowing={isCurrentUserFollowing}
          />
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 space-y-4">
        <WhoToFollow />
      </div>
    </div>
  );
}

export default PostDetailPage;
