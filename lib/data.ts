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
          h.type as type
        FROM home_book h
        JOIN book_info b ON h.book_id = b.id
        ORDER BY h.type, h.sort
      `
    });
    
    return {
      data: result.rows.map((book: Book) => ({
        ...book
      }))
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch home books');
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

// 获取书籍列表
export async function getBookList(searchCondition: any) {
  try {
    let query = `
      SELECT 
        b.id,
        b.category_name as "categoryName",
        b.book_name as "bookName",
        b.author_name as "authorName",
        b.word_count as "wordCount",
        b.last_chapter_name as "lastChapterName"
      FROM book_info b
      WHERE 1=1
    `;
    
    const values: any[] = [];
    let valueIndex = 1;

    if (searchCondition.workDirection !== undefined) {
      query += ` AND b.work_direction = $${valueIndex}`;
      values.push(searchCondition.workDirection);
      valueIndex++;
    }

    if (searchCondition.categoryId) {
      query += ` AND b.category_id = $${valueIndex}`;
      values.push(searchCondition.categoryId);
      valueIndex++;
    }

    if (searchCondition.bookStatus !== null && searchCondition.bookStatus !== undefined) {
      query += ` AND b.book_status = $${valueIndex}`;
      values.push(searchCondition.bookStatus);
      valueIndex++;
    }

    if (searchCondition.wordCountMin !== null && searchCondition.wordCountMin !== undefined) {
      query += ` AND b.word_count >= $${valueIndex}`;
      values.push(searchCondition.wordCountMin);
      valueIndex++;
    }

    if (searchCondition.wordCountMax !== null && searchCondition.wordCountMax !== undefined) {
      query += ` AND b.word_count <= $${valueIndex}`;
      values.push(searchCondition.wordCountMax);
      valueIndex++;
    }

    // 添加分页
    const offset = ((searchCondition.pageNum || 1) - 1) * (searchCondition.pageSize || 10);
    query += ` ORDER BY b.create_time DESC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
    values.push(searchCondition.pageSize || 10, offset);

    // 获取总数
    const countResult = await connectionPool.query({
      text: query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) FROM').split('ORDER BY')[0],
      values: values.slice(0, -2)
    });

    const total = parseInt(countResult.rows[0].count);

    // 获取数据列表
    const result = await connectionPool.query({
      text: query,
      values
    });

    return {
      list: result.rows.map((row: Book) => ({
        id: String(row.id),
        categoryName: String(row.categoryName),
        title: String(row.bookName),
        author: String(row.authorName),
        wordCount: Number(row.wordCount),
        lastChapterName: String(row.lastChapterName)
      })),
      total,
      pageNum: searchCondition.pageNum || 1,
      pageSize: searchCondition.pageSize || 10
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch book list');
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