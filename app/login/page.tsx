'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { toast } from '@/hooks/use-toast';
import { setToken, setNickName, setUid } from '@/lib/auth';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loginUser = async () => {
    // 表单验证
    if (!formData.username) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "用户名不能为空！",
      });
      return;
    }
    if (!/^1[3|4|5|6|7|8|9][0-9]{9}/.test(formData.username)) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "手机号格式不正确！",
      });
      return;
    }
    if (!formData.password) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "密码不能为空！",
      });
      return;
    }

    try {
      const response = await fetch(`${baseURL}/front/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();

      if (result.code == 200) {
        setToken(result.data.token);
        setUid(result.data.uid);
        setNickName(result.data.nickName);
        toast({
          title: "成功",
          description: "登录成功！",
        });
        router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "错误",
          description: result.message || '登录失败',
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "登录失败，请稍后重试",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md flex">
          {/* 左侧登录表单 */}
          <div className="w-1/2 p-8">
            <h3 className="text-2xl font-medium text-center mb-8">
              登录小说精品屋
            </h3>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="手机号码"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="密码"
                />
              </div>
              <button
                onClick={loginUser}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200"
              >
                登录
              </button>
            </div>
          </div>

          {/* 右侧注册入口 */}
          <div className="w-1/2 p-8 border-l">
            <div className="text-center">
              <p className="text-lg mb-4">还没有注册账号？</p>
              <Link
                href="/register"
                className="inline-block px-8 py-2 border-2 border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition duration-200"
              >
                立即注册
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
