"use client";

import { Dialog, DialogContent } from "./ui/dialog";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { Button } from "./ui/button";
import { Feather } from "lucide-react";
import useMobile from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "./ui/sheet";

function CreatePostDialog() {
  const [showRepostDialog, setShowRepostDialog] = useState(false);
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <>
        <Button
          variant="default"
          className="flex items-center rounded-full"
          onClick={() => setShowRepostDialog(true)}
        >
          <Feather className="w-4 h-4" />
          <span className="hidden lg:inline font-semibold">Publicar</span>
        </Button>
        <Sheet open={showRepostDialog} onOpenChange={setShowRepostDialog}>
          <SheetContent
            side="bottom"
            className="h-[100dvh] max-h-[100dvh] overflow-y-auto scrollbar-hide hover:scrollbar-default scrollbar-thin scrollbar-thumb-buttonColor px-0"
          >
            <CreatePost />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <>
      <Button
        variant="default"
        className="flex items-center rounded-full"
        onClick={() => setShowRepostDialog(true)}
      >
        <Feather className="w-4 h-4" />
        <span className="hidden lg:inline font-semibold">Publicar</span>
      </Button>
      <Dialog open={showRepostDialog} onOpenChange={setShowRepostDialog}>
        <DialogContent className="w-full rounded-lg max-h-[600px] lg:max-h-[800px] h-auto overflow-y-auto scrollbar-hide hover:scrollbar-default scrollbar-thin scrollbar-thumb-buttonColor">
          <CreatePost />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreatePostDialog;
