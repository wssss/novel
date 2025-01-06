interface Chapter {
    id: string;
    bookId: string;
    chapterName: string;
    chapterUpdateTime: string;
  }
  
  interface ChapterAbout {
    chapterTotal: number;
    chapterInfo: Chapter;
    contentSummary: string;
  }
  
  interface Comment {
    id: string;
    commentUserId: string;
    commentUser: string;
    commentUserPhoto: string;
    commentContent: string;
    commentTime: string;
  }
  
  interface CommentData {
    commentTotal: number;
    comments: Comment[];
  }
  interface PageProps {
      params: Promise<{ id: string }>;
  }
  
  interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    bookStatus: number;
    visitCount: number;
    wordCount: number;
    type: string;
    lastChapterName: string;
  }
  
  interface Chapter {
    id: string;
    chapterName: string;
    isVip: number;
  }
  

  
  interface ChapterInfo {
    bookId: string;
    chapterName: string;
    chapterWordCount: number;
    chapterUpdateTime: string;
  }
  
  interface BookInfo {
    categoryName: string;
    authorName: string;
  }
  
  interface ChapterData {
    chapterInfo: ChapterInfo;
    bookInfo: BookInfo;
    bookContent: string;
  }