import { getBookCategories, getBookList } from '@/lib/data';
import BookClassClient from './BookClassClient';

export default async function BookClass() {
  const initialCategories = await getBookCategories(0);
  const initialBooks = await getBookList({
    pageSize: 10,
    pageNum: 1,
    workDirection: 0
  });

  return (
    <BookClassClient 
      initialCategories={initialCategories}
      initialBooks={initialBooks}
    />
  );
}