"use server"

import { auth } from '@clerk/nextjs/server';

import { getAuthorBooks } from "@/lib/data"

export async function fetchAuthorBooks(page: number, pageSize: number) {
  const user = await auth()
  const userId = user.userId
  
  if (!userId) {
    throw new Error("未登录")
  }

  try {
    const result = await getAuthorBooks(userId, page, pageSize)
    return result
  } catch (error) {
    console.error("获取作者书籍列表失败:", error)
    throw new Error("获取作者书籍列表失败")
  }
}