import { getPosts, getReposts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server";
import RepostCard from "@/components/RepostCard";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default async function Home() {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = await currentUser();
  const posts = await getPosts();
  const reposts = await getReposts();
  const dbUserId = await getDbUserId();

  const allItems: any[] = [];

  posts.forEach((post) => allItems.push({ ...post, type: "post" }));

  reposts.forEach((repost) => {
    const originalPost = posts.find((post) => post.id === repost.postId);
    if (originalPost) {
      allItems.push({ ...originalPost, type: "repost", repostData: repost });
    }
  });

  allItems.sort((a, b) => {
    const dateA = new Date(
      a.type === "repost" ? a.repostData.createdAt : a.createdAt
    );
    const dateB = new Date(
      b.type === "repost" ? b.repostData.createdAt : b.createdAt
    );
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-6 w-full gap-6 ">
      <div className="lg:col-span-6 lg:border rounded-xl py-2">
        {user ? (
          <CreatePost />
        ) : (
          <div className="m-4 p-2 flex flex-col gap-4 items-center flex-1 justify-center">
            <p className="truncate text-sm text-primary">
              ¿Quieres publicar algo?
            </p>
            <SignInButton mode="modal">
              <Button className="rounded-full" variant="default">
                Iniciar sesión
              </Button>
            </SignInButton>
          </div>
        )}

        <div>
          {allItems.map((item) => (
            <div key={item.type === "repost" ? item.repostData.id : item.id}>
              {item.type === "repost" ? (
                <RepostCard
                  repost={item.repostData}
                  post={item}
                  dbUserId={dbUserId}
                />
              ) : (
                <PostCard
                  post={item}
                  dbUserId={dbUserId}
                  text={""}
                  direction={""}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 sticky top-20 space-y-4">
        <WhoToFollow />
      </div>
    </div>
  );
}
