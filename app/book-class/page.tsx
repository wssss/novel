'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomPagination } from "@/components/common/custom-pagination";
import { Book, Category, SearchCondition } from '@/types/book';
import { dateFormat, addDay } from '@/lib/utils';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BookClass() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [bookCategories, setBookCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [searchCondition, setSearchCondition] = useState<SearchCondition>({
    pageSize: 10,
    pageNum: 1,
  });

  // 状态控制
  const [workDirectionOn, setWorkDirectionOn] = useState(0);
  const [categoryOn, setCategoryOn] = useState(0);
  const [bookStatusOn, setBookStatusOn] = useState<number | null>(null);
  const [wordCountOn, setWordCountOn] = useState<number | null>(null);
  const [updateTimeOn, setUpdateTimeOn] = useState<number | null>(null);
  const [sortOn, setSortOn] = useState<string | null>(null);

  useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
      setSearchCondition(prev => ({ ...prev, keyword: key }));
    }
    loadCategoryList(0);
  }, [searchParams]);

  const loadCategoryList = async (workDirection: number) => {
    try {
      const response = await fetch(`${baseURL}/front/book/category/list?workDirection=${workDirection}`);
      const result = await response.json();
      if (result.code == 200) {
        console.log(result);
        setBookCategories(result.data);
        setWorkDirectionOn(workDirection);
        setSearchCondition((prev: SearchCondition) => ({
          ...prev,
          workDirection,
          categoryId: undefined,
        }));
        setCategoryOn(0);
        search();
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const search = async () => {
    try {
      // 构建查询参数
      const params = new URLSearchParams();
      Object.entries(searchCondition).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${baseURL}/front/search/books?${params.toString()}`);
      const result = await response.json();
      console.log(result);
      if (result.code == 200) {
        setBooks(result.data.list);
        setTotal(result.data.total);
        setSearchCondition(prev => ({
          ...prev,
          pageNum: result.data.pageNum,
          pageSize: result.data.pageSize,
        }));
      }
    } catch (error) {
      console.error('Failed to search books:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setSearchCondition(prev => ({ ...prev, pageNum: page }));
    search();
  };

  const changeCategory = (categoryId: number) => {
    setCategoryOn(categoryId);
    setSearchCondition(prev => ({
      ...prev,
      categoryId: categoryId > 0 ? categoryId : undefined,
    }));
    search();
  };

  const changeBookStatus = (status: number | null) => {
    setBookStatusOn(status);
    setSearchCondition(prev => ({ ...prev, bookStatus: status }));
    search();
  };

  const changeWordCount = (min: number | null, max: number | null) => {
    setWordCountOn(min);
    setSearchCondition(prev => ({
      ...prev,
      wordCountMin: min,
      wordCountMax: max,
    }));
    search();
  };

  const changeUpdateTime = (days: number | null) => {
    setUpdateTimeOn(days);
    setSearchCondition(prev => ({
      ...prev,
      updateTimeMin: days ? dateFormat('YYYY-MM-DD', addDay(-days)) : null,
    }));
    search();
  };

  const changeSort = (sort: string | null) => {
    setSortOn(sort);
    setSearchCondition(prev => ({ ...prev, sort }));
    search();
  };

  const bookDetail = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const wordCountFormat = (count: number) => {
    if (count >= 10000) {
      return `${Math.floor(count / 10000)}万`;
    }
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}千`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {/* 筛选条件 */}
          <div className="space-y-4">
            {/* 作品频道 */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-24">作品频道：</span>
              <div className="flex gap-4">
                <Button
                  variant={workDirectionOn === 0 ? "default" : "outline"}
                  onClick={() => loadCategoryList(0)}
                >
                  男频
                </Button>
                <Button
                  variant={workDirectionOn === 1 ? "default" : "outline"}
                  onClick={() => loadCategoryList(1)}
                >
                  女频
                </Button>
              </div>
            </div>

            {/* 作品分类 */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-24">作品分类：</span>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant={categoryOn === 0 ? "default" : "outline"}
                  onClick={() => changeCategory(0)}
                >
                  不限
                </Button>
                {bookCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={categoryOn === category.id ? "default" : "outline"}
                    onClick={() => changeCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* 是否完结 */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-24">是否完结：</span>
              <div className="flex gap-4">
                <Button
                  variant={bookStatusOn === null ? "default" : "outline"}
                  onClick={() => changeBookStatus(null)}
                >
                  不限
                </Button>
                <Button
                  variant={bookStatusOn === 0 ? "default" : "outline"}
                  onClick={() => changeBookStatus(0)}
                >
                  连载中
                </Button>
                <Button
                  variant={bookStatusOn === 1 ? "default" : "outline"}
                  onClick={() => changeBookStatus(1)}
                >
                  已完结
                </Button>
              </div>
            </div>

            {/* 作品字数 */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 w-24">作品字数：</span>
              <div className="flex gap-4">
                <Button
                  variant={wordCountOn === null ? "default" : "outline"}
                  onClick={() => changeWordCount(null, null)}
                >
                  不限
                </Button>
                <Button
                  variant={wordCountOn === 0 ? "default" : "outline"}
                  onClick={() => changeWordCount(0, 300000)}
                >
                  30万字以下
                </Button>
                <Button
                  variant={wordCountOn === 300000 ? "default" : "outline"}
                  onClick={() => changeWordCount(300000, 500000)}
                >
                  30-50万字
                </Button>
                <Button
                  variant={wordCountOn === 500000 ? "default" : "outline"}
                  onClick={() => changeWordCount(500000, 1000000)}
                >
                  50-100万字
                </Button>
                <Button
                  variant={wordCountOn === 1000000 ? "default" : "outline"}
                  onClick={() => changeWordCount(1000000, null)}
                >
                  100万字以上
                </Button>
              </div>
            </div>
           
          </div>
        </div>

        {/* 书籍列表 */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">序号</TableHead>
                <TableHead className="w-24">类别</TableHead>
                <TableHead>书名</TableHead>
                <TableHead>最新章节</TableHead>
                <TableHead className="w-24">作者</TableHead>
                <TableHead className="w-24">字数</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book, index) => (
                <TableRow key={book.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => bookDetail(book.id)}
                      className="text-gray-600 hover:text-primary"
                    >
                      [{book.categoryName}]
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => bookDetail(book.id)}
                      className="hover:text-primary"
                      dangerouslySetInnerHTML={{ __html: book.bookName }}
                    />
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => bookDetail(book.id)}
                      className="hover:text-primary"
                    >
                      {book.lastChapterName}
                    </button>
                  </TableCell>
                  <TableCell>
                    <span
                      dangerouslySetInnerHTML={{ __html: book.authorName }}
                    />
                  </TableCell>
                  <TableCell>{wordCountFormat(book.wordCount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-center py-4">
            <CustomPagination
              total={total}
              pageSize={searchCondition.pageSize || 10}
              current={searchCondition.pageNum || 1}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 