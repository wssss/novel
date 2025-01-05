import useSWR from "swr"    
import { BooksResponse } from "@/types/book"


export function useBooks(page: number) {
    const { data, error, isLoading } = useSWR<BooksResponse>(
      `/api/author/books?pageNum=${page - 1}&pageSize=10`,
      async (url) => {
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch books")
        return res.json()
      }
    )
  
    return {
      books: data?.list,
      total: data?.total || 0,
      isLoading,
      isError: error
    }
  }