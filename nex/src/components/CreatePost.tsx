"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader, Image, SendIcon } from "lucide-react";
import { createPost } from "@/actions/post.action";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        // Resetear el formulario
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);

        toast.success("Publicación creada con éxito");
      }
    } catch (error) {
      console.error("Error al crear la publicación", error);
      toast.error("Error al crear la publicación");
    } finally {
      setIsPosting(false);
    }
  };

  const maxLength = 200;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setContent(e.target.value);
    }
  };

  return (
    <Card className="shadow-none border-none  rounded-none">
      <CardContent className="pt-8 lg:pt-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div>
              <Avatar className="w-12 h-12 border-4 border-transparent">
                <AvatarImage src={user?.imageUrl || "/avatar.png"} />
              </Avatar>
            </div>

            <Textarea
              placeholder="¿Qué está pasando?"
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
            <div className="p-4">
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
          <div className="flex items-center justify-between pt-4">
            <div className="flex space-x-2">
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
                <Image  size={20} />
              </Button>
            </div>
            <Button
              className="flex items-center rounded-full text-sm font-semibold disabled:bg-secondary disabled:text-primary"
              size="sm"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader className="animate-spin" size={20} />
                </>
              ) : (
                <>Publicar</>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePost;
