"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Header from "@/components/common/Header"

interface Book {
  id: number
  bookName: string
  categoryName: string
  lastChapterName: string
  authorName: string
  wordCount: number
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BookRank() {
  const [books, setBooks] = useState<Book[]>([])
  const [rankType, setRankType] = useState("visit_rank")
  const [rankName, setRankName] = useState("点击榜")

  // 获取排行榜数据
  const fetchRankData = async (type: string) => {
    try {
      const res = await fetch(`${baseURL}/front/book/${type}`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const { data } = await res.json()
      if (!Array.isArray(data)) {
        throw new Error('返回数据格式错误')
      }
      setBooks(data)
    } catch (error) {
      console.error("获取排行榜数据失败:", error)
      setBooks([]) // 发生错误时清空数据
    }
  }

  // 格式化字数
  const formatWordCount = (count: number) => {
    if (count > 10000) {
      return Math.floor(count / 10000) + "万"
    }
    if (count > 1000) {
      return Math.floor(count / 1000) + "千"
    }
    return count
  }

  // 切换排行榜类型
  const handleRankChange = (value: string) => {
    setRankType(value)
    switch (value) {
      case "visit_rank":
        setRankName("点击榜")
        break
      case "newest_rank":
        setRankName("新书榜")
        break
      case "update_rank":
        setRankName("更新榜")
        break
    }
    fetchRankData(value)
  }

  useEffect(() => {
    fetchRankData("visit_rank")
  }, [])

  return (
    <>
      <Header />
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{rankName}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">排名</TableHead>
                      <TableHead>类别</TableHead>
                      <TableHead>书名</TableHead>
                      <TableHead>最新章节</TableHead>
                      <TableHead>作者</TableHead>
                      <TableHead>字数</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book, index) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          <span className={`rank-${index + 1}`}>{index + 1}</span>
                        </TableCell>
                        <TableCell>{book.categoryName}</TableCell>
                        <TableCell>
                          <a href={`/book/${book.id}`}>{book.bookName}</a>
                        </TableCell>
                        <TableCell>{book.lastChapterName}</TableCell>
                        <TableCell>{book.authorName}</TableCell>
                        <TableCell>{formatWordCount(book.wordCount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>排行榜</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={rankType} onValueChange={handleRankChange}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="visit_rank">点击榜</TabsTrigger>
                    <TabsTrigger value="newest_rank">新书榜</TabsTrigger>
                    <TabsTrigger value="update_rank">更新榜</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
