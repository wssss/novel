import { ReactNode } from "react"
import UserMenu from "@/components/user-menu"

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <UserMenu />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
