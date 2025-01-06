export interface Book {
  id: string;
  bookName: string;
  categoryName: string;
  authorName: string;
  wordCount: number;
  lastChapterName: string;
  updateTime: string;
  visitCount: number;
  picUrl: string;
}

export interface Category {
  id: number;
  name: string;
  workDirection: number;
  sort: number;
}

export interface SearchCondition {
  keyword?: string;
  workDirection?: number;
  categoryId?: number;
  bookStatus?: number | null;
  wordCountMin?: number | null;
  wordCountMax?: number | null;
  updateTimeMin?: string | null;
  sort?: string | null;
  pageNum?: number;
  pageSize?: number;
}

export interface SearchResponse {
  code: number;
  data: {
    list: Book[];
    pageNum: number;
    pageSize: number;
    total: number;
  };
}

export interface BooksResponse {
  list: Book[]
  total: number
  pageNum: number
  pageSize: number
}

