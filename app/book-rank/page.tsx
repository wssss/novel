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
import { getRankBooks } from "@/lib/data"

export default async function BookRank({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const rankType = String(searchParams.type || 'visit_rank');
  const books = await getRankBooks(rankType);
  
  const rankName = {
    'visit_rank': '点击榜',
    'newest_rank': '新书榜',
    'update_rank': '更新榜'
  }[rankType];

  const formatWordCount = (count: number) => {
    if (count > 10000) {
      return Math.floor(count / 10000) + "万"
    }
    if (count > 1000) {
      return Math.floor(count / 1000) + "千"
    }
    return count
  }

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
                    {books.map((book: Book, index: number) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          <span className={`rank-${index + 1}`}>{index + 1}</span>
                        </TableCell>
                        <TableCell>{book.category}</TableCell>
                        <TableCell>
                          <a href={`/book/${book.id}`}>{book.title}</a>
                        </TableCell>
                        <TableCell>{book.lastChapterName}</TableCell>
                        <TableCell>{book.author}</TableCell>
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
                <Tabs defaultValue={rankType}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="visit_rank" asChild>
                      <a href="?type=visit_rank">点击榜</a>
                    </TabsTrigger>
                    <TabsTrigger value="newest_rank" asChild>
                      <a href="?type=newest_rank">新书榜</a>
                    </TabsTrigger>
                    <TabsTrigger value="update_rank" asChild>
                      <a href="?type=update_rank">更新榜</a>
                    </TabsTrigger>
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
