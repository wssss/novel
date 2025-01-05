'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";



const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 添加护眼模式的颜色主题配置
const themes = {
  normal: {
    background: 'bg-gray-50',
    content: 'bg-white',
    text: 'text-gray-900'
  },
  eyecare: {
    background: 'bg-green-50',
    content: 'bg-green-50',
    text: 'text-gray-800'
  }
};

export default function BookContent({ params }: { params: Promise<{ id: string; chapterId: string }> }) {
  const { id, chapterId } = use(params);
  const router = useRouter();
  const [data, setData] = useState<ChapterData | null>(null);
  const [theme, setTheme] = useState<'normal' | 'eyecare'>('normal');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/front/book/content/${chapterId}`);
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Failed to fetch chapter content:', error);
      }
    };

    fetchData();

    // 键盘事件监听
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!data?.chapterInfo.bookId) return;
      
      if (e.keyCode === 37) { // 左箭头
        await handlePreChapter(data.chapterInfo.bookId);
      } else if (e.keyCode === 39) { // 右箭头
        await handleNextChapter(data.chapterInfo.bookId);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [chapterId]);

  // 切换护眼模式
  const toggleTheme = () => {
    const newTheme = theme === 'normal' ? 'eyecare' : 'normal';
    setTheme(newTheme);
    localStorage.setItem('reading-theme', newTheme);
  };

  // 在组件加载时读取保存的主题设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('reading-theme') as 'normal' | 'eyecare';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleChapterList = (bookId: string) => {
    router.push(`/chapter-list/${bookId}`);
  };

  const handleBookDetail = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const handlePreChapter = async (bookId: string) => {
    try {
      const response = await fetch(`${baseURL}/front/book/pre-chapter/${chapterId}`);
      const result = await response.json();
      if (result.data) {
        router.push(`/book/${bookId}/${result.data}`);
      } else {
        alert('已经是第一章了！');
      }
    } catch (error) {
      console.error('Failed to fetch previous chapter:', error);
    }
  };

  const handleNextChapter = async (bookId: string) => {
    try {
      const response = await fetch(`${baseURL}/front/book/next_chapter_id/${chapterId}`);
      const result = await response.json();
      if (result.data) {
        router.push(`/book/${bookId}/${result.data}`);
      } else {
        alert('已经是最后一章了！');
      }
    } catch (error) {
      console.error('Failed to fetch next chapter:', error);
    }
  };

  return (
    <div className={`min-h-screen ${themes[theme].background}`}>
      <main className="container mx-auto px-4 py-8">
        {data && (
          <div className={`${themes[theme].content} rounded-lg shadow-md p-6`}>
            <div className="text-center mb-8 relative">
              <button
                className="absolute -right-20 top-1 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                onClick={toggleTheme}
              >
                {theme === 'normal' ? '护眼' : '正常'}
              </button>
              
              <h1 className="text-2xl font-bold mb-4">{data.chapterInfo.chapterName}</h1>
              <div className="text-sm text-gray-600">
                类别：{data.bookInfo.categoryName} 作者：{data.bookInfo.authorName}
                <span className="ml-4">字数：{data.chapterInfo.chapterWordCount}</span>
                <span className="ml-4">更新时间：{data.chapterInfo.chapterUpdateTime}</span>
              </div>
            </div>

            <div className="mb-8">
              <div 
                className={`prose max-w-none ${themes[theme].text}`}
                style={{ whiteSpace: 'break-spaces' }}
                dangerouslySetInnerHTML={{ __html: data.bookContent }}
              />
            </div>

            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => handlePreChapter(data.chapterInfo.bookId)}
              >
                上一章
              </button>
              <button
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => handleChapterList(data.chapterInfo.bookId)}
              >
                目录
              </button>
              <button
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => handleNextChapter(data.chapterInfo.bookId)}
              >
                下一章
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
