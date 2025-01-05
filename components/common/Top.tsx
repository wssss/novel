'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// 假设你的 auth 工具函数在这个位置
import { getToken, getNickName, removeToken, removeNickName, removeUid } from '@/lib/auth';
import { SignInButton } from '@clerk/nextjs';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { SignedOut } from '@clerk/nextjs';

export default function Top() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [nickName, setNickName] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // 初始化状态
    // setNickName(getNickName());
    // setToken(getToken());
  }, []);

  const handleSearch = () => {
    router.push(`/bookclass?key=${keyword}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    removeToken();
    removeNickName();
    removeUid();
    setNickName('');
    setToken('');
  };

  return (
    <div className="w-full bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="书名、作者、关键字"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-4 pr-12"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {!token ? (
              // 未登录状态
              <div className="flex items-center space-x-4">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            ) : (
              // 已登录状态
              <div className="flex items-center space-x-4">
                <Link 
                  href="/user/setup"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {nickName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  退出
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}