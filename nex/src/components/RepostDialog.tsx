"use client";

import {
  type getPosts,
  toggleRepost,
  createRepost,
  deleteRepost,
} from "@/actions/post.action";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNowStrict, format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "./ui/button";
import { Loader, Repeat2, Repeat } from "lucide-react";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageUpload from "./ImageUpload";
import { Image } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useMobile from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "./ui/sheet";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function RepostDialog({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string | null;
}) {
  const { user } = useUser();
  const [isReposting, setIsReposting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasReposted, sethasReposted] = useState(
    post.reposts.some((repost) => repost.userId === dbUserId)
  );

  const [optimisticReposts, setOptimisticReposts] = useState(
    post._count.reposts
  );
  const [showRepostDialog, setShowRepostDialog] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const isMobile = useMobile();

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    try {
      setIsPosting(true);
      const result = await createRepost(post.id, content, imageUrl);
      if (result?.success) {
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        setShowRepostDialog(false);
        sethasReposted((prev) => !prev);
        setOptimisticReposts((prev) => prev + (hasReposted ? -1 : 1));
        toast.success("Citado creado");
      } else {
        throw new Error(result?.error || "Error al crear citado");
      }
    } catch (error) {
      console.error("Error al crear citado", error);
      toast.error("Error al crear citado");
    } finally {
      setIsPosting(false);
    }
  };

  const handleCitePost = async () => {
    if (hasReposted) {
      try {
        await deleteRepost(post.id);
        toast.success("Citado eliminado");
      } catch (error) {
        console.error("Error al eliminar el citado:", error);
      }
    } else {
      setShowRepostDialog(true);
      setIsDropdownOpen(false);
    }
  };

  const handleRepost = async () => {
    if (isReposting) return;

    try {
      setIsReposting(true);
      const result = await toggleRepost(post.id);

      if (result.success) {
        sethasReposted((prev) => !prev);
        setOptimisticReposts((prev) => prev + (hasReposted ? -1 : 1));

        if (hasReposted) {
          toast.success("Ya no estás compartiendo la publicación");
        } else {
          toast.success("Publicación compartida");
        }
      } else {
        throw new Error(result.error || "Error al dar o quitar compartido");
      }
    } catch (error) {
      console.error("Error al dar o quitar compartido", error);
      if (hasReposted) {
        toast.error("Error al quitar compartido");
      } else {
        toast.error("Error al compartir la publicación");
      }
      setOptimisticReposts(post._count.reposts);
      sethasReposted(post.reposts.some((repost) => repost.userId === dbUserId));
    } finally {
      setIsReposting(false);
    }
  };

  const maxLength = 200;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setContent(e.target.value);
    }
  };

  const DropdownMenuComponent = () => (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger
        asChild
        className="outline-none focus:ring-2 focus:ring-transparent"
      >
        <Button
          variant="ghost"
          size="sm"
          className={`text-muted-foreground rounded-full flex justify-start p-2 hover:bg-green-500/10 w-full ${
            hasReposted
              ? "text-green-500 hover:text-green-600"
              : "hover:text-green-500"
          }`}
        >
          {hasReposted ? (
            <Repeat2 className="text-green-500" size={20} />
          ) : (
            <Repeat2 size={20} />
          )}
          <span>{optimisticReposts}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          className="text-muted-foreground cursor-pointer flex justify-start p-2 w-full"
          onClick={handleRepost}
        >
          <Repeat2 size={20} />
          {hasReposted ? (
            <span>Eliminar compartido</span>
          ) : (
            <span>Compartir</span>
          )}
        </DropdownMenuItem>

        {!hasReposted && (
          <DropdownMenuItem
            className="text-muted-foreground cursor-pointer flex justify-start p-2 w-full"
            onClick={handleCitePost}
          >
            <Repeat size={20} />
            <span>Citar</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isMobile) {
    return (
      <div>
        <DropdownMenuComponent />
        <Sheet open={showRepostDialog} onOpenChange={setShowRepostDialog}>
          <SheetContent
            side="bottom"
            className="h-[100dvh] max-h-[100dvh] overflow-y-auto scrollbar-hide hover:scrollbar-default scrollbar-thin scrollbar-thumb-buttonColor"
          >
            <SheetHeader>
              <SheetTitle className="text-base">Citar publicación</SheetTitle>
            </SheetHeader>
            <>
              <Card className="shadow-none border-none rounded-none">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div>
                        <Avatar className="w-12 h-12 border-4 border-transparent">
                          <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                        </Avatar>
                      </div>

                      <Textarea
                        placeholder="¿Qué quieres opinar?"
                        className="h-auto overflow-hidden py-4 px-0 resize-none border-none focus-visible:ring-0 text-sm shadow-none"
                        value={content}
                        onChange={handleChange}
                        disabled={false}
                        rows={1}
                        style={{ minHeight: "40px" }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = "auto";
                          target.style.height = target.scrollHeight + "px";
                        }}
                      />
                    </div>

                    <div
                      className={`text-right text-xs mt-1 ${
                        content.length >= maxLength
                          ? "text-fuchsia-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {content.length} / {maxLength}
                    </div>

                    {(showImageUpload || imageUrl) && (
                      <div className="p-4 ml-6">
                        <ImageUpload
                          endpoint="postImage"
                          value={imageUrl}
                          onChange={(url) => {
                            setImageUrl(url);
                            if (!url) setShowImageUpload(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="ml-14 mt-4 shadow-none">
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
                              {formatDistanceToNowStrict(
                                new Date(post.createdAt),
                                {
                                  locale: es,
                                }
                              )}
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

              <div
                className={`flex justify-between items-center gap-3 ${
                  isMobile ? "pt-4" : "pt-0"
                }`}
              >
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`text-muted-foreground rounded-full text-fuchsia-500 hover:bg-fuchsia-500/10 hover:text-fuchsia-500 ${
                      showImageUpload ? "bg-fuchsia-500/10" : ""
                    }`}
                    onClick={() => setShowImageUpload(!showImageUpload)}
                    disabled={isPosting}
                  >
                    <Image size={20} />
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  {isMobile ? (
                    <SheetClose asChild>
                      <Button
                        className="text-sm text-primary rounded-full shadow-none"
                        variant="outline"
                        size="sm"
                      >
                        Cancelar
                      </Button>
                    </SheetClose>
                  ) : (
                    <DialogClose asChild>
                      <Button
                        className="text-sm text-primary rounded-full shadow-none"
                        variant="outline"
                        size="sm"
                      >
                        Cancelar
                      </Button>
                    </DialogClose>
                  )}
                  <Button
                    className="flex items-center rounded-full text-sm font-semibold disabled:bg-secondary disabled:text-primary"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={(!content.trim() && !imageUrl) || isPosting}
                  >
                    {isPosting ? (
                      <Loader className="animate-spin" size={20} />
                    ) : (
                      <>Publicar</>
                    )}
                  </Button>
                </div>
              </div>
            </>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div>
      <DropdownMenuComponent />
      <Dialog
        open={showRepostDialog}
        onOpenChange={(open) => setShowRepostDialog(open)}
      >
        <DialogContent className="lg:w-full w-auto rounded-lg max-h-[700px]  h-auto  overflow-y-auto scrollbar-hide hover:scrollbar-default scrollbar-thin scrollbar-thumb-buttonColor">
          <DialogHeader>
            <DialogTitle>Citar publicación</DialogTitle>
          </DialogHeader>
          <>
            <Card className="shadow-none border-none rounded-none">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div>
                      <Avatar className="w-12 h-12 border-4 border-transparent">
                        <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                      </Avatar>
                    </div>

                    <Textarea
                      placeholder="¿Qué quieres opinar?"
                      className="h-auto overflow-hidden py-4 px-0 resize-none border-none focus-visible:ring-0 shadow-none text-sm"
                      value={content}
                      onChange={handleChange}
                      disabled={false}
                      rows={1}
                      style={{ minHeight: "40px" }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = target.scrollHeight + "px";
                      }}
                    />
                  </div>

                  <div
                    className={`text-right text-xs mt-1 ${
                      content.length >= maxLength
                        ? "text-fuchsia-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {content.length} / {maxLength}
                  </div>

                  {(showImageUpload || imageUrl) && (
                    <div className="p-4 ml-6">
                      <ImageUpload
                        endpoint="postImage"
                        value={imageUrl}
                        onChange={(url) => {
                          setImageUrl(url);
                          if (!url) setShowImageUpload(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="ml-14 mt-4 shadow-none">
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
                            {formatDistanceToNowStrict(
                              new Date(post.createdAt),
                              {
                                locale: es,
                              }
                            )}
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

            <div
              className={`flex justify-between items-center gap-3 ${
                isMobile ? "pt-4" : "pt-0"
              }`}
            >
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`text-muted-foreground rounded-full text-fuchsia-500 hover:bg-fuchsia-500/10 hover:text-fuchsia-500 ${
                    showImageUpload ? "bg-fuchsia-500/10" : ""
                  }`}
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  disabled={isPosting}
                >
                  <Image size={20} />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                {isMobile ? (
                  <SheetClose asChild>
                    <Button
                      className="text-sm text-primary rounded-full shadow-none"
                      variant="outline"
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </SheetClose>
                ) : (
                  <DialogClose asChild>
                    <Button
                      className="text-sm text-primary rounded-full shadow-none"
                      variant="outline"
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                )}
                <Button
                  className="flex items-center rounded-full text-sm font-semibold disabled:bg-secondary disabled:text-primary"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={(!content.trim() && !imageUrl) || isPosting}
                >
                  {isPosting ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <>Publicar</>
                  )}
                </Button>
              </div>
            </div>
          </>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default RepostDialog;
