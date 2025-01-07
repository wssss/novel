import { Suspense } from 'react';
import BookInfo from './BookInfo';
import ChapterSection from './ChapterSection';
import CommentSection from './CommentSection';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { getBookDetail, getChapterAbout, getComments } from '@/lib/data';

// 转换为异步服务器组件
export default async function BookDetail({ params }: PageProps) {
  // 等待 params 解析完成
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  // 在服务器端并行获取所需数据
  const [book, chapterAbout, comments] = await Promise.all([
    getBookDetail(id),
    getChapterAbout(id),
    getComments(id),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading book info...</div>}>
          <BookInfo book={book} />
        </Suspense>

        <Suspense fallback={<div>Loading chapter info...</div>}>
          <ChapterSection 
            chapterAbout={chapterAbout} 
            bookId={id} 
          />
        </Suspense>

        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentSection 
            initialComments={comments}
            bookId={id}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}