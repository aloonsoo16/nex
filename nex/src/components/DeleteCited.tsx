"use client";

import { type getPosts, deleteRepost } from "@/actions/post.action";
import { useState } from "react";
import { toast } from "sonner";
import { Loader, Trash2Icon, TrashIcon, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function DeleteCited({
  post,
  title = "¿Quieres eliminar este citado?",
  description = "Esta acción es irreversible",
}: {
  post: Post;
  title?: string;
  description?: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deleteRepost(post.id);
      if (result.success) toast.success("Citado eliminado");
      else throw new Error(result.error);
    } catch (error) {
      toast.error("Error al eliminar el citado");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground  rounded-full flex justify-start p-2"
        >
          {isDeleting ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <Ellipsis size={20} />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full shadow-none">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeletePost}
            className="bg-red-500/10 text-red-500 hover:tex-red-500 hover:bg-red-600/10 shadow-none
          mr-2 rounded-full font-semibold"
            disabled={isDeleting}
          >
            {isDeleting ? "" : "Eliminar citado"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default DeleteCited;
