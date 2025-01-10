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
      workDirection: searchParams.workDirection || 0,
      categoryId: searchParams.categoryId,
      bookStatus: searchParams.bookStatus,
      wordCountMin: searchParams.wordCountMin,
      wordCountMax: searchParams.wordCountMax,
      keyword: searchParams.keyword
    });

    return NextResponse.json({
      list: books.list,
      total: books.total,
      pageNum: searchParams.pageNum || 1,
      pageSize: searchParams.pageSize || 10
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10,
        error: '获取书籍列表失败' 
      },
      { status: 500 }
    );
  }
}

