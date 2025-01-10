import { getBookCategories, getBookList } from '@/lib/data';
import BookClassClient from './BookClassClient';

export const dynamic = 'force-dynamic';

export default async function BookClass({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const keyword = typeof searchParams?.key === 'string' ? searchParams.key : '';
  
  const [initialCategories, initialBooks] = await Promise.all([
    getBookCategories(0),
    getBookList({
      pageSize: 10,
      pageNum: 1,
      workDirection: 0,
      keyword
    })
  ]);

  return (
    <BookClassClient 
      initialCategories={initialCategories}
      initialBooks={initialBooks}
    />
  );
}