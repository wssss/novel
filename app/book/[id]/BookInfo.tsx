'use client';

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { wordCountFormat } from '@/lib/utils';

interface BookInfoProps {
  book: {
    id: string;
    bookName: string;
    picUrl: string;
    authorName: string;
    categoryName: string;
    bookStatus: number;
    visitCount: number;
    wordCount: number;
    bookDesc: string;
    firstChapterId: string;
  };
}

export default function BookInfo({ book }: BookInfoProps) {
  const {
    id,
    bookName,
    picUrl,
    authorName,
    categoryName,
    bookStatus,
    visitCount,
    wordCount,
    bookDesc,
    firstChapterId,
  } = book;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex gap-6">
        {/* 书籍封面 */}
        <div className="flex-shrink-0">
          {/* <Image
            alt={bookName}
            width={200}
            height={266}
            className="rounded-lg object-cover"
            priority
          /> */}
        </div>

        {/* 书籍信息 */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{bookName}</h1>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">作者：</span>
              <span>{authorName}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-500">分类：</span>
              <Badge variant="secondary">{categoryName}</Badge>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-gray-500">状态：</span>
                <Badge variant={bookStatus === 0 ? "default" : "success"}>
                  {bookStatus === 0 ? '连载中' : '已完结'}
                </Badge>
              </div>
              
              <div>
                <span className="text-gray-500">字数：</span>
                <span>{wordCountFormat(wordCount)}字</span>
              </div>

              <div>
                <span className="text-gray-500">阅读量：</span>
                <span>{wordCountFormat(visitCount)}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button 
                size="lg"
                asChild
              >
                <a href={`/book/${id}/chapter/${firstChapterId}`}>
                  开始阅读
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                asChild
              >
                <a href={`/chapter-list/${id}`}>
                  查看目录
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 书籍简介 */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">作品简介</h2>
        <div 
          className="text-gray-600 leading-relaxed"
          style={{ 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word' 
          }}
        >
          {bookDesc}
        </div>
      </div>
    </div>
  );
}
