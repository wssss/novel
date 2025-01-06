'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import { cn } from "@/lib/utils";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();



  const navItems = [
    { href: '/', label: '首页' },
    { href: '/book-class', label: '全部作品' },
    { href: '/book-rank', label: '排行榜' },
    { href: '/author/book-list', label: '作家专区' },
  ];

  return (
    <nav className="w-full bg-primary shadow-md">
      <div className="container mx-auto px-4">
        <ul className="flex items-center h-12">
          {navItems.map((item) => (
            <li key={item.href} className="mr-8">
              <Link 
                href={item.href}
                className={cn(
                  "text-white hover:text-gray-200 transition-colors py-2 px-3 rounded-md",
                  pathname === item.href && "bg-primary-hover"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}