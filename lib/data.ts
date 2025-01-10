import connectionPool from '@/db';
import { Category } from '@/types/book';
import { auth } from '@clerk/nextjs/server';


export async function getHomeBooks() {
  try {
    const result = await connectionPool.query({
      text: `
        SELECT 
          b.id as "bookId",
          b.book_name as "bookName",
          b.pic_url as "picUrl",
          b.book_desc as "bookDesc",
          b.author_name as "authorName",
          b.word_count as "wordCount",
          b.book_status as "bookStatus",
          b.visit_count as "visitCount",
          h.type as type
        FROM home_book h
        JOIN book_info b ON h.book_id = b.id
        ORDER BY h.type, h.sort
      `
    });
    
    return {
      data: result.rows
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('获取首页书籍失败');
  }
}

// 获取书籍分类列表
export async function getBookCategories(workDirection: number) {
  try {
    const result = await connectionPool.query({
      text: `
        SELECT 
          id,
          name,
          work_direction as "workDirection",
          sort
        FROM book_category
        WHERE work_direction = $1
        ORDER BY sort
      `,
      values: [workDirection]
    });
    return result.rows.map((row: Category) => ({
      id: Number(row.id),
      name: String(row.name),
      workDirection: Number(row.workDirection),
      sort: Number(row.sort)
    }));
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch book categories');
  }
}

interface BookListParams {
  pageSize: number;
  pageNum: number;
  workDirection: number;
  keyword?: string;
}

export async function getBookList(params: BookListParams) {
  const { pageSize, pageNum, workDirection, keyword } = params;
  const offset = (pageNum - 1) * pageSize;
  
  try {
    let queryText = `
      SELECT 
        b.id,
        b.book_name as "bookName",
        b.pic_url as "picUrl",
        b.book_desc as "bookDesc",
        b.author_name as "authorName",
        b.word_count as "wordCount",
        b.book_status as "bookStatus",
        b.visit_count as "visitCount",
        b.category_name as "categoryName",
        COUNT(*) OVER() as total
      FROM book_info b
      WHERE b.work_direction = $1
    `;
    
    const queryParams: any[] = [workDirection];
    let paramCount = 2;

    // 如果有关键词，添加搜索条件
    if (keyword) {
      queryText += ` AND (b.book_name ILIKE $${paramCount} OR b.author_name ILIKE $${paramCount})`;
      queryParams.push(`%${keyword}%`);
      paramCount++;
    }

    queryText += `
      ORDER BY b.visit_count DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    
    queryParams.push(pageSize, offset);

    const result = await connectionPool.query({
      text: queryText,
      values: queryParams
    });

    const total = result.rows[0]?.total ? parseInt(result.rows[0].total) : 0;

    return {
      list: result.rows.map(row => ({
        id: row.id,
        bookName: row.bookName,
        picUrl: row.picUrl,
        bookDesc: row.bookDesc,
        authorName: row.authorName,
        wordCount: Number(row.wordCount),
        bookStatus: row.bookStatus,
        visitCount: Number(row.visitCount),
        categoryName: row.categoryName
      })),
      total,
      pageNum,
      pageSize
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('获取书籍列表失败');
  }
}

// 获取排行榜数据
export async function getRankBooks(type: string) {
  try {
    let query = '';
    
    switch (type) {
      case 'visit_rank':
        query = `
          SELECT 
            b.id,
            b.book_name as "bookName",
            b.author_name as "authorName",
            b.word_count as "wordCount",
            b.category_name as "categoryName",
            b.pic_url as "picUrl",
            b.book_desc as "bookDesc",
            b.book_status as "status",
            b.visit_count as "visitCount",
            b.update_time as "updateTime"
          FROM book_info b
          WHERE b.work_direction = 0
          ORDER BY b.visit_count DESC
          LIMIT 20
        `;
        break;
        
      case 'newest_rank':
        query = `
          SELECT 
            b.id,
            b.book_name as "bookName",
            b.author_name as "authorName",
            b.word_count as "wordCount",
            b.category_name as "categoryName",
            b.pic_url as "picUrl",
            b.book_desc as "bookDesc",
            b.book_status as "status",
            b.visit_count as "visitCount",
            b.create_time as "updateTime"
          FROM book_info b
          WHERE b.work_direction = 0
          ORDER BY b.create_time DESC
          LIMIT 20
        `;
        break;
        
      case 'update_rank':
        query = `
          SELECT 
            b.id,
            b.book_name as "bookName",
            b.author_name as "authorName",
            b.word_count as "wordCount",
            b.category_name as "categoryName",
            b.pic_url as "picUrl",
            b.book_desc as "bookDesc",
            b.book_status as "status",
            b.visit_count as "visitCount",
            b.update_time as "updateTime"
          FROM book_info b
          WHERE b.work_direction = 0
          ORDER BY b.update_time DESC
          LIMIT 20
        `;
        break;
        
      default:
        throw new Error('无效的排行榜类型');
    }

    const result = await connectionPool.query({
      text: query
    });

    return result.rows.map(row => ({
      id: Number(row.id),
      title: row.bookName,
      author: row.authorName,
      wordCount: Number(row.wordCount),
      category: row.categoryName,
      coverUrl: row.picUrl,
      description: row.bookDesc,
      status: row.status,
      visitCount: Number(row.visitCount),
      updateTime: row.updateTime
    }));
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('获取排行榜数据失败');
  }
}

// 获取作者的书籍列表
export async function getAuthorBooks(authorId: string, page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize;
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('未授权访问');
    }

    // 获取总数
    const countQuery = `
      SELECT COUNT(*) 
      FROM book_info 
      WHERE author_id = $1
    `;
    
    const countResult = await connectionPool.query({
      text: countQuery,
      values: [authorId]
    });
    
    const total = parseInt(countResult.rows[0].count);
    
    // 获取书籍列表
    const query = `
      SELECT 
        id,
        book_name as "bookName",
        category_name as "categoryName",
        visit_count as "visitCount",
        update_time as "updateTime",
        word_count as "wordCount",
        pic_url as "picUrl"
      FROM book_info 
      WHERE author_id = $1
      ORDER BY update_time DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await connectionPool.query({
      text: query,
      values: [userId, pageSize, offset]
    });
    console.log('result', result)

    return {
      books: result.rows,
      total,
      page,
      pageSize
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('获取作者书籍列表失败');
  }
}

// 添加新的数据获取函数
export async function getBookDetail(id: string) {
  try {
    const result = await connectionPool.query({
      text: `
        SELECT 
          id,
          book_name as "bookName",
          pic_url as "picUrl",
          author_name as "authorName",
          category_name as "categoryName",
          book_status as "bookStatus",
          visit_count as "visitCount",
          word_count as "wordCount",
          book_desc as "bookDesc"
        FROM book_info
        WHERE id = $1
      `,
      values: [id]
    });
    
    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch book detail');
  }
}

// 获取章节相关信息
export async function getChapterAbout(bookId: string) {
  try {
    // 查询小说基本信息和章节统计
    const bookInfoQuery = `
      SELECT 
        b.id,
        b.book_name as "bookName",
        b.last_chapter_id as "lastChapterId",
        b.last_chapter_name as "lastChapterName",
        b.last_chapter_update_time as "lastChapterUpdateTime",
        b.word_count as "wordCount",
        b.book_status as "bookStatus",
        COUNT(c.id) as "chapterTotal"
      FROM book_info b
      LEFT JOIN book_chapter c ON b.id = c.book_id
      WHERE b.id = $1
      GROUP BY b.id, b.book_name, b.last_chapter_id, b.last_chapter_name, 
               b.last_chapter_update_time, b.word_count, b.book_status
    `;
    
    // 查询最新章节信息
    const latestChapterQuery = `
      SELECT 
        id,
        chapter_name as "chapterName",
        chapter_num as "chapterNum",
        word_count as "wordCount",
        create_time as "createTime"
      FROM book_chapter
      WHERE book_id = $1
      ORDER BY chapter_num DESC
      LIMIT 5
    `;
    
    const [bookResult, latestChaptersResult] = await Promise.all([
      connectionPool.query({
        text: bookInfoQuery,
        values: [bookId]
      }),
      connectionPool.query({
        text: latestChapterQuery,
        values: [bookId]
      })
    ]);

    return {
      bookInfo: bookResult.rows[0],
      latestChapters: latestChaptersResult.rows,
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('获取章节信息失败');
  }
}

// 获取书籍评论
export async function getComments(bookId: string, page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize;
    
    // 获取评论总数
    const countQuery = `
      SELECT COUNT(*) 
      FROM book_comment 
      WHERE book_id = $1
    `;
    
    const countResult = await connectionPool.query({
      text: countQuery,
      values: [bookId]
    });
    
    const total = parseInt(countResult.rows[0].count);
    
    // 获取评论列表
    const query = `
      SELECT 
        c.id,
        c.create_time as "createTime",
        c.user_id as "userId",
        u.username
      FROM book_comment c
      LEFT JOIN user_info u ON c.user_id = u.id
      WHERE c.book_id = $1
      ORDER BY c.create_time DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await connectionPool.query({
      text: query,
      values: [bookId, pageSize, offset]
    });

    return {
      comments: result.rows.map(row => ({
        id: row.id,
        content: row.content,
        createTime: row.createTime,
        userId: row.userId,
        username: row.username,
        avatarUrl: row.avatarUrl
      })),
      total,
      page,
      pageSize
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('获取评论列表失败');
  }
}

// 获取章节列表
export async function getChapterList(bookId: string) {
  try {
    const result = await connectionPool.query({
      text: `
        SELECT 
          id,
          chapter_name as "chapterName",
          chapter_num as "chapterNum",
          word_count as "wordCount",
          is_vip as "isVip",
          create_time as "createTime"
        FROM book_chapter
        WHERE book_id = $1
        ORDER BY chapter_num ASC
      `,
      values: [bookId]
    });
    
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('获取章节列表失败');
  }
}

export async function getChapterContent(chapterId: string) {
  try {
    console.log('Fetching chapter content for ID:', chapterId);
    // 获取章节信息
    const chapterQuery = `
      SELECT 
        c.id,
        c.chapter_name as "chapterName",
        c.chapter_num as "chapterNum",
        c.word_count as "chapterWordCount",
        c.book_id as "bookId",
        c.update_time as "chapterUpdateTime",
        b.book_name as "bookName",
        b.author_name as "authorName",
        b.category_name as "categoryName",
        bc.content as "bookContent"
      FROM book_chapter c
      JOIN book_info b ON c.book_id = b.id
      JOIN book_content bc ON c.id = bc.chapter_id
      WHERE c.id = $1
    `;
    
    const result = await connectionPool.query({
      text: chapterQuery,
      values: [chapterId]
    });
    

    if (!result.rows[0]) {
      throw new Error('章节不存在');
    }

    return {
      chapterInfo: {
        id: result.rows[0].id,
        chapterName: result.rows[0].chapterName,
        chapterNum: result.rows[0].chapterNum,
        chapterWordCount: result.rows[0].chapterWordCount,
        bookId: result.rows[0].bookId,
        chapterUpdateTime: result.rows[0].chapterUpdateTime,
      },
      bookInfo: {
        bookName: result.rows[0].bookName,
        authorName: result.rows[0].authorName,
        categoryName: result.rows[0].categoryName,
      },
      bookContent: result.rows[0].bookContent
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('获取章节内容失败');
  }
}

// 添加获取章节列表的函数
export async function getChapterListById(bookId: string, page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize

    // 获取总数
    const countResult = await connectionPool.query(
      'SELECT COUNT(*) FROM book_chapter WHERE book_id = $1',
      [bookId]
    )
    
    const total = parseInt(countResult.rows[0].count)

    // 获取章节列表
    const result = await connectionPool.query(
      `SELECT 
        id,
        chapter_name as "chapterName",
        update_time as "chapterUpdateTime",
        is_vip as "isVip"
      FROM book_chapter 
      WHERE book_id = $1
      ORDER BY chapter_num ASC
      LIMIT $2 OFFSET $3`,
      [bookId, pageSize, offset]
    )

    return {
      list: result.rows,
      total,
      pageNum: page,
      pageSize
    }
  } catch (error) {
    console.error('获取章节列表失败:', error)
    throw new Error('获取章节列表失败')
  }
}