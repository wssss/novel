'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast  } from "@/hooks/use-toast";
import { getBookById, addVisitCount, getLastChapterAbout, listRecBooks } from '@/api/book';
import { comment, deleteComment, updateComment } from '@/api/user';
import { getUid } from '@/lib/auth';

interface Book {
  id: string;
  bookName: string;
  picUrl: string;
  authorName: string;
  categoryName: string;
  bookStatus: number;
  visitCount: number;
  wordCount: number;
  bookDesc: string;
  firstChapterId: string;
}


const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
  

export default function BookDetail({ params }: PageProps) {
  const { id } = use(params); // 使用 React.use 解包 params
  
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [chapterAbout, setChapterAbout] = useState<ChapterAbout | null>(null);
  const [comments, setComments] = useState<CommentData | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [isUpdateCommentOpen, setIsUpdateCommentOpen] = useState(false);
  const [updateCommentId, setUpdateCommentId] = useState('');
  const [updateCommentContent, setUpdateCommentContent] = useState('');
  const [recBooks, setRecBooks] = useState([]);
  const uid = getUid();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const bookData = await fetch(`${baseURL}/front/book/${id}`);
        setBook((await bookData.json()).data);

        const visitData = await fetch(`${baseURL}/front/book/visit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookId: id }),
        });

        const chapterData = await fetch(
          `${baseURL}/front/book/last_chapter/about?bookId=${id}`
        );
        setChapterAbout((await chapterData.json()).data);

        const recData = await fetch(
          `${baseURL}/front/book/rec_list?bookId=${id}`
        );
        await setRecBooks((await recData.json()).data);

        const commentsData = await fetch(
          `${baseURL}/front/book/comment/newest?bookId=${id}`
        );
        setComments((await commentsData.json()).data);
      } catch (error) {
        console.error('Failed to fetch book data:', error);
        toast({
          variant: "destructive",
          title: "错误",
          description: "获取书籍信息失败",
        });
      }
    };

    fetchBookData();
  }, [id]);

  const handleReadClick = (bookId: string, chapterId: string) => {
    router.push(`/book/${bookId}/${chapterId}`);
  };

  const handleChapterList = (bookId: string) => {
    router.push(`/chapter-list/${bookId}`);
  };

  const handleComment = async () => {
    if (!commentContent) {
      toast({
        variant: "destructive",
        description: "评论内容不能为空",
      });
      return;
    }

    try {
      await comment({
        bookId: book?.id,
        commentContent
      });
      setCommentContent('');
      // 刷新评论列表
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await deleteComment(id);
      // 刷新评论列表
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleUpdateComment = async () => {
    try {
      await updateComment(updateCommentId, { content: updateCommentContent });
      setIsUpdateCommentOpen(false);
      // 刷新评论列表
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {book && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex gap-8">
              {/* 书籍封面 */}
              <div className="relative w-48 h-64">
                <Image
                  src={'/' + book.picUrl}
                  alt={book.bookName}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* 书籍信息 */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-4">{book.bookName}</h1>
                <div className="text-gray-600 mb-4">作者：{book.authorName}</div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>类别：{book.categoryName}</div>
                  <div>状态：{book.bookStatus === 0 ? "连载中" : "已完结"}</div>
                  <div>总点击：{book.visitCount}</div>
                  <div>总字数：{book.wordCount}</div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold mb-2">简介：</h3>
                  <div 
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: book.bookDesc }}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => handleReadClick(book.id, book.firstChapterId)}
                  >
                    开始阅读
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 最新章节 */}
        {chapterAbout && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                最新章节 
                <span className="text-sm text-gray-500 ml-2">
                  ({chapterAbout.chapterTotal}章)
                </span>
              </h2>
              <Button
                variant="outline"
                onClick={() => book && handleChapterList(book.id)}
              >
                查看目录
              </Button>
            </div>

            {/* 章节信息 */}
            <div className="mt-4">
              {chapterAbout?.chapterInfo && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <a 
                        className="text-lg hover:text-blue-600 cursor-pointer"
                        onClick={() => handleReadClick(
                          chapterAbout.chapterInfo.bookId,
                          chapterAbout.chapterInfo.id
                        )}
                      >
                        {chapterAbout.chapterInfo.chapterName}
                      </a>
                    </div>
                    <span className="text-gray-500">
                      更新时间：{chapterAbout.chapterInfo.chapterUpdateTime}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
                    {chapterAbout.contentSummary}...
                  </div>
                </>
              )}
            </div>

            {/* 评论区 */}
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
                        <div className="mt-1 text-gray-600" dangerouslySetInnerHTML={{ __html: item.commentContent }} />
                        <div className="mt-2 flex justify-between text-sm text-gray-500">
                          <span>{item.commentTime}</span>
                          {item.commentUserId === uid && (
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
                    <Button onClick={handleUpdateComment}>确��</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}