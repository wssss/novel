'use server'

import { revalidatePath } from 'next/cache'
import connectionPool from '@/db'

interface ChapterData {
  chapterName: string
  chapterContent: string
  isVip: number
}

/**
 * 获取章节详情
 */
export async function getChapter(id: string) {
  try {
    const result = await connectionPool.query(
      `SELECT 
        bc.id,
        bc.chapter_name as "chapterName",
        c.content as "chapterContent",
        bc.is_vip as "isVip",
        bc.book_id as "bookId"
      FROM book_chapter bc
      LEFT JOIN book_content c ON bc.id = c.chapter_id
      WHERE bc.id = $1`,
      [id]
    )
    
    return { success: true, data: result.rows[0] || null }
  } catch (error) {
    console.error('获取章节失败:', error)
    return { success: false, error: '获取章节失败' }
  }
}

/**
 * 更新章节信息
 */
export async function updateChapter(id: string, data: ChapterData) {
  const client = await connectionPool.connect()
  
  try {
    await client.query('BEGIN')

    // 更新章节基本信息
    const chapterResult = await client.query(
      `UPDATE book_chapter 
       SET chapter_name = $1, is_vip = $2, update_time = $3
       WHERE id = $4
       RETURNING id`,
      [data.chapterName, data.isVip, new Date(), id]
    )

    if (chapterResult.rowCount === 0) {
      throw new Error('章节不存在')
    }

    // 更新章节内容
    await client.query(
      `UPDATE book_content 
       SET content = $1, update_time = $2
       WHERE chapter_id = $3`,
      [data.chapterContent, new Date(), id]
    )

    await client.query('COMMIT')

    // 重新验证章节列表页面和章节详情页面
    revalidatePath('/author/chapters')
    revalidatePath(`/author/chapter-update?id=${id}`)
    
    return { success: true, data: { id, ...data } }
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('更新章节失败:', error)
    return { success: false, error: '更新章节失败' }
  } finally {
    client.release()
  }
}

/**
 * 创建新章节
 */
export async function createChapter(bookId: number, data: ChapterData) {
  const client = await connectionPool.connect()
  
  try {
    await client.query('BEGIN')

    // 获取当前书籍最新章节序号
    const chapterNumResult = await client.query(
      `SELECT chapter_num as "chapterNum" 
       FROM book_chapter 
       WHERE book_id = $1 
       ORDER BY chapter_num DESC 
       LIMIT 1`,
      [bookId]
    )
    
    const newChapterNum = (chapterNumResult.rows[0]?.chapterNum || 0) + 1

    // 创建新章节
    const chapterResult = await client.query(
      `INSERT INTO book_chapter 
        (book_id, chapter_num, chapter_name, is_vip, create_time, update_time)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [bookId, newChapterNum, data.chapterName, data.isVip, new Date(), new Date()]
    )

    const newChapterId = chapterResult.rows[0].id

    // 创建章节内容
    await client.query(
      `INSERT INTO book_content 
        (chapter_id, content, create_time, update_time)
       VALUES ($1, $2, $3, $4)`,
      [newChapterId, data.chapterContent, new Date(), new Date()]
    )

    // 更新书籍信息
    await client.query(
      `UPDATE book_info 
       SET last_chapter_id = $1, 
           last_chapter_name = $2, 
           last_chapter_update_time = $3 
       WHERE id = $4`,
      [newChapterId, data.chapterName, new Date(), bookId]
    )

    await client.query('COMMIT')

    revalidatePath('/author/chapters')
    
    return { 
      success: true, 
      data: { 
        id: newChapterId,
        bookId,
        chapterNum: newChapterNum,
        ...data 
      } 
    }
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('创建章节失败:', error)
    return { success: false, error: '创建章节失败' }
  } finally {
    client.release()
  }
}

/**
 * 删除章节
 */
export async function deleteChapter(id: string) {
  const client = await connectionPool.connect()
  
  try {
    await client.query('BEGIN')

    // 删除章节内容
    await client.query(
      'DELETE FROM book_content WHERE chapter_id = $1',
      [id]
    )

    // 删除章节
    const result = await client.query(
      'DELETE FROM book_chapter WHERE id = $1',
      [id]
    )

    if (result.rowCount === 0) {
      throw new Error('章节不存在')
    }

    await client.query('COMMIT')

    revalidatePath('/author/chapters')
    
    return { success: true, data: { id } }
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('删除章节失败:', error)
    return { success: false, error: '删除章节失败' }
  } finally {
    client.release()
  }
}    