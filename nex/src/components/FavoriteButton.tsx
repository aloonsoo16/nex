"use client";

import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { toggleLike, type getPosts } from "@/actions/post.action";
import { useState } from "react";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function FavoriteButton({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string | null;
}) {
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );

  const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes);
  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptmisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptmisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`text-muted-foreground rounded-full flex justify-start p-2 hover:bg-pink-500/10  ${
        hasLiked ? "text-pink-500 hover:text-pink-600" : "hover:text-pink-500"
      }`}
      onClick={handleLike}
    >
      {hasLiked ? (
        <Heart className="fill-current" size={20} />
      ) : (
        <Heart size={20} />
      )}
      <span>{optimisticLikes}</span>
    </Button>
  );
}

export default FavoriteButton;
