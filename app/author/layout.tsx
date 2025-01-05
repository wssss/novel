import { ReactNode } from "react"
import UserMenu from "@/components/user-menu"
import Header from "@/components/common/Header"

interface AuthorLayoutProps {
  children: ReactNode
}

export default function AuthorLayout({ children }: AuthorLayoutProps) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <UserMenu />
            </div>
            <main className="flex-1 bg-white rounded-lg shadow-sm p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}