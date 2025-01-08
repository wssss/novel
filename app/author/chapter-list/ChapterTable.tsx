'use client'

import { useState } from 'react'
import { deleteChapter } from '@/lib/actions'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Chapter {
  id: string
  chapterName: string
  chapterUpdateTime: string
  isVip: number
}

interface ChapterTableProps {
  initialChapters: Chapter[]
  initialTotal: number
  bookId: string
}

export default function ChapterTable({ 
  initialChapters, 
  initialTotal, 
  bookId 
}: ChapterTableProps) {
  const [chapters, setChapters] = useState(initialChapters)
  const [total, setTotal] = useState(initialTotal)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const fetchChapters = async (page: number) => {
    try {
      const response = await fetch(
        `/api/chapters?bookId=${bookId}&page=${page}&pageSize=${pageSize}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch')
      }
      const data = await response.json()
      setChapters(data.list)
      setTotal(data.total)
    } catch (err) {
      toast({
        title: '获取章节列表失败',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteChapter(id)
      if (result.success) {
        toast({ title: '删除成功' })
        await fetchChapters(currentPage)
      } else {
        toast({
          title: '删除失败',
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: '删除失败',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="bg-white rounded shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-6 py-3 text-left">章节名称</th>
            <th className="px-6 py-3 text-left">更新时间</th>
            <th className="px-6 py-3 text-left">状态</th>
            <th className="px-6 py-3 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((chapter) => (
            <tr key={chapter.id} className="border-b">
              <td className="px-6 py-4">{chapter.chapterName}</td>
              {/* <td className="px-6 py-4">{chapter.chapterUpdateTime}</td> */}
              <td className="px-6 py-4">{chapter.isVip ? '付费' : '免费'}</td>
              <td className="px-6 py-4 space-x-2">
                <Link 
                  href={`/author/chapter-edit?id=${chapter.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(chapter.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="py-4 flex justify-center">
        <nav className="flex items-center gap-2">
          {Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => (
            <button
              key={i + 1}
              onClick={async () => {
                setCurrentPage(i + 1)
                await fetchChapters(i + 1)
              }}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}