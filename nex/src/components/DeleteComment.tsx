"use client";

import { Loader, Ellipsis } from "lucide-react";
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

interface DeleteCommentProps {
  isDeleting: boolean;
  onDelete: () => Promise<void>;
  title?: string;
  description?: string;
}

export function DeleteComment({
  isDeleting,
  onDelete,
  title = "¿Quieres eliminar este comentario?",
  description = "Esta acción es irreversible.",
}: DeleteCommentProps) {
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
            onClick={onDelete}
            className="bg-red-500/10 text-red-500 hover:tex-red-500 hover:bg-red-600/10 shadow-none
          mr-2 rounded-full font-semibold"
            disabled={isDeleting}
          >
            {isDeleting ? "" : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
