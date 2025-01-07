'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  commentUser: string;
  commentUserId: string;
  commentUserPhoto: string;
  commentContent: string;
  commentTime: string;
}

interface CommentData {
  comments: Comment[];
  commentTotal: number;
}

interface CommentSectionProps {
  initialComments: CommentData;
  bookId: string;
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CommentSection({ initialComments, bookId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData>(initialComments);
  const [commentContent, setCommentContent] = useState('');
  const [isUpdateCommentOpen, setIsUpdateCommentOpen] = useState(false);
  const [updateCommentId, setUpdateCommentId] = useState('');
  const [updateCommentContent, setUpdateCommentContent] = useState('');
  




  // 发表评论
  const handleComment = async () => {
    if (!commentContent) {
      toast({
        variant: "destructive",
        description: "评论内容不能为空",
      });
      return;
    }

    try {
      const response = await fetch(`${baseURL}/front/book/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          commentContent
        }),
      });

      if (!response.ok) {
        throw new Error('评论失败');
      }

      setCommentContent('');
      // 刷新评论列表
      const newCommentsRes = await fetch(
        `${baseURL}/front/book/comment/newest?bookId=${bookId}`
      );
      const newComments = await newCommentsRes.json();
      setComments(newComments.data);

      toast({
        description: "评论成功",
      });
    } catch (error) {
      console.error('Failed to submit comment:', error);
      toast({
        variant: "destructive",
        description: "评论失败",
      });
    }
  };

  // 删除评论
  const handleDeleteComment = async (id: string) => {
    try {
      const response = await fetch(`${baseURL}/front/book/comment/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      // 刷新评论列表
      const newCommentsRes = await fetch(
        `${baseURL}/front/book/comment/newest?bookId=${bookId}`
      );
      const newComments = await newCommentsRes.json();
      setComments(newComments.data);

      toast({
        description: "删除成功",
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast({
        variant: "destructive",
        description: "删除失败",
      });
    }
  };

  // 更新评论
  const handleUpdateComment = async () => {
    try {
      const response = await fetch(`${baseURL}/front/book/comment/${updateCommentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: updateCommentContent
        }),
      });

      if (!response.ok) {
        throw new Error('更新失败');
      }

      setIsUpdateCommentOpen(false);
      
      // 刷新评论列表
      const newCommentsRes = await fetch(
        `${baseURL}/front/book/comment/newest?bookId=${bookId}`
      );
      const newComments = await newCommentsRes.json();
      setComments(newComments.data);

      toast({
        description: "更新成功",
      });
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast({
        variant: "destructive",
        description: "更新失败",
      });
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">作品评论区</h2>
          <span className="text-sm text-gray-500 ml-2">
            ({comments?.commentTotal || 0}条)
          </span>
        </div>
      </div>

      {/* 评论列表 */}
      {comments?.comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">暂无评论</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments?.comments.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={item.commentUserPhoto || '/man.png'}
                  alt={item.commentUser}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.commentUser}</div>
                <div 
                  className="mt-1 text-gray-600" 
                  dangerouslySetInnerHTML={{ __html: item.commentContent }} 
                />
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>{item.commentTime}</span>
                  {/* {item.commentUserId === uid && ( */}
                    <div className="space-x-2">
                      <button 
                        className="hover:text-blue-600"
                        onClick={() => {
                          setUpdateCommentId(item.id);
                          setUpdateCommentContent(item.commentContent);
                          setIsUpdateCommentOpen(true);
                        }}
                      >
                        修改
                      </button>
                      <button 
                        className="hover:text-red-600"
                        onClick={() => handleDeleteComment(item.id)}
                      >
                        删除
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 发表评论 */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">发表评论</h3>
        <Textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="我来说两句..."
          className="min-h-[100px]"
        />
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {commentContent.length}/1000 字
          </span>
          <Button onClick={handleComment}>发表</Button>
        </div>
      </div>

      {/* 修改评论对话框 */}
      <Dialog open={isUpdateCommentOpen} onOpenChange={setIsUpdateCommentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改评论</DialogTitle>
          </DialogHeader>
          <Textarea
            value={updateCommentContent}
            onChange={(e) => setUpdateCommentContent(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateCommentOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateComment}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}