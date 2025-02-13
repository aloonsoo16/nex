"use client";
import { Button } from "./ui/button";
import { MessageCircleIcon } from "lucide-react";
import { getPosts, createComment, deleteComment } from "@/actions/post.action";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteComment } from "./DeleteComment";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { Loader, Image } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { Card } from "./ui/card";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function CommentsSection({
  post,
  dbUserId,
  showComments,
}: {
  post: Post;
  dbUserId: string | null;
  showComments: boolean;
}) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment, imageUrl);
      if (result?.success) {
        toast.success("Comentario publicado");
        setNewComment("");
      }
    } catch (error) {
      toast.error("Error al publicar el comentario");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deleteComment(commentId);
      if (result.success) toast.success("Comentario eliminado");
      else throw new Error(result.error);
    } catch (error) {
      toast.error("Error al eliminar el comentario");
    } finally {
      setIsDeleting(false);
    }
  };

  const maxLength = 200;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setNewComment(e.target.value);
    }
  };

  if (!showComments) return null;

  return (
    <div className="space-y-4">
      {user ? (
        <div className="flex space-x-3 border-t py-4">
          <Avatar className="w-10 h-10 border-4 border-transparent">
            <AvatarImage src={user?.imageUrl || "/avatar.png"} />
          </Avatar>

          <div className="flex-1">
            <div className="text-muted-foreground text-sm my-2">
              Respondiendo a{" "}
              <span className="text-sm font-medium text-fuchsia-500">
                @{post.author.username}
              </span>
            </div>
            <Textarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={handleChange}
              disabled={false}
              rows={1}
              style={{ minHeight: "40px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
              className="h-auto overflow-hidden resize-none border-none focus-visible:ring-0 placeholder:text-muted-foreground shadow-none px-0 text-sm"
            />

            <div
              className={`text-right text-xs my-2 pr-2 pb-2  ${
                newComment.length >= maxLength
                  ? "text-fuchsia-500"
                  : "text-muted-foreground"
              }`}
            >
              {newComment.length} / {maxLength}
              {(showImageUpload || imageUrl) && (
                <div className="py-4 px-0">
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
            <div className="flex items-center justify-end gap-2 pt-4">
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

              <Button
                size="sm"
                onClick={handleAddComment}
                className="flex items-center rounded-full text-sm font-semibold disabled:bg-secondary disabled:text-primary"
                disabled={(!newComment.trim() && !imageUrl) || isCommenting}
              >
                {isCommenting ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                  </>
                ) : (
                  <>Responder</>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center p-4 rounded-lg">
          <SignInButton mode="modal">
            <Button
              variant="default"
              className="gap-2 rounded-full text-secondary text-sm"
            >
              Inicia sesión para comentar
            </Button>
          </SignInButton>
        </div>
      )}
      <div className="space-y-4">
        {/* Mostrar comentarios */}
        {post.comments.map((comment) => (
          <div
            key={comment.id}
            className="flex space-x-2 pl-4 py-4 pr-2 rounded-lg bg-secondary/25"
          >
            <Link
              href={`/profile/${comment.author.username}`}
              className="text-primary font-semibold"
            >
              <Avatar className="w-10 h-10 border-4 border-transparent">
                <AvatarImage src={comment.author.image ?? "/avatar.png"} />
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0 px-1">
              <div className="text-sm text-muted-foreground w-full">
                <div className="flex flex-row items-center space-x-2 min-w-0 w-full">
                  {/* Nombre del autor con truncado */}
                  <Link
                    href={`/profile/${comment.author.username}`}
                    className="min-w-0 max-w-full"
                  >
                    <p className="text-primary font-semibold truncate w-full">
                      {comment.author.name}
                    </p>
                  </Link>

                  {/* Username del autor con truncado */}
                  <Link
                    href={`/profile/${comment.author.username}`}
                    className="min-w-0 max-w-full"
                  >
                    <p className="text-muted-foreground truncate w-full">
                      @{comment.author.username}
                    </p>
                  </Link>

                  {/* Separador */}
                  <span>•</span>

                  {/* Fecha con truncado */}
                  <span className="truncate first-letter:uppercase min-w-0 max-w-full">
                    {formatDistanceToNowStrict(new Date(comment.createdAt), {
                      locale: es,
                    })}
                  </span>

                  {/* Botón de eliminar alineado correctamente */}
                  <div className="flex justify-end items-center flex-shrink-0">
                    {dbUserId === comment.author.id && (
                      <DeleteComment
                        isDeleting={isDeleting}
                        onDelete={() => handleDeleteComment(comment.id)}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="mt-2 text-sm text-primary break-words">
                  {comment.content}
                </p>
                <div className="mt-2 text-sm text-primary break-words">
                  {comment.image && (
                    <Card className="rounded-lg overflow-hidden shadow-none border-none mt-4 mr-14 ">
                      <img
                        src={comment.image || "/placeholder.svg"}
                        alt="Contenido de la publicación"
                        className="w-full h-auto object-cover max-h-[300px]"
                      />
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentsSection;
