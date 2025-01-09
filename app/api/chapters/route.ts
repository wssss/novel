import { getChapterListById } from '@/lib/data'
import { NextRequest } from 'next/server'

export async function GETChapterList(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams 
  const bookId = searchParams.get('bookId')
  const page = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('pageSize')) || 10

  if (!bookId) {
    return Response.json({ error: 'Book ID is required' }, { status: 400 })
  }

  try {
    const data = await getChapterListById(bookId, page, pageSize)
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch chapters' }, { status: 500 })
  }
}