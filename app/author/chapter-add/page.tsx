'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

interface ChapterForm {
  chapterName: string
  chapterContent: string
  isVip: number
}

export default function ChapterAdd() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookId = searchParams.get('id')

  const [chapter, setChapter] = useState<ChapterForm>({
    chapterName: '',
    chapterContent: '',
    isVip: 0
  })

  const saveChapter = async () => {
    if (!chapter.chapterName) {
      toast({
        title: '章节名不能为空！',
        variant: 'destructive',
      })
      return
    }
    if (!chapter.chapterContent) {
      toast({
        title: '章节内容不能为空！',
        variant: 'destructive',
      })
      return
    }
    if (chapter.chapterContent.length < 50) {
      toast({
        title: '章节内容太少！',
        variant: 'destructive',
      })
      return
    }

    try {
      const res = await fetch(`/api/author/book/${bookId}/chapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chapter)
      })
      
      if (res.ok) {
        router.push(`/author/chapter-list?id=${bookId}`)
      }
    } catch (error) {
      toast({
        title: '保存失败',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <h3 className="text-xl font-normal text-center mb-6">小说章节内容填写</h3>
      
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="block font-bold mb-2">章节名：</label>
          <input
            type="text"
            value={chapter.chapterName}
            onChange={(e) => setChapter({...chapter, chapterName: e.target.value})}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">章节内容：</label>
          <textarea
            value={chapter.chapterContent}
            onChange={(e) => setChapter({...chapter, chapterContent: e.target.value})}
            rows={15}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-6">
          <label className="block font-bold mb-2">是否收费：</label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={chapter.isVip === 0}
                onChange={() => setChapter({...chapter, isVip: 0})}
                className="mr-2"
              />
              <span>免费</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={chapter.isVip === 1}
                onChange={() => setChapter({...chapter, isVip: 1})}
                className="mr-2"
              />
              <span>收费</span>
            </label>
          </div>
        </div>

        <button
          onClick={saveChapter}
          className="w-full bg-[#f80] text-white py-3 rounded-md hover:bg-[#ff9933]"
        >
          提交
        </button>
      </div>
    </div>
  )
}
