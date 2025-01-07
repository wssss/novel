'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type Theme = 'normal' | 'eyecare' | 'dark';

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
  },
  dark: {
    background: 'bg-gray-900',
    content: 'bg-gray-800',
    text: 'text-gray-100'
  }
};

interface ChapterData {
  chapterInfo: {
    id: string;
    chapterName: string;
    chapterNum: number;
    chapterWordCount: number;
    bookId: string;
    chapterUpdateTime: string;
  };
  bookInfo: {
    bookName: string;
    authorName: string;
    categoryName: string;
  };
  bookContent: string;
}

export default function BookContent({ data }: { data: ChapterData }) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('normal');
  const [fontSize, setFontSize] = useState<number>(16);

  // 处理主题切换
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // 处理字体大小调整
  const handleFontSize = (delta: number) => {
    setFontSize(prev => Math.min(Math.max(prev + delta, 12), 24));
  };

  // 处理章节导航
  const handleChapterNav = (direction: 'prev' | 'next') => {
    const currentNum = data.chapterInfo.chapterNum;
    const targetNum = direction === 'prev' ? currentNum - 1 : currentNum + 1;
    router.push(`/book/${data.chapterInfo.bookId}/${targetNum}`);
  };

  return (
    <div className={`${themes[theme].background} min-h-screen`}>
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-lg font-semibold">{data.bookInfo.bookName}</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleThemeChange('normal')}
              className={`px-3 py-1 rounded ${theme === 'normal' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              默认
            </button>
            <button 
              onClick={() => handleThemeChange('eyecare')}
              className={`px-3 py-1 rounded ${theme === 'eyecare' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              护眼
            </button>
            <button 
              onClick={() => handleThemeChange('dark')}
              className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              夜间
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容区 */}
      <main className={`container mx-auto px-4 py-8 ${themes[theme].content}`}>
        {/* 章节标题 */}
        <div className="mb-8 text-center">
          <h2 className={`text-2xl font-bold ${themes[theme].text}`}>
            {data.chapterInfo.chapterName}
          </h2>
          <p className={`mt-2 text-sm ${themes[theme].text} opacity-75`}>
            字数：{data.chapterInfo.chapterWordCount}
          </p>
        </div>

        {/* 正文内容 */}
        <div 
          className={`max-w-3xl mx-auto leading-relaxed ${themes[theme].text}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {data.bookContent.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-justify">
              {paragraph}
            </p>
          ))}
        </div>

        {/* 底部导航 */}
        <div className="mt-12 flex items-center justify-between max-w-3xl mx-auto">
          <button
            onClick={() => handleChapterNav('prev')}
            className="flex items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            disabled={data.chapterInfo.chapterNum <= 1}
          >
            {/* <ChevronLeftIcon className="w-5 h-5 mr-1" /> */}
            上一章
          </button>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleFontSize(-2)}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              A-
            </button>
            <button 
              onClick={() => handleFontSize(2)}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              A+
            </button>
          </div>
          <button
            onClick={() => handleChapterNav('next')}
            className="flex items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            下一章
            {/* <ChevronRightIcon className="w-5 h-5 ml-1" /> */}
          </button>
        </div>
      </main>
    </div>
  );
}