"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { UploadIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

function ImageUpload({ endpoint, onChange, value }: ImageUploadProps) {
  if (value) {
    return (
      <div className="relative size-60 object-cover ">
        <img
          src={value}
          alt="Imagen subida"
          className="rounded-lg size-60 object-cover"
        />
        <Button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 m-1 size-8 rounded-full text-secondary font-semibold bg-primary/80 hover:bg-primary"
          variant="default"
        >
          <XIcon size={20} />
        </Button>
      </div>
    );
  }

  return (
    <UploadDropzone
      className="ut-label:text-sm ut-label:font-semibold ut-label:text-muted-foreground ut-allowed-content:text-xs ut-allowed-content:text-muted-foreground ut-allowed-content:font-semibold gap-2 ut-upload-icon:hidden"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
      appearance={{
        button:
          "bg-primary text-sm text-secondary font-semibold rounded-full  ut-ready:text-sm  ut-ready:rounded-full ut-ready:font-semibold ut-ready:text-secondary  ut-uploading:bg-secondary ut-uploading:rounded-full ut-uploading:font-semibold ut-uploading:text-primary ut-uploading:text-sm ut-complete:bg-red-500 ut-complete:text-primary",
        container: "border-none",
      }}
      content={{
        // Personalizar la etiqueta según el estado
        label: "Arrastra o haz clic para subir una imagen",
        allowedContent: "Solo 1 imagen hasta 4MB",

        button: (args) => {
          let buttonText = "Seleccionar";
          if (args.isUploading) {
            const progress = Math.round(args.uploadProgress);
            buttonText = `${progress}%`;
          } else if (args.files.length > 0) {
            buttonText = "Subir imagen";
          }

          return buttonText;
        },
      }}
    />
  );
}

export default ImageUpload;
