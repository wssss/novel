"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function Feedback() {
  const [content, setContent] = useState("")
  const router = useRouter()

  const handleSubmit = async () => {
    if (!content) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "反馈内容不能为空！"
      })
      return
    }

    if (content.length < 10) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "反馈内容不能少于 10 个字符！"
      })
      return
    }

    try {
      const response = await fetch("/api/user/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("提交失败")
      }

      setContent("")
      toast({
        title: "成功",
        description: "提交成功！",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "提交失败，请稍后重试"
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>反馈留言</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请说明情况，并留下联系方式，你可以在个人中心【我的反馈】里查看回复~"
              className="min-h-[150px]"
            />
            <Button 
              onClick={handleSubmit}
              className="w-full"
              size="lg"
            >
              提交
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
