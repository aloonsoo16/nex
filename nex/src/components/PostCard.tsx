"use client";

import { deletePost, type getPosts } from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import { Button } from "./ui/button";
import { Heart, Repeat2 } from "lucide-react";
import RepostDialog from "./RepostDialog";
import FavoriteButton from "./FavoriteButton";
import CommentsButton from "./CommentsButton";
import CommentsSection from "./CommentsSection";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({
  post,
  dbUserId,
  text,
  direction,
}: {
  post: Post;
  dbUserId: string | null;
  text: string | null;
  direction: string | null;
}) {
  const { user } = useUser();

  const [isDeleting, setIsDeleting] = useState(false);
  const [optimisticLikes] = useState(post._count.likes);
  const [optimisticReposts] = useState(post._count.reposts);
  const [showComments, setShowComments] = useState(false);

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result.success) toast.success("Publicación eliminada");
      else throw new Error(result.error);
    } catch (error) {
      toast.error("Error al eliminar la publicación");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Card
        className={`overflow-hidden border-l-0 border-r-0 border-t border-b-0 rounded-none shadow-none`}
      >
        {dbUserId === post.author.id && (
          <div className="flex justify-end items-center bg-red- px-2 pt-2">
            <DeleteAlertDialog
              isDeleting={isDeleting}
              onDelete={handleDeletePost}
            />
          </div>
        )}
        <CardContent
          className={
            dbUserId === post.author.id ? "pb-4 sm:pb-6" : "p-4 sm:p-6"
          }
        >
          {text && (
            <div
              className={`flex items-center gap-1 text-xs text-muted-foreground font-semibold px-2 ${
                post.content ? "pb-4" : "pb-3"
              } `}
            >
              <Repeat2 size={16} />
              <span>{text}</span>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <div className="flex space-x-2 icentertems-">
                <Link href={`/profile/${post.author.username}`}>
                  <Avatar className="w-12 h-12 border-4 border-transparent">
                    <AvatarImage src={post.author.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>

                <div
                  className={`flex-1 min-w-0 px-1 ${
                    post.content ? "" : "flex items-center"
                  } `}
                >
                  <div className="text-sm text-muted-foreground">
                    <div className="flex flex-row items-center space-x-2">
                      <Link href={`/profile/${post.author.username}`} className="truncate">
                        <p className="text-primary font-semibold truncate">
                          {post.author.name}
                        </p>
                      </Link>

                      <Link
                        className="text-muted-foreground truncate"
                        href={`/profile/${post.author.username}`}
                      >
                        @{post.author.username}
                      </Link>
                      <span>•</span>

                      <Link
                        href={
                          direction
                            ? `/repost/${direction}`
                            : `/post/${post.id}`
                        }
                        className="flex-grow"
                      >
                        <span className="truncate first-letter:uppercase">
                          {formatDistanceToNowStrict(new Date(post.createdAt), {
                            locale: es,
                          })}
                        </span>
                      </Link>
                    </div>
                  </div>
                  <Link
                    href={
                      direction ? `/repost/${direction}` : `/post/${post.id}`
                    }
                  >
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
                <Link
                  href={direction ? `/repost/${direction}` : `/post/${post.id}`}
                >
                  <Card
                    className={`ml-14 rounded-lg overflow-hidden shadow-none ${
                      post.content ? "mt-4" : "mt-2"
                    } `}
                  >
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Contenido de la publicación"
                      className="w-full h-auto object-cover max-h-[400px]"
                    />
                  </Card>
                </Link>
              )}
            </div>

            {/* Botones de like y comentario */}
            <div className="flex gap-2 ml-14">
              {user ? (
                <>
                  <FavoriteButton post={post} dbUserId={dbUserId} />

                  <RepostDialog post={post} dbUserId={dbUserId} />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground rounded-full flex justify-start p-2 hover:bg-pink-500/10 hover:text-pink-500"
                    >
                      <Heart size={20} />
                      <span>{optimisticLikes}</span>
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground rounded-full flex justify-start p-2 hover:bg-green-500/10 hover:text-green-500"
                    >
                      <Repeat2 size={20} />
                      <span>{optimisticReposts}</span>
                    </Button>
                  </SignInButton>
                </>
              )}

              <CommentsButton
                post={post}
                showComments={showComments}
                setShowComments={setShowComments}
              />
            </div>
            <CommentsSection
              post={post}
              dbUserId={dbUserId}
              showComments={showComments}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default PostCard;
