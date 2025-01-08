'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

interface Chapter {
  chapterName: string
  chapterContent: string 
  isVip: number
}

export default function ChapterUpdate() {
  const searchParams = useSearchParams()
  const chapterId = searchParams.get('id')
  
  const [chapter, setChapter] = useState<Chapter>({
    chapterName: '',
    chapterContent: '',
    isVip: 0
  })

  useEffect(() => {
    // 加载章节数据
    const loadChapter = async () => {
      try {
        const res = await fetch(`/api/author/chapters/${chapterId}`)
        const data = await res.json()
        setChapter(data)
      } catch (err) {
        toast({
          title: '加载章节数据失败',
          variant: 'destructive',
        })
      }
    }

    if (chapterId) {
      loadChapter()
    }
  }, [chapterId])

  const handleSubmit = async () => {
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
      await fetch(`/api/author/chapters/${chapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chapter)
      })
      toast({
        title: '更新成功！',
      })
    } catch (err) {
      toast({
        title: '更新失败',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">小说章节内容填写</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-bold">章节名：</label>
            <input
              type="text"
              value={chapter.chapterName}
              onChange={(e) => setChapter({...chapter, chapterName: e.target.value})}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold">章节内容：</label>
            <textarea 
              value={chapter.chapterContent}
              onChange={(e) => setChapter({...chapter, chapterContent: e.target.value})}
              rows={15}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold">是否收费：</label>
            <div className="space-x-4">
              <label>
                <input
                  type="radio"
                  checked={chapter.isVip === 0}
                  onChange={() => setChapter({...chapter, isVip: 0})}
                /> 免费
              </label>
              <label>
                <input
                  type="radio" 
                  checked={chapter.isVip === 1}
                  onChange={() => setChapter({...chapter, isVip: 1})}
                /> 收费
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            提交
          </button>
        </div>
      </div>
    </div>
  )
}
