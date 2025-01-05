'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { toast } from '@/hooks/use-toast';
import { setToken, setNickName, setUid } from '@/lib/auth';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    velCode: '',
    sessionId: '',
  });
  const [imgVerifyCode, setImgVerifyCode] = useState('/default.png');

  useEffect(() => {
    loadImgVerifyCode();
  }, []);

  const loadImgVerifyCode = async () => {
    try {
      const response = await fetch(`${baseURL}/front/resource/img_verify_code`);
      const data = await response.json();
      setImgVerifyCode(`data:image/png;base64,${data.data.img}`);
      setFormData(prev => ({ ...prev, sessionId: data.data.sessionId }));
    } catch (error) {
      toast({
        title: '获取验证码失败',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registerUser = async () => {
    // 表单验证
    if (!formData.username) {
        toast({
            title: '用户名不能为空！',
            variant: 'destructive',
        });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.username)) {
        toast({
            title: '手机号格式不正确！',
            variant: 'destructive',
        });
      return;
    }
    if (!formData.password) {
        toast({
            title: '密码不能为空！',
            variant: 'destructive',
        });
      return;
    }
    if (!formData.velCode) {
        toast({
            title: '验证码不能为空！',
            variant: 'destructive',
        });
      return;
    }
    if (!/^\d{4}/.test(formData.velCode)) {
        toast({
            title: '验证码格式不正确！',
            variant: 'destructive',
        });
      return;
    }

    try {
      const response = await fetch(`${baseURL}/front/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.ok) {
        setToken(result.data.token);
        setUid(result.data.uid);
        setNickName(formData.username);
        router.push('/');
      } else {
        toast({
            title: result.message || '注册失败',
            variant: 'destructive',
        });
      }
    } catch (error) {
        toast({
            title: '注册失败，请稍后重试',
            variant: 'destructive',
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md flex">
          {/* 左侧注册表单 */}
          <div className="w-1/2 p-8">
            <h3 className="text-2xl font-medium text-center mb-8">
              注册1Novel小说账号
            </h3>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入您的手机号码"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入密码：6-20位字母/数字"
                />
              </div>
              <div className="flex space-x-4">
                <input
                  type="text"
                  name="velCode"
                  value={formData.velCode}
                  onChange={handleInputChange}
                  maxLength={4}
                  className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入验证码"
                />
                <Image
                  src={imgVerifyCode}
                  alt="验证码"
                  width={120}
                  height={40}
                  className="cursor-pointer"
                  onClick={loadImgVerifyCode}
                />
              </div>
              <button
                onClick={registerUser}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200"
              >
                注册
              </button>
            </div>
          </div>

          {/* 右侧登录入口 */}
          <div className="w-1/2 p-8 border-l">
            <div className="text-center">
              <p className="text-lg mb-4">已有账号？</p>
              <Link
                href="/login"
                className="inline-block px-8 py-2 border-2 border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition duration-200"
              >
                立即登录
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
