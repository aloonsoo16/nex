"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { toggleFollow } from "@/actions/user.action";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

function FollowButton({
  userId,
  isFollowing: initialIsFollowing,
}: {
  userId: string;
  isFollowing: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const { isSignedIn } = useAuth();
  const handleFollow = async () => {
    try {
      setIsUpdatingFollow(true);
      setIsLoading(true);
      await toggleFollow(userId);
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error("Error al actualizar estado de seguimiento");
    } finally {
      setIsUpdatingFollow(false);
      setIsLoading(false);
    }
  };
  const { user } = useUser();
  const currentUserId = user?.id;

  if (userId === currentUserId) {
    return null;
  }

  return (
    <>
      {!isSignedIn ? (
        <SignInButton mode="modal">
          <Button
            size="sm"
            variant="default"
            className="rounded-full text-sm font-bold"
          >
            Seguir
          </Button>
        </SignInButton>
      ) : (
        <Button
          className="rounded-full font-bold text-sm"
          size="sm"
          onClick={handleFollow}
          disabled={isUpdatingFollow}
          variant={isFollowing ? "outline" : "default"}
        >
          {isLoading ? (
            <Loader className="animate-spin" size={20} />
          ) : isFollowing ? (
            "Siguiendo"
          ) : (
            "Seguir"
          )}
        </Button>
      )}
    </>
  );
}

export default FollowButton;
