import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth/useAuth";
import { message } from "antd";
//Comments
import { CommentsResponseModel } from "@/api/features/comment/models/CommentResponseModel";
import { defaultCommentRepo } from "@/api/features/comment/CommentRepo";
import { CreateCommentsRequestModel } from "@/api/features/comment/models/CreateCommentsModel";
import { UpdateCommentsRequestModel } from "@/api/features/comment/models/UpdateCommentsModel";
//LikeComments
import { defaultLikeCommentRepo } from "@/api/features/likeComment/LikeCommentRepo";
import { LikeCommentResponseModel } from "@/api/features/likeComment/models/LikeCommentResponses";
//UserLikePost
import { defaultPostRepo, PostRepo } from "@/api/features/post/PostRepo";
import { LikeUsersModel } from "@/api/features/post/models/LikeUsersModel";
import { Modal } from "antd";
import { PostResponseModel } from "@/api/features/post/models/PostResponseModel";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";

const PostDetailsViewModel = (
  postId: string,
  repo: PostRepo,
) => {
  const [comments, setComments] = useState<CommentsResponseModel[]>([]);
  const [replyMap, setReplyMap] = useState<{
    [key: string]: CommentsResponseModel[];
  }>({});

  const [likeCount, setLikeCount] = useState<{ [key: string]: number }>({});
  const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});
  const [newComment, setNewComment] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);

  const [replyToReplyId, setReplyToReplyId] = useState<string | null>(null);

  const [likeIcon, setLikeIcon] = useState("heart-outline");
  const [renderLikeIconState, setRenderLikeIconState] = useState(false);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [currentCommentId, setCurrentCommentId] = useState("");
  const [userLikePost, setUserLikePost] = useState<LikeUsersModel[]>([]);
  const { user, localStrings } = useAuth();
  const [replyContent, setReplyContent] = useState("");
  const [getPostLoading, setGetPostLoading] = useState<boolean>(false);
  const [post, setPost] = useState<PostResponseModel | undefined>(undefined);
  const [postContent, setPostContent] = useState("");
  const [privacy, setPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [originalImageFiles, setOriginalImageFiles] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [visibleReplies, setVisibleReplies] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleRepliesVisibility = (commentId: string) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };
  const handleReplyClick = (commentId: string, isReply: boolean = false) => {
    if (isReply) {
      setReplyToReplyId(commentId);
    } else {
      setReplyToCommentId(commentId);
    }
    setReplyContent("");
    fetchReplies(postId || "", commentId);
  };

  const handleShowEditModal = (commentId: string, content: string) => {
    setEditCommentContent(content);
    setCurrentCommentId(commentId);
    setEditModalVisible(true);
  };

  const handleOutsideClick = () => {
    if (replyToCommentId || replyToReplyId) {
      setReplyToCommentId(null);
      setReplyToReplyId(null);
      setReplyContent("");
    }
  };

  const fetchComments = async () => {
    const response = await defaultCommentRepo.getComments({
      PostId: postId,
      page: 1,
      limit: 10,
    });
    if (response && response?.data) {
      setComments(response?.data);
    }
  };

  const fetchReplies = async (postId: string, parentId: string) => {
    try {
      const replies = await defaultCommentRepo.getReplies(postId, parentId);
      if (replies && replies.data) {
        console.log("Data vừa lấy: ", replies.data);
        setReplyMap((prevReplyMap) => {
          console.log("replyMap updated: ", {
            ...prevReplyMap,
            [parentId]: replies.data,
          });

          return {
            ...prevReplyMap,
            [parentId]: replies.data,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleLike = async (commentOrReplyId: string) => {
    const isLike =
      userLikes[commentOrReplyId] === undefined
        ? true
        : !userLikes[commentOrReplyId];

    try {
      const response = await defaultLikeCommentRepo.postLikeComment({
        commentId: commentOrReplyId,
        isLike,
      });

      if (response && response.data) {
        const likeCommentResponse: LikeCommentResponseModel = response.data;
        // Cập nhật trạng thái like dựa trên response trả về
        setUserLikes((prevUserLikes) => ({
          ...prevUserLikes,
          [commentOrReplyId]: likeCommentResponse.is_liked ?? false,
        }));
        setLikeCount((prevLikes) => ({
          ...prevLikes,
          [commentOrReplyId]: likeCommentResponse.like_count,
        }));

        // Cập nhật biến renderLikeIconState
        setRenderLikeIconState(Boolean(likeCommentResponse.is_liked));
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!currentCommentId || !editCommentContent) {
      console.error("Invalid comment ID or content");
      return;
    }

    await handleUpdate(currentCommentId, editCommentContent, commentId);
    setEditModalVisible(false); // Close modal
    setEditCommentContent("");
    setCurrentCommentId("");
  };

  const [lastChange, setLastChange] = useState(false);
  useEffect(() => {
    if (!lastChange) {
      console.log("editCommentContent:", editCommentContent);
      setLastChange(true);
    }
  }, [editCommentContent]);

  const handleUpdate = async (
    commentId: string,
    updatedContent: string,
    parentId: string,
    isReply = false
  ) => {
    try {
      const updateCommentData = {
        comments_id: commentId,
        content: updatedContent,
      };

      const response = await defaultCommentRepo.updateComment(
        commentId,
        updateCommentData
      );

      if (response && response.data) {
        if (isReply) {
          // Cập nhật reply mới
          setReplyMap((prevReplyMap) => {
            const updatedReplies = prevReplyMap[parentId].map((reply) => {
              if (reply.id === commentId) {
                return { ...reply, content: updatedContent };
              }
              return reply;
            });
            return { ...prevReplyMap, [parentId]: updatedReplies };
          });
          // Hiển thị reply mới
          setComments((prev) => [...prev, { ...response.data, replies: [] }]);
        } else {
          // Cập nhật comment
          const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, content: updatedContent };
            }
            return comment;
          });
          setComments(updatedComments);
        }
        fetchComments();
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (isEditModalVisible) {
      console.log("Edit modal is now visible.");
    }
  }, [isEditModalVisible]);

  const handleDelete = (commentId: string) => {
    Modal.confirm({
      title: `${localStrings.PostDetails.DeleteComment}`,
      content: "",
      okText: `${localStrings.PostDetails.Yes}`,
      cancelText: `${localStrings.PostDetails.No}`,
      onCancel: () => {},
      onOk: () => {
        defaultCommentRepo.deleteComment(commentId).then(() => {
          // Cập nhật trạng thái comments
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          );

          // Cập nhật trạng thái replyMap
          if (replyMap[commentId]) {
            setReplyMap((prevReplyMap) => {
              const updatedReplies = prevReplyMap[commentId].filter(
                (reply) => reply.id !== commentId
              );
              return { ...prevReplyMap, [commentId]: updatedReplies };
            });
          }
        });
      },
    });
  };

  const handleAddComment = async (comment: string) => {
    if (comment.trim()) {
      const commentData: CreateCommentsRequestModel = {
        post_id: postId,
        content: comment,
      };

      try {
        const response = await defaultCommentRepo.createComment(commentData);
        if (!response.error) {
          const newComment = { ...response.data, replies: [] };
          setComments((prev) => [...prev, newComment]); // Cập nhật lại state comments
          fetchComments(); // Gọi lại hàm fetchComments để cập nhật lại danh sách comment
        } else {
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        setNewComment("");
      }
    }
  };

  const handleAddReply = async (comment: string, id: string) => {
    if (comment.trim()) {
      const parentId = replyToReplyId || replyToCommentId;

      const commentData: CreateCommentsRequestModel = {
        post_id: postId,
        content: comment,
        parent_id: parentId,
      };
      try {
        const response = await defaultCommentRepo.createComment(commentData);
        if (!response.error) {
          const newComment = { ...response.data, replies: [] };
          setComments((prev) => {
            const parentComment = prev.find(
              (comment) => comment.id === parentId
            );
            return [...prev];
          });
          // Cập nhật lại danh sách reply cho comment cha
          const updatedReplies = [
            ...(replyMap[parentId || ""] || []),
            newComment,
          ];
          setReplyMap((prevReplyMap) => ({
            ...prevReplyMap,
            [parentId || ""]: updatedReplies,
          }));
          fetchComments(); // Gọi lại hàm fetchComments để cập nhật lại danh sách comment
        } else {
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        setNewComment("");
        setReplyToReplyId(null);
      }
    }
  };

  const fetchUserLikePosts = async (postId: string) => {
    const response = await defaultPostRepo.getPostLikes({
      postId: postId,
      page: 1,
      limit: 10,
    }); 
    setUserLikePost(response?.data);
  };

  useEffect(() => {
    fetchUserLikePosts(postId);
  }, [postId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (replyToCommentId) {
      setReplyContent(e.target.value);
    } else {
      setNewComment(e.target.value);
    }
  };

  const handlePostAction = () => {
    if (replyToCommentId) {
      handleAddReply(replyContent, replyToCommentId);
      setReplyToCommentId(null);
      setReplyContent("");
    } else {
      handleAddComment(newComment);
      setNewComment("");
    }
  };

  return {
    comments,
    replyMap,
    likeCount,
    userLikes,
    newComment,
    isEditModalVisible,
    editCommentContent,
    handleLike,
    handleDelete,
    handleEditComment,
    setEditCommentContent,
    replyContent,
    setReplyContent,
    handlePostAction,
    handleTextChange,
    setReplyToCommentId,
    setReplyToReplyId,
    replyToCommentId,
    replyToReplyId,
    fetchReplies,
    setEditModalVisible,
    handleUpdate,
    toggleRepliesVisibility,
    handleReplyClick,
    handleShowEditModal,
    handleOutsideClick,
    setVisibleReplies,
    visibleReplies, 
  };
};



export default PostDetailsViewModel;