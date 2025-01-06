import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BookList from "@/components/BookList";
import { getHomeBooks } from '@/lib/data';

export default async function Home() {
  const { data } = await getHomeBooks();
  console.log(data);
  const sliderContent = data.filter((book: any) => book.type == '0');
  const topBooks = data.filter((book: any) => book.type == '1');
  const weekRecommend = data.filter((book: any) => book.type == '2');   
  const hotRecommend = data.filter((book: any) => book.type == '3');
  const goodRecommend = data.filter((book: any) => book.type == '4');

  return (
    <div className="min-h-screen">
      <Header />
      <BookList 
        sliderContent={sliderContent}
        topBooks={topBooks}
        weekRecommend={weekRecommend}
        hotRecommend={hotRecommend}
        goodRecommend={goodRecommend}
      />
      <Footer />
    </div>
  );
}