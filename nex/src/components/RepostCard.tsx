"use client";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { getPosts, getReposts } from "@/actions/post.action";
import PostCard from "./PostCard";
import DeleteCited from "./DeleteCited";

// Tipos de los posts y reposts
type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

type Reposts = Awaited<ReturnType<typeof getReposts>>;
type Repost = Reposts[number];

function RepostCard({
  post,
  repost,
  dbUserId,
}: {
  post: Post;
  repost: Repost;
  dbUserId: string | null;
}) {
  const repostText =
    dbUserId === repost.user.id
      ? "Has compartido esto"
      : `${repost.user.name} ha compartido esto`;

  // Lógica para el texto del h1
  const repostId = repost.id;

  if (!repost.content && !repost.image)
    return (
      <>
        <PostCard
          key={repost.id}
          post={post}
          dbUserId={dbUserId}
          text={repostText}
          direction={repostId}
        />
      </>
    );

  return (
    <Card className="overflow-hidden border-l-0 border-r-0 border-t border-b-0 rounded-none shadow-none">
      {dbUserId === repost.user.id && (
        <div className="flex justify-end items-center px-2 pt-2">
          <DeleteCited key={post.id} post={post} />
        </div>
      )}

      <CardContent
        className={dbUserId === repost.user.id ? "pb-4 sm:pb-6" : "p-4 sm:p-6"}
      >
        <div className="space-y-4">
          <div>
            <div className="flex space-x-2">
              <Link href={`/profile/${repost.user.username}`}>
                <Avatar className="w-12 h-12 border-4 border-transparent">
                  <AvatarImage src={repost.user.image ?? "/avatar.png"} />
                </Avatar>
              </Link>

              <div
                className={`flex-1 min-w-0 px-1 ${
                  repost.content ? "" : "flex items-center mb-2"
                } `}
              >
                <div className="text-sm text-muted-foreground">
                  <div className="flex flex-row items-center space-x-2">
                    <Link
                      className="text-primary font-semibold truncate"
                      href={`/profile/${repost.user.username}`}
                    >
                      <p className="text-primary font-semibold truncate">
                          {repost.user.name}
                        </p>
                    </Link>

                    <Link
                      className="text-muted-foreground truncate"
                      href={`/profile/${repost.user.username}`}
                    >
                      @{repost.user.name}
                    </Link>
                    <span>•</span>

                    <Link
                      href={`/repost/${repost.id}`}
                      className="flex-grow"
                    >
                      <span className="truncate first-letter:uppercase">
                        {formatDistanceToNowStrict(new Date(repost.createdAt), {
                          locale: es,
                        })}
                      </span>
                    </Link>
                  </div>
                </div>

                <Link href={`/repost/${repost.id}`}>
                  <div>
                    <p className="mt-2 text-sm text-primary break-words">
                      {repost.content}
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Imagen de la publicación */}
            {repost.image && (
              <Link href={`/repost/${repost.id}`}>
                <Card className="ml-14 rounded-lg overflow-hidden mt-4 shadow-none">
                  <img
                    src={repost.image || "/placeholder.svg"}
                    alt="Contenido de la publicación"
                    className="w-full h-auto object-cover max-h-[400px]"
                  />
                </Card>
              </Link>
            )}

            <Card className="ml-14 mt-4 shadow-none">
              <div>
                <div className="flex space-x-1 py-4 px-2">
                  <Link href={`/profile/${repost.post.author?.username}`}>
                    <Avatar className="w-8 h-8 border-4 border-transparent">
                      <AvatarImage
                        src={repost.post.author?.image ?? "/avatar.png"}
                      />
                    </Avatar>
                  </Link>

                  <div
                    className={`flex-1 min-w-0 px-1 ${
                      repost.post.content ? "" : "flex items-center"
                    } `}
                  >
                    <div className="text-sm text-muted-foreground w-full">
                      <div className="flex flex-row items-center space-x-2">
                        <Link
                          className="text-primary font-semibold truncate"
                          href={`/profile/${repost.post.author?.username}`}
                        >
                          <p className="text-primary font-semibold truncate">
                          {repost.post.author?.name}
                        </p>
                          
                        </Link>

                        <Link
                          className="text-muted-foreground truncate"
                          href={`/profile/${repost.post.author?.username}`}
                        >
                          @{repost.post.author?.username}
                        </Link>
                        <span>•</span>

                        <Link
                          href={`/post/${repost.post.id}`}
                          className="flex-grow"
                        >
                          <span className="truncate first-letter:uppercase">
                            {formatDistanceToNowStrict(
                              new Date(repost.post.createdAt),
                              {
                                locale: es,
                              }
                            )}
                          </span>
                        </Link>
                      </div>
                    </div>

                    <Link href={`/post/${repost.post.id}`} className="block">
                      <div>
                        <p className="mt-2 text-sm text-primary break-words">
                          {repost.post.content}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Imagen de la publicación */}
                {repost.post.image && (
                  <Link href={`/post/${repost.post.id}`} className="block">
                    <Card
                      className={`rounded-b-lg rounded-t-none overflow-hidden shadow-none ${
                        repost.post.content ? "mt-2" : ""
                      } `}
                    >
                      <img
                        src={repost.post.image || "/placeholder.svg"}
                        alt="Contenido de la publicación"
                        className="w-full h-auto object-cover max-h-[300px]"
                      />
                    </Card>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RepostCard;
