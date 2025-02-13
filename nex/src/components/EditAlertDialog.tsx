"use client";

import { getProfileByUsername, updateProfile } from "@/actions/profile.action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useMobile from "@/hooks/use-mobile";
import { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;

interface EditAlertDialogProps {
  user: User;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function EditAlertDialog({ user, isOpen, setIsOpen }: EditAlertDialogProps) {
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  });

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await updateProfile(formData);
      if (result.success) {
        setIsOpen(false); // Cerramos el diálogo al guardar
        toast.success("Perfil actualizado con éxito");
      } else {
        toast.error("Hubo un error al actualizar el perfil");
      }
    } catch (error) {
      toast.error("Error en la actualización del perfil");
      console.error(error);
    }
  };

  const maxBioLength = 100;

  const handleChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxBioLength) {
      setEditForm({ ...editForm, bio: e.target.value });
    }
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxNameLength) {
      setEditForm({ ...editForm, name: e.target.value });
    }
  };

  const maxNameLength = 30;
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <div className="max-w-3xl">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            side="bottom"
            className="h-[100dvh] max-h-[100dvh] overflow-y-auto scrollbar-hide hover:scrollbar-default scrollbar-thin scrollbar-thumb-buttonColor"
          >
            <SheetHeader>
              <SheetTitle className="text-base">Editar perfil</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2 text-sm">
                <Label>Nombre</Label>
                <Input
                  name="name"
                  value={editForm.name}
                  className="text-sm"
                  onChange={handleChangeName}
                  placeholder="Tu nombre"
                />
              </div>
              <div
                className={`text-right text-xs mt-1 ${
                  editForm.name.length >= maxNameLength
                    ? "text-fuchsia-500"
                    : "text-muted-foreground"
                }`}
              >
                {editForm.name.length} / {maxNameLength}
              </div>

              <div className="space-y-2 text-sm">
                <Label>Descripción</Label>
                <Textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleChangeBio}
                  className="min-h-[100px] text-sm"
                  placeholder="Cuenta algo sobre ti"
                />
              </div>
              <div
                className={`text-right text-xs mt-1 ${
                  editForm.bio.length >= maxBioLength
                    ? "text-fuchsia-500"
                    : "text-muted-foreground"
                }`}
              >
                {editForm.bio.length} / {maxBioLength}
              </div>
              <div className="space-y-2 text-sm">
                <Label>Localización</Label>
                <Input
                  name="location"
                  className="text-sm"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  placeholder="¿Dónde vives?"
                />
              </div>
              <div className="space-y-2 text-sm">
                <Label>Sitio web</Label>
                <Input
                  name="website"
                  value={editForm.website}
                  className="text-sm"
                  onChange={(e) =>
                    setEditForm({ ...editForm, website: e.target.value })
                  }
                  placeholder="Enlace a tu sitio web sin prefijos (www, htttps...)"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <SheetClose asChild>
                <Button
                  className="text-sm text-primary rounded-full"
                  size="sm"
                  variant="outline"
                >
                  Cancelar
                </Button>
              </SheetClose>
              <Button
                className="text-sm text-secondary rounded-full"
                size="sm"
                onClick={handleEditSubmit}
              >
                Guardar
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full rounded-lg max-h-[600px] lg:max-h-[800px] h-auto  overflow-y-auto scrollbar-hide hover:scrollbar-default scrollbar-thin scrollbar-thumb-buttonColor">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2 text-sm">
              <Label>Nombre</Label>
              <Input
                name="name"
                value={editForm.name}
                className="text-sm"
                onChange={handleChangeName}
                placeholder="Tu nombre"
              />
            </div>
            <div
              className={`text-right text-xs mt-1 ${
                editForm.name.length >= maxNameLength
                  ? "text-fuchsia-500"
                  : "text-muted-foreground"
              }`}
            >
              {editForm.name.length} / {maxNameLength}
            </div>

            <div className="space-y-2 text-sm">
              <Label>Descripción</Label>
              <Textarea
                name="bio"
                value={editForm.bio}
                onChange={handleChangeBio}
                className="min-h-[100px] text-sm"
                placeholder="Cuenta algo sobre ti"
              />
            </div>
            <div
              className={`text-right text-xs mt-1 ${
                editForm.bio.length >= maxBioLength
                  ? "text-fuchsia-500"
                  : "text-muted-foreground"
              }`}
            >
              {editForm.bio.length} / {maxBioLength}
            </div>
            <div className="space-y-2 text-sm">
              <Label>Localización</Label>
              <Input
                name="location"
                className="text-sm"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                placeholder="¿Dónde vives?"
              />
            </div>
            <div className="space-y-2 text-sm">
              <Label>Sitio web</Label>
              <Input
                name="website"
                value={editForm.website}
                className="text-sm"
                onChange={(e) =>
                  setEditForm({ ...editForm, website: e.target.value })
                }
                placeholder="Enlace a tu sitio web sin prefijos (www, htttps...)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button
                className="text-sm text-primary rounded-full"
                size="sm"
                variant="outline"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="text-sm text-secondary rounded-full"
              size="sm"
              onClick={handleEditSubmit}
            >
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditAlertDialog;
