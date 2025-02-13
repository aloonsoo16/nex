import { getRepostById } from "@/actions/post.action";
import { notFound } from "next/navigation";
import WhoToFollow from "@/components/WhoToFollow";
import { getDbUserId } from "@/actions/user.action";
import RepostDialog from "@/components/RepostDialog";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNowStrict, format } from "date-fns";
import { es } from "date-fns/locale";
import PostDetails from "@/components/PostDetails";
import DeleteCited from "@/components/DeleteCited";
import FollowButton from "@/components/FollowButton";
import { isFollowing } from "@/actions/profile.action";

export async function generateMetadata({
  params,
}: {
  params: { repostId: string };
}) {
  const response = await getRepostById(params.repostId);

  if (!response.success || !response.repost) {
    return {
      title: "Repost no encontrado",
      description: "El repost que buscas no existe",
    };
  }

  const repost = response.repost;
  const hasContentOrImage = repost.content || repost.image;

  return {
    title: hasContentOrImage
      ? `${repost.user.name ?? repost.user.username} en Nex:
         "${repost.content ?? ""}" sobre la publicación de ${
          repost.post.author.name ?? repost.post.author.username
        }`
      : `${
          repost.user.name ?? repost.user.username
        } ha compartido la publicación de ${
          repost.post.author.name ?? repost.post.author.username
        }`,
    description: hasContentOrImage
      ? `${repost.user.name ?? repost.user.username} en Nex: "${
          repost.content ?? ""
        }"`
      : `${
          repost.user.name ?? repost.user.username
        } ha compartido la publicación de ${
          repost.post.author.name ?? repost.post.author.username
        }`,
  };
}

async function RepostDetailsPage({ params }: { params: { repostId: string } }) {
  const response = await getRepostById(params.repostId);
  const dbUserId = await getDbUserId();

  if (!response.success || !response.repost) {
    return notFound();
  }

  const repost = response.repost;
  const formattedDate =
    format(new Date(repost.createdAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", {
      locale: es,
    })
      .charAt(0)
      .toUpperCase() +
    format(new Date(repost.createdAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", {
      locale: es,
    }).slice(1);
  const repostText =
    dbUserId === repost.user.id
      ? "Has compartido esto"
      : `${repost.user.name} ha compartido esto`;
  const post = repost.post;

  const isCurrentUserFollowing = await isFollowing(repost.user.id);

  if (!repost.content && !repost.image)
    return (
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 ">
        <div className="lg:col-span-6 lg:border rounded-lg px-1">
          <div>
            <PostDetails
              key={post.id}
              post={post}
              dbUserId={dbUserId}
              text={repostText}
              isFollowing={isCurrentUserFollowing}
            />
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-4 space-y-4">
          <WhoToFollow />
        </div>
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6 border-l border-r border-b rounded-lg px-1">
        <Card className="overflow-hidden border-l-0 border-r-0 border-t border-b-0 rounded-none shadow-none">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <div className="flex  space-x-2">
                  <Link href={`/profile/${repost.user.username}`}>
                    <Avatar className="w-12 h-12 border-4 border-transparent">
                      <AvatarImage src={repost.user.image ?? "/avatar.png"} />
                    </Avatar>
                  </Link>

                  <div className="min-w-0 text-sm flex-1">
                    <div className="flex justify-between items-center h-full w-full">
                      <div className="flex flex-col items-start min-w-0">
                        <Link
                          className="text-primary font-semibold truncate w-full"
                          href={`/profile/${repost.user.username}`}
                        >
                          {repost.user.name}{" "}
                        </Link>

                        <Link
                          className="text-muted-foreground truncate w-full"
                          href={`/profile/${repost.user.username}`}
                        >
                          @{repost.user.username}
                        </Link>
                      </div>

                      {repost.user.id !== dbUserId && (
                        <FollowButton
                          userId={repost.user.id}
                          isFollowing={isCurrentUserFollowing}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="py-2 px-1">
                  <p className="mt-2 text-sm text-primary break-words">
                    {repost.content}
                  </p>
                </div>

                {repost.image && (
                  <Card className="rounded-lg overflow-hidden mt-4 mb-4 shadow-none">
                    <img
                      src={repost.image || "/placeholder.svg"}
                      alt="Contenido de la publicación"
                      className="w-full h-auto object-cover max-h-[400px]"
                    />
                  </Card>
                )}

                <div className="flex flex-row items-center gap-2">
                  <Link href={`/repost/${repost.id}`} className="block">
                    <span className="truncate text-sm text-muted-foreground px-1 hover:underline">
                      {formattedDate}
                    </span>
                    <span className="truncate text-sm text-muted-foreground px-1 hover:underline">
                      -
                    </span>
                  </Link>
                  <p className="text-sm text-muted-foreground">Nex</p>
                  {dbUserId === repost.user.id && (
                    <DeleteCited key={post.id} post={post} />
                  )}
                </div>
              </div>

              <Card className="mt-4 shadow-none">
            <div>
              <div className="flex space-x-1 py-4 px-2">
                <Link href={`/profile/${post.author.username}`}>
                  <Avatar className="w-8 h-8 border-4 border-transparent">
                    <AvatarImage src={post.author.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>

                <div
                  className={`flex-1 min-w-0 px-1 ${
                    post.content ? "" : "flex items-center"
                  } `}
                >
                  <div className="text-sm text-muted-foreground w-full">
                    <div className="flex flex-row items-center space-x-2">
                      <Link
                        className="text-primary font-semibold truncate"
                        href={`/profile/${post.author?.username}`}
                      >
                        <p className="text-primary font-semibold truncate">
                          {post.author?.name}
                        </p>
                      </Link>

                      <Link
                        className="text-muted-foreground truncate"
                        href={`/profile/${post.author?.username}`}
                      >
                        @{post.author?.username}
                      </Link>
                      <span>•</span>

                      <Link href={`/post/${post.id}`} className="flex-grow">
                        <span className="truncate first-letter:uppercase">
                          {formatDistanceToNowStrict(new Date(post.createdAt), {
                            locale: es,
                          })}
                        </span>
                      </Link>
                    </div>
                  </div>

                  <Link href={`/post/${post.id}`} className="block">
                    <div>
                      <p className="mt-2 text-sm text-primary break-words">
                        {post.content}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Imagen de la publicación */}
              {post.image && (
                <Link href={`/post/${post.id}`} className="block">
                  <Card
                    className={`rounded-b-lg rounded-t-none overflow-hidden shadow-none ${
                      post.content ? "mt-2" : ""
                    } `}
                  >
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Contenido de la publicación"
                      className="w-full h-auto object-cover max-h-[300px]"
                    />
                  </Card>
                </Link>
              )}
            </div>
          </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:block lg:col-span-4 space-y-4">
        <WhoToFollow />
      </div>
    </div>
  );
}

export default RepostDetailsPage;
