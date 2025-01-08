import { getBookCategories, getBookList } from '@/lib/data';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const workDirection = Number(searchParams.get('workDirection')) || 0;
      const categories = await getBookCategories(workDirection);
      console.log(categories)
      return NextResponse.json(categories ); // 确保返回空数组而不是 undefined
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { categories: [] }, // 错误时返回空数组
        { status: 500 }
      );
    }
  }

export async function POST(request: Request) {
  try {
    const searchParams = await request.json();
    
    const books = await getBookList({
      pageSize: searchParams.pageSize || 10,
      pageNum: searchParams.pageNum || 1,
      workDirection: searchParams.workDirection,
      categoryId: searchParams.categoryId,
      bookStatus: searchParams.bookStatus,
      wordCountMin: searchParams.wordCountMin,
      wordCountMax: searchParams.wordCountMax
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '获取书籍列表失败' },
      { status: 500 }
    );
  }
}

import { getChapterListById } from '@/lib/data'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
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