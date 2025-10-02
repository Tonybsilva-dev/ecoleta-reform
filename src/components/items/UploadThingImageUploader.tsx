"use client";

import { UploadButton } from "@uploadthing/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function UploadThingImageUploader({ value, onChange, max = 5 }: Props) {
  const [_isUploading, setIsUploading] = useState(false);

  return (
    <div className="space-y-3">
      <UploadButton<OurFileRouter>
        endpoint="itemImage"
        onUploadBegin={() => setIsUploading(true)}
        onClientUploadComplete={(res) => {
          const urls = res?.map((f) => f.url).filter(Boolean) as string[];
          const next = [...value, ...urls].slice(0, max);
          onChange(next);
          setIsUploading(false);
          toast.success(`${urls.length} imagem(ns) enviada(s)`);
        }}
        onUploadError={(e) => {
          setIsUploading(false);
          toast.error(e.message || "Falha no upload");
        }}
        appearance={{
          button:
            "ut-ready:bg-green-600 ut-uploading:bg-green-400 text-white px-4 py-2 rounded-md",
        }}
      />

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {value.map((url, i) => (
            <div key={url} className="relative">
              <Image
                src={url}
                alt={`Imagem ${i + 1}`}
                width={300}
                height={200}
                className="h-32 w-full rounded object-cover"
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute top-2 right-2 rounded bg-red-500 px-2 py-1 text-white text-xs"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
