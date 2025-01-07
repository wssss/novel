import { getChapterContent } from '@/lib/data';
import BookContent from './BookContent';
import Footer from "@/components/common/Footer";
import { notFound } from 'next/navigation';

export default async function BookContentPage({ 
  params 
}: { 
  params: { id: string; chapterId: string } 
}) {
  try {
    // 确保 params 是有效的
    const { chapterId } = await params;

    const data = await getChapterContent(chapterId);
    
    if (!data) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <BookContent data={data} />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    // 如果是章节不存在的错误，返回 404 页面
    console.error('Error loading chapter:', error);
    notFound();
  }
}
