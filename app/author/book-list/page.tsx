import Link from "next/link"
import Image from "next/image"
import { dateFormat, wordCountFormat } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAuthorBooks } from "@/lib/data"
import { auth } from "@clerk/nextjs/server"
import { Pagination } from "@/components/ui/pagination"

export default async function AuthorBooksPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("未授权访问")
  }

  const page = await Number(searchParams.page) || 1
  const pageSize = 10
  
  const { books, total } = await getAuthorBooks(userId, page, pageSize)

  return (
    <div className="w-full">
      {total === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
          <p className="text-muted-foreground">您还没有发布作品</p>
          <Button asChild>
            <Link href="/author/book-add">创建作品</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">小说列表</h2>
            <Button asChild>
              <Link href="/author/book-add">发布小说</Link>
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">书名</TableHead>
                  <TableHead className="text-center">分类</TableHead>
                  <TableHead className="text-center">点击量</TableHead>
                  <TableHead className="text-center">昨日订阅数</TableHead>
                  <TableHead className="text-center">更新时间</TableHead>
                  <TableHead className="text-center">总字数</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books?.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative h-[70px] w-[50px]">
                         
                        </div>
                        <span>{book.bookName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{book.categoryName}</TableCell>
                    <TableCell className="text-center">{book.visitCount}</TableCell>
                    <TableCell className="text-center">0</TableCell>
                    <TableCell className="text-center">
                      { dateFormat('YYYY-MM-DD HH:mm:ss', new Date(book.updateTime)) } 更新
                    </TableCell>
                    <TableCell className="text-center">
                      {wordCountFormat(book.wordCount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="default"
                        size="sm"
                        
                      >
                        章节管理
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* <div className="flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / pageSize)}
            />
          </div> */}
        </div>
      )}
    </div>
  )
}
