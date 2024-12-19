import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { CommentsResponseModel } from "@/api/features/comment/models/CommentResponseModel";
import { defaultCommentRepo } from "@/api/features/comment/CommentRepo";
import { defaultLikeCommentRepo } from "@/api/features/likeComment/LikeCommentRepo";
import { LikeCommentResponseModel } from "@/api/features/likeComment/models/LikeCommentResponses";
import { CreateCommentsRequestModel } from "@/api/features/comment/models/CreateCommentsModel";
import { UpdateCommentsRequestModel } from "@/api/features/comment/models/UpdateCommentsModel";

export const usePostDetailsViewModel = (postId: string) => {
  const [comments, setComments] = useState<CommentsResponseModel[]>([]);
  const [replyMap, setReplyMap] = useState<{ [key: string]: CommentsResponseModel[] }>({});
  const [likeCount, setLikeCount] = useState<{ [key: string]: number }>({});
  const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});
  const [newComment, setNewComment] = useState<string>("");
  const textInputRef = useRef<HTMLInputElement>(null);

  // Fetch Comments
  const fetchComments = async () => {
    try {
      const response = await defaultCommentRepo.getComments({ PostId: postId, page: 1, limit: 10 });
      if (response?.data) setComments(response.data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách bình luận");
      console.error(error);
    }
  };

  // Fetch Replies
  const fetchReplies = async (parentId: string) => {
    try {
      const replies = await defaultCommentRepo.getReplies(postId, parentId);
      if (replies?.data) {
        setReplyMap((prev) => ({ ...prev, [parentId]: replies.data }));
      }
    } catch (error) {
      toast.error("Lỗi khi tải phản hồi");
      console.error(error);
    }
  };

  // Handle Like
  const handleLike = async (commentId: string) => {
    const isLiked = !userLikes[commentId];
    try {
      const response = await defaultLikeCommentRepo.postLikeComment({ commentId, isLike: isLiked });
      if (response?.data) {
        const likeResponse: LikeCommentResponseModel = response.data;
        setUserLikes((prev) => ({ ...prev, [commentId]: likeResponse.is_liked ?? false }));
        setLikeCount((prev) => ({ ...prev, [commentId]: likeResponse.like_count }));
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  // Handle Add Comment
  const handleAddComment = async () => {
    if (newComment.trim()) {
      const newCommentData: CreateCommentsRequestModel = { post_id: postId, content: newComment };
      try {
        const response = await defaultCommentRepo.createComment(newCommentData);
        if (response?.data) {
          toast.success("Bình luận thành công!");
          setComments((prev) => [...prev, response.data]);
          setNewComment("");
        }
      } catch (error) {
        toast.error("Thêm bình luận thất bại");
      }
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return {
    comments,
    replyMap,
    likeCount,
    userLikes,
    newComment,
    setNewComment,
    textInputRef,
    fetchReplies,
    handleLike,
    handleAddComment,
  };
};

export default usePostDetailsViewModel;