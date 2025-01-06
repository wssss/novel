"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/image-upload"
import { useAuth } from "@clerk/nextjs"



interface UserInfo {
  userPhoto: string
  nickName: string
}

export default function UserSetup() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userPhoto: "",
    nickName: "",
  })

  // 更新用户头像
  const updateUserPhoto = async (photoUrl: string) => {
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPhoto: photoUrl }),
      })

      if (!response.ok) throw new Error("更新头像失败")

      setUserInfo(prev => ({
        ...prev,
        userPhoto: photoUrl
      }))

      toast({
        description: "头像更新成功"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "更新头像失败"
      })
    }
  }




  return (
    <div className="max-w-3xl p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-6">个人设置</h2>
          
          <div className="space-y-6">
            {/* 头像设置 */}
            <div className="flex items-start space-x-4">
              <div className="w-24 text-sm text-gray-500 pt-2">我的头像</div>
              <div>
                <ImageUpload
                  value={userInfo.userPhoto}
                  onChange={updateUserPhoto}
                  className="w-[178px]"
                />
              </div>
            </div>

            {/* 昵称显示 */}
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm text-gray-500">我的昵称</div>
              <div className="text-gray-900">{userInfo.nickName}</div>
            </div>

            {/* 性别显示 */}
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm text-gray-500">我的性别</div>
              <div className="text-gray-900">男</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
