"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from '@/hooks/use-toast';
import { ImageIcon, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  accept?: string
  maxSize?: number
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
  className,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async (file: File) => {
    try {
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "错误",
          description: `文件大小不能超过${maxSize / 1024 / 1024}MB`,
        })
        return
      }

      setIsLoading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("上传失败")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "上传失败，请重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative h-[178px] w-[178px] overflow-hidden rounded-md border">
        {value ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_IMG_URL}${value}`}
            alt="Upload"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="secondary"
        disabled={isLoading}
        className="relative"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "上传封面"
        )}
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleUpload(file)
            }
          }}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </Button>
    </div>
  )
}