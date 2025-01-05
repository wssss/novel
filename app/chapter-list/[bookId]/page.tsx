'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";


interface PageProps {
  params: Promise<{ bookId: string }>;
}


const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function ChapterList({ params }: PageProps) {
  const { bookId } = use(params);
  const router = useRouter();
  
  const [book, setBook] = useState<Book | null>(null);
  const [chapterList, setChapterList] = useState<Chapter[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取书籍信息
        const bookData = await fetch(`${baseURL}/front/book/${bookId}`);
        setBook((await bookData.json()).data);

        // 获取章节列表
        const chaptersData = await fetch(
          `${baseURL}/front/book/chapter/list?bookId=${bookId}`
        );
        setChapterList((await chaptersData.json()).data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [bookId]);

  const handleChapterClick = (bookId: string, chapterId: string) => {
    router.push(`/book/${bookId}/${chapterId}`);
  };

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
                <button
                  className="w-full text-left px-4 py-2"
                  onClick={() => handleChapterClick(bookId, chapter.id)}
                >
                  <span className="text-gray-700">{chapter.chapterName}</span>
                  <span className={`ml-2 text-sm ${chapter.isVip === 1 ? 'text-red-500' : 'text-green-500'}`}>
                    [{chapter.isVip === 1 ? '收费' : '免费'}]
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
