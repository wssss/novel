"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    name: "文章管理",
    href: "/author/book-list",
    className: "link_8"
  },
  {
    name: "账号设置",
    href: "/user/setup", 
    className: "link_6"
  }
]

export default function UserMenu() {
  const pathname = usePathname()

  return (
    <div className="w-[220px]">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "block h-[42px] leading-[42px] pl-6 border-l-4 mb-[5px] text-gray-600 hover:bg-gray-50 transition-colors duration-200",
                item.className,
                pathname === item.href && [
                  "bg-orange-50",
                  "border-l-4",
                  "border-orange-500",
                  "text-orange-600",
                  "font-medium",
                ]
              )}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
