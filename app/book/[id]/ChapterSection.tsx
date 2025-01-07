'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { dateFormat } from '@/lib/utils';

interface ChapterAbout {
  firstChapterId: string;
  lastChapterId: string;
  lastChapterName: string;
  lastChapterUpdateTime: string;
  chapterTotal: number;
}

interface ChapterSectionProps {
  chapterAbout: ChapterAbout;
  bookId: string;
}

export default function ChapterSection({ chapterAbout, bookId }: ChapterSectionProps) {
  const {
    firstChapterId,
    lastChapterId,
    lastChapterName,
    lastChapterUpdateTime,
    chapterTotal
  } = chapterAbout;

  return (
    <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">目录</h2>
        <span className="text-sm text-gray-500">
          共 {chapterTotal} 章
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">最新章节：{lastChapterName}</p>
            <p className="text-sm text-gray-500">
              {/* 更新时间：{dateFormat(lastChapterUpdateTime)} */}
            </p>
          </div>
          <div className="space-x-4">
            <Link href={`/book/${bookId}/chapter/${firstChapterId}`}>
              <Button variant="outline">开始阅读</Button>
            </Link>
            <Link href={`/book/${bookId}/chapter/${lastChapterId}`}>
              <Button>最新章节</Button>
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Link 
            href={`/chapter-list/${bookId}`}
            className="text-blue-600 hover:text-blue-800"
          >
            查看完整目录 →
          </Link>
        </div>
      </div>
    </div>
  );
}
