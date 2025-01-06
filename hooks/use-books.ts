import { useState, useEffect } from "react"
import { fetchAuthorBooks } from "@/app/author/actions"

export function useAuthorBooks(page: number, pageSize: number) {
  const [books, setBooks] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoading(true)
        const data = await fetchAuthorBooks(page, pageSize)
        console.log('data', data)
        setBooks(data.books)
        setTotal(data.total)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取数据失败")
      } finally {
        setIsLoading(false)
      }
    }

    loadBooks()
  }, [page, pageSize])

  return { books, total, isLoading, error }
}
