"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" 
import { ImageUpload } from "@/components/image-upload"
import { useAuth } from "@clerk/nextjs"

interface Category {
  id: number
  name: string
}

export default function BookAdd() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const user = useAuth()

  
  const [book, setBook] = useState({
    workDirection: "0", // 0-男频 1-女频
    categoryId: "",
    categoryName: "",
    bookName: "",
    picUrl: "",
    bookDesc: "",
  })

  // 加载分类列表
  const loadCategories = async (workDirection: string) => {
    try {
      const response = await fetch(`/api/books?workDirection=${workDirection}`)
      const data = await response.json()
      setCategories(data)
      if (data.length > 0) {
        setBook(prev => ({
          ...prev,
          categoryId: data[0].id.toString(),
          categoryName: data[0].name
        }))
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "获取分类列表失败"
      })
    }
  }



  // 处理表单提交
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!book.bookName) {
      return toast({
        variant: "destructive",
        description: "请输入书名"
      })
    }
    if (!book.picUrl) {
      return toast({
        variant: "destructive",
        description: "请上传封面"
      })
    }
    if (!book.bookDesc) {
      return toast({
        variant: "destructive",
        description: "请输入简介"
      })
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/author/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      })

      if (!response.ok) {
        throw new Error("提交失败")
      }

      toast({
        description: "小说创建成功"
      })
      router.push("/author/books")
    } catch (error) {
      toast({
        variant: "destructive",
        description: "提交失败，请重试"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">小说基本信息填写</h3>
        <p className="text-sm text-muted-foreground">
          请填写您要发布的小说信息
        </p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">作品方向</label>
            <Select
              value={book.workDirection}
              onValueChange={(value) => {
                setBook(prev => ({ ...prev, workDirection: value }))
                loadCategories(value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择作品方向" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">男频</SelectItem>
                <SelectItem value="1">女频</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">分类</label>
            <Select
              value={book.categoryId}
              onValueChange={(value) => {
                const category = categories.find(c => c.id.toString() === value)
                setBook(prev => ({
                  ...prev,
                  categoryId: value,
                  categoryName: category?.name || ""
                }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">小说名</label>
            <Input
              value={book.bookName}
              onChange={(e) => setBook(prev => ({ ...prev, bookName: e.target.value }))}
              placeholder="请输入小说名称"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">小说封面</label>
            <ImageUpload
              value={book.picUrl}
              onChange={(url) => setBook(prev => ({ ...prev, picUrl: url }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">小说介绍</label>
            <Textarea
              value={book.bookDesc}
              onChange={(e) => setBook(prev => ({ ...prev, bookDesc: e.target.value }))}
              placeholder="请输入小说简介"
              rows={5}
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "提交中..." : "提交"}
        </Button>
      </form>
    </div>
  )
}
