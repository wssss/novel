'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { listHomeBooks } from '@/api/home';
import defaultPic from '@/public/default.gif'

interface Book {
  bookId: number;
  bookName: string;
  picUrl: string;
  bookDesc: string;
  authorName: string;
  type: string;
}

export default function Home() {
  const router = useRouter();
  const [sliderContent, setSliderContent] = useState<Book[]>([]);
  const [topBooks, setTopBooks] = useState<Book[]>([]);
  const [weekRecommend, setWeekRecommend] = useState<Book[]>([]);
  const [hotRecommend, setHotRecommend] = useState<Book[]>([]);
  const [goodRecommend, setGoodRecommend] = useState<Book[]>([]);


  useEffect(() => {
    const fetchHomeBooks = async () => {
      try {
        const { data } = await listHomeBooks();
        console.log(data)
        console.log(data.filter((book: Book) => book.type === '0'))
        
        // 分类处理数据
        setSliderContent(data.filter((book: Book) => book.type === '0'));
        setTopBooks(data.filter((book: Book) => book.type === '1'));
        setWeekRecommend(data.filter((book: Book) => book.type === '2'));   
        setHotRecommend(data.filter((book: Book) => book.type === '3'));
        setGoodRecommend(data.filter((book: Book) => book.type === '4'));
        console.log(sliderContent)
      } catch (error) {
        console.error('Failed to fetch home books:', error);
      }
    };

    fetchHomeBooks();
  }, []);

  const navigateToBook = (bookId: number) => {
    router.push(`/book/${bookId}`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 轮播图区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Carousel className="w-full">
              <CarouselContent>
                {sliderContent.map((book, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] cursor-pointer" 
                         onClick={() => navigateToBook(book.bookId)}>
                      <Image
                        src={defaultPic}
                        alt={book.bookName}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* 热门推荐区域 */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {topBooks.slice(0, 5).map((book, index) => (
                <Card key={index} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigateToBook(book.bookId)}>
                  <CardContent className="p-4">
                    <h3 className="font-bold">{book.bookName}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 本周强推 */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-xl font-bold mb-4">本周强推</h2>
            <div className="space-y-4">
              {weekRecommend.map((book, index) => (
                <div key={index} 
                     className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded"
                     onClick={() => navigateToBook(book.bookId)}>
                  <div className="relative w-24 h-32">
                    <Image
                      src={defaultPic}
                      alt={book.bookName}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{book.bookName}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3"
                       dangerouslySetInnerHTML={{ __html: book.bookDesc }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 热门推荐区域 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">热门推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotRecommend.map((book, index) => (
              <Card key={index} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigateToBook(book.bookId)}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-32">
                      <Image
                        src={defaultPic}
                        alt={book.bookName}
                        fill
                        className="object-cover rounded"
                        
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">{book.bookName}</h3>
                      <p className="text-sm text-gray-600">作者：{book.authorName}</p>
                      <p className="text-sm text-gray-600 line-clamp-3"
                         dangerouslySetInnerHTML={{ __html: book.bookDesc }}/>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 精品推荐区域 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">精品推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goodRecommend.map((book, index) => (
              <Card key={index} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigateToBook(book.bookId)}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-32">
                      <Image
                        src={defaultPic}
                        alt={book.bookName}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">{book.bookName}</h3>
                      <p className="text-sm text-gray-600">作者：{book.authorName}</p>
                      <p className="text-sm text-gray-600 line-clamp-3"
                         dangerouslySetInnerHTML={{ __html: book.bookDesc }}/>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}