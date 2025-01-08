import Link from 'next/link'
import ChapterTable from './ChapterTable'
import { getChapterListById } from '@/lib/data'

export default async function ChapterList({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const bookId = await searchParams.id
  let chapters = []
  let total = 0

  if (bookId) {
    const data = await getChapterListById(bookId, 1, 10)
    chapters = data.list
    console.log(chapters)
    total = data.total
  }

  return (
    <div>
      {/* <AuthorHeader /> */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex">
          {/* 左侧导航 */}
          <div className="w-48 mr-8">
            <ul>
              <li>
                <Link 
                  href="/author/books"
                  className="block py-2 px-4 hover:bg-gray-100 rounded"
                >
                  小说管理
                </Link>
              </li>
            </ul>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1">
            {total === 0 ? (
              <div className="text-center py-20">
                <Link
                  href={`/author/chapter-add?id=${bookId}`}
                  className="inline-block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  章节发布
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">章节列表</h2>
                  <Link
                    href={`/author/chapter-add?id=${bookId}`}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    新建章节
                  </Link>
                </div>

                <ChapterTable 
                  initialChapters={chapters}
                  initialTotal={total}
                  bookId={bookId}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
