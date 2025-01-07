import { getBookDetail } from '@/lib/data';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { getChapterList } from '@/lib/data';

interface PageProps {
  params: { bookId: string };
}

export default async function ChapterList({ params }: PageProps) {
  const { bookId } = await params;
  
  // 直接从后端获取数据
  const book = await getBookDetail(bookId);
  const chapterList = await getChapterList(bookId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 书籍信息 */}
        {book && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">{book.bookName}</h1>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-gray-600">
              <div>
                作者：
                <span className="text-blue-600 hover:underline cursor-pointer">
                  {book.authorName}
                </span>
              </div>
              <div>类别：{book.categoryName}</div>
              <div>
                状态：
                <span className="text-gray-900">
                  {book.bookStatus === 0 ? "连载中" : "已完结"}
                </span>
              </div>
              <div>
                总点击：
                <span className="text-gray-900">{book.visitCount}</span>
              </div>
              <div>
                总字数：
                <span className="text-gray-900">{book.wordCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* 章节列表 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-6">
            正文({chapterList.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {chapterList.map((chapter) => (
              <div 
                key={chapter.id}
                className="hover:bg-gray-50 rounded-md transition-colors"
              >
                <a
                  href={`/book/${bookId}/${chapter.id}`}
                  className="block w-full text-left px-4 py-2"
                >
                  <span className="text-gray-700">{chapter.chapterName}</span>
                  <span className={`ml-2 text-sm ${chapter.isVip === 1 ? 'text-red-500' : 'text-green-500'}`}>
                    [{chapter.isVip === 1 ? '收费' : '免费'}]
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
