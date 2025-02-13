"use client";

import {
  getProfileByUsername,
  getUserPosts,
  getUserRepostedPosts,
} from "@/actions/profile.action";
import { toggleFollow } from "@/actions/user.action";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { SignInButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  EditIcon,
  LinkIcon,
  MapPinIcon,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tranquiluxe, Zenitho } from "uvcanvas";
import EditAlertDialog from "@/components/EditAlertDialog";
import FollowButton from "@/components/FollowButton";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;

interface ProfilePageClientProps {
  user: NonNullable<User>;

  isFollowing: boolean;
}

function ProfilePageClient({
  isFollowing: initialIsFollowing,
  user,
}: ProfilePageClientProps) {
  const { user: currentUser } = useUser();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const isOwnProfile =
    currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;

  const formattedDate =
    format(new Date(user.createdAt), "MMMM 'de' yyyy", { locale: es })
      .charAt(0)
      .toUpperCase() +
    format(new Date(user.createdAt), "MMMM 'de' yyyy", { locale: es }).slice(1);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <Card className="border-b-0 border-l-0 border-t border-r-0 overflow-hidden shadow-none rounded-none">
            {/* Header */}
            <div className="h-28 overflow-hidden bg-secondary/25 flex justify-center items-center">
              <Tranquiluxe />
            </div>

            <CardContent className="relative pt-0">
              <div className="flex flex-col">
                <Avatar className="w-16 h-16 lg:h-24 lg:w-24 border-8 border-background absolute -top-8 lg:-top-12 left-4">
                  <AvatarImage src={user.image ?? "/avatar.png"} />
                </Avatar>

                {/* Boton de editar o seguir*/}
                <div className="flex justify-end mt-4">
                  {!currentUser ? (
                    <SignInButton mode="modal">
                      <Button className="rounded-full font-bold">Seguir</Button>
                    </SignInButton>
                  ) : isOwnProfile ? (
                    <Button
                      variant="secondary"
                      className="rounded-full text-sm"
                      size="sm"
                      onClick={() => setShowEditDialog(true)}
                    >
                      Editar perfil
                    </Button>
                  ) : (
                    <FollowButton
                      userId={user.id}
                      isFollowing={initialIsFollowing}
                    />
                  )}
                </div>

                {/* Informacion del usuario */}
                <div className="mt-6">
                  <h1 className="text-xl font-semibold text-primary flex flex-row gap-2 items-center">
                    {user.name ?? user.username}
                    {user.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID && (
                      <BadgeCheck
                        fill="rgb(217 70 239"
                        className="text-primary font-semibold"
                        size={20}
                      />
                    )}
                  </h1>

                  <p className="text-muted-foreground text-sm mt-2">
                    @{user.username}
                  </p>
                  <p className="mt-1 text-sm tetx-muted-foreground">
                    {user.bio}
                  </p>

                  {/* Datos de ubicacion membresia y website */}
                  <div className="mt-4 space-y-1 text-sm ">
                    {user.location && (
                      <div className="flex items-center text-muted-foreground gap-2">
                        <MapPinIcon size={16} />
                        {user.location}
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-center gap-2  text-muted-foreground">
                        <LinkIcon size={16} />
                        <a
                          href={
                            user.website.startsWith("http")
                              ? user.website
                              : `https://${user.website}`
                          }
                          className="text-muted-foreground hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {user.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon size={16} />
                      Se unió en {formattedDate}
                    </div>
                  </div>

                  {/* Following, Followers, Posts */}
                  <div className="flex mt-4 space-x-4">
                    <div>
                      <span className="font-semibold">
                        {user._count.following.toLocaleString()}
                      </span>{" "}
                      <span className="text-sm text-muted-foreground">
                        Siguiendo
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">
                        {user._count.followers.toLocaleString()}
                      </span>{" "}
                      <span className="text-sm text-muted-foreground">
                        Seguidores
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">
                        {user._count.posts.toLocaleString()}
                      </span>{" "}
                      <span className="text-sm text-muted-foreground">
                        Publicaciones
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog para editar el perfil */}
        <EditAlertDialog
          user={user}
          isOpen={showEditDialog}
          setIsOpen={setShowEditDialog}
        />
      </div>
    </div>
  );
}

export default ProfilePageClient;
