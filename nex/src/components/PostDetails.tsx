"use client";

import { deletePost, type getPosts } from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import RepostDialog from "./RepostDialog";
import type React from "react";
import { Repeat2 } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import CommentsSection from "./CommentsSection";
import CommentsButton from "./CommentsButton";
import FollowButton from "./FollowButton";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostDetails({
  post,
  dbUserId,
  text,
  isFollowing: initialIsFollowing,
}: {
  post: Post;
  dbUserId: string | null;
  text: string | null;
  isFollowing: boolean;
}) {
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [optimisticReposts] = useState(post._count.reposts);
  const [optimisticLikes] = useState(post._count.likes);
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

  const formattedDate =
    format(new Date(post.createdAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", {
      locale: es,
    })
      .charAt(0)
      .toUpperCase() +
    format(new Date(post.createdAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", {
      locale: es,
    }).slice(1);

  return (
    <div>
      <Card className="overflow-hidden border-none rounded-none shadow-none">
        <CardContent className="p-4 sm:p-6">
          {text && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold px-2 pb-3">
              <Repeat2 size={16} />
              <span>{text}</span>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <div className="flex  space-x-2">
                <Link href={`/profile/${post.author.username}`}>
                  <Avatar className="w-12 h-12 border-4 border-transparent">
                    <AvatarImage src={post.author.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>

                <div className="min-w-0 text-sm flex-1">
                  <div className="flex justify-between items-center h-full w-full">
                    <div className="flex flex-col items-start min-w-0">
                      <Link
                        className="text-primary font-semibold truncate w-full"
                        href={`/profile/${post.author.username}`}
                      >
                        {post.author.name}
                      </Link>

                      <Link
                        className="text-muted-foreground truncate w-full"
                        href={`/profile/${post.author.username}`}
                      >
                        @{post.author.username}
                      </Link>
                    </div>

                    {post.author.id !== dbUserId && (
                      <FollowButton
                        userId={post.author.id}
                        isFollowing={initialIsFollowing}
                      />
                    )}
                  </div>
                </div>
              </div>

              <Link href={`/post/${post.id}`} className="block">
                <div className="py-2 px-1">
                  <p className="mt-2 text-sm text-primary break-words">
                    {post.content}
                  </p>
                </div>
              </Link>

              {post.image && (
                <Link href={`/post/${post.id}`} className="block">
                  <Card
                    className={`rounded-lg overflow-hidden shadow-none mb-2 ${
                      post.content ? "mt-4" : ""
                    } `}
                  >
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Contenido de la publicación"
                      className="w-full h-auto object-cover max-h-[500px]"
                    />
                  </Card>
                </Link>
              )}

              <div className="flex flex-row items-center gap-1">
                <Link href={`/post/${post.id}`} className="block">
                  <span className="truncate text-sm text-muted-foreground px-1 hover:underline">
                    {formattedDate}
                  </span>
                  <span className="truncate text-sm text-muted-foreground px-1 hover:underline">
                    -
                  </span>
                </Link>
                <p className="text-sm text-muted-foreground">Nex</p>
              </div>
            </div>

            {/* Post actions */}
            <div className="flex gap-2">
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
                      className="text-muted-foreground rounded-full flex justify-start p-2 hover:bg-red-500/10 hover:text-red-500"
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
                showComments={true}
                setShowComments={setShowComments}
              />
              {dbUserId === post.author.id && (
                <DeleteAlertDialog
                  isDeleting={isDeleting}
                  onDelete={handleDeletePost}
                />
              )}
            </div>

            <CommentsSection
              key={post.id}
              post={post}
              dbUserId={dbUserId}
              showComments={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostDetails;
