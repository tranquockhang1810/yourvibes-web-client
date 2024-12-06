import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth/useAuth";
//Comments
import { CommentsResponseModel } from "@/api/features/comment/models/CommentResponseModel";
import { defaultCommentRepo } from "@/api/features/comment/CommentRepo";
import { CreateCommentsRequestModel } from "@/api/features/comment/models/CreateCommentsModel";
import { UpdateCommentsRequestModel } from "@/api/features/comment/models/UpdateCommentsModel";
//LikeComments
import { defaultLikeCommentRepo } from "@/api/features/likeComment/LikeCommentRepo";
import { LikeCommentResponseModel } from "@/api/features/likeComment/models/LikeCommentResponses";
import { useRouter } from "next/navigation";
import { InputRef } from "antd";

const usePostDetailsViewModel = (
  postId: string,
  replyToCommentId: string | null
) => {
  //const { showActionSheetWithOptions } = useActionSheet();
  const [comments, setComments] = useState<CommentsResponseModel[]>([]);
  const router = useRouter();

  const [replyMap, setReplyMap] = useState<{
    [key: string]: CommentsResponseModel[];
  }>({});

  const [likeCount, setLikeCount] = useState<{ [key: string]: number }>({});
  const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});
  const [newComment, setNewComment] = useState("");
  const [replyToReplyId, setReplyToReplyId] = useState<string | null>(null);
  const [setReplyToCommentId] = useState<string | null>(null);

  const [likeIcon, setLikeIcon] = useState("heart-outline");
  const textInputRef = useRef<InputRef>(null);
  const [renderLikeIconState, setRenderLikeIconState] = useState(false);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [currentCommentId, setCurrentCommentId] = useState("");

  const { user, localStrings } = useAuth();

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
      // Toast.show({
      //   type: "error",
      //   text1: `${localStrings.PostDetails.ErrorReplies}`,
      // });
      console.error("Error fetching replies:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // const handleAction = (comment: CommentsResponseModel) => {
  //   const options = [
  //     `${localStrings.PostDetails.ReportComment}`,
  //     `${localStrings.PostDetails.EditComment}`,
  //     `${localStrings.PostDetails.DeleteComment}`,
  //     `${localStrings.PostDetails.Cancel}`,
  //   ];
  //   const reply = replyMap[comment?.id];

  //   if (comment && comment.user?.id !== user?.id) {
  //     options.splice(1, 1);
  //   } else if (reply && reply.length > 0 && reply[0].user?.id !== user?.id) {
  //     options.splice(1, 1);
  //   }

  //   showActionSheetWithOptions(
  //     {
  //       title: `${localStrings.PostDetails.ActionOptions}`,
  //       options: options,
  //       cancelButtonIndex: options.length - 1,
  //       cancelButtonTintColor: "#F95454",
  //     },
  //     (buttonIndex) => {
  //       switch (buttonIndex) {
  //         case 0:
  //           const commentToReport = comments.find(
  //             (cmt) => cmt.id === comment.id
  //           );
  //           if (commentToReport) {
  //             router.push(`/report?commentId=${comment.id}`);
  //           }
  //           break;

  //         case 1:
  //           setEditCommentContent(comment.content);
  //           setCurrentCommentId(comment.id);
  //           setEditModalVisible(true);
  //           break;

  //         case 2:
  //           handleDelete(comment.id);
  //           break;

  //         default:
  //           break;
  //       }
  //     }
  //   );
  // };

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
        // Toast.show({
        //   type: "success",
        //   text1: `${localStrings.PostDetails.EditCommentSuccess}`,
        // });
        fetchComments();
      }
    } catch (error) {
      // Toast.show({
      //   type: "error",
      //   text1: `${localStrings.PostDetails.EditCommentFailed}`,
      // });
    }
  };

  useEffect(() => {
    if (isEditModalVisible) {
      console.log("Edit modal is now visible.");
    }
  }, [isEditModalVisible]);

  // const handleDelete = (commentId: string) => {
  //   showActionSheetWithOptions(
  //     {
  //       title: `${localStrings.PostDetails.DeleteComment}`,
  //       options: [
  //         `${localStrings.PostDetails.Yes}`,
  //         `${localStrings.PostDetails.No}`,
  //       ],
  //       cancelButtonIndex: 1,
  //       cancelButtonTintColor: "#F95454",
  //     },
  //     (buttonIndex) => {
  //       if (buttonIndex === 0) {
  //         defaultCommentRepo
  //           .deleteComment(commentId)
  //           .then(() => {
  //             // Cập nhật trạng thái comments
  //             setComments((prevComments) =>
  //               prevComments.filter((comment) => comment.id !== commentId)
  //             );

  //             // Cập nhật trạng thái replyMap
  //             if (replyMap[commentId]) {
  //               setReplyMap((prevReplyMap) => {
  //                 const updatedReplies = prevReplyMap[commentId].filter(
  //                   (reply) => reply.id !== commentId
  //                 );
  //                 return { ...prevReplyMap, [commentId]: updatedReplies };
  //               });
  //             } else {
  //               // Nếu không có replies, cập nhật trạng thái replyMap để xóa commentId
  //               setReplyMap((prevReplyMap) => {
  //                 const updatedReplyMap = { ...prevReplyMap };
  //                 delete updatedReplyMap[commentId];
  //                 return updatedReplyMap;
  //               });
  //             }

  //             // Cập nhật lại danh sách replies của comment
  //             const parentId = replyToCommentId || replyToReplyId;
  //             if (parentId) {
  //               const updatedReplies = replyMap[parentId].filter(
  //                 (reply) => reply.id !== commentId
  //               );
  //               setReplyMap((prevReplyMap) => ({
  //                 ...prevReplyMap,
  //                 [parentId]: updatedReplies,
  //               }));
  //               fetchReplies(postId, parentId);
  //             }

  //             Toast.show({
  //               type: "success",
  //               text1: `${localStrings.PostDetails.DeteleReplySuccess}`,
  //             });
  //           })
  //           .catch((error) => {
  //             Toast.show({
  //               type: "error",
  //               text1: `${localStrings.PostDetails.DeteleReplyFailed}`,
  //             });
  //           });
  //       }
  //     }
  //   );
  // };

  const handleAddComment = async (comment: string) => {
    if (comment.trim()) {
      const commentData: CreateCommentsRequestModel = {
        post_id: postId,
        content: comment,
      };

      try {
        const response = await defaultCommentRepo.createComment(commentData);
        if (!response.error) {
          // Toast.show({
          //   type: "success",
          //   text1: `${localStrings.PostDetails.CommentSuccess}`,
          // });

          const newComment = { ...response.data, replies: [] };
          setComments((prev) => [...prev, newComment]); // Cập nhật lại state comments
          fetchComments(); // Gọi lại hàm fetchComments để cập nhật lại danh sách comment
        } else {
          // Toast.show({
          //   type: "error",
          //   text1: `${localStrings.PostDetails.CommentFailed}`,
          // });
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        // Toast.show({
        //   type: "error",
        //   text1: `${localStrings.PostDetails.CommentFailed}`,
        // });
      } finally {
        setNewComment("");
        textInputRef.current?.blur();
      }
    }
  };

  const handleAddReply = async (comment: string) => {
    if (comment.trim()) {
      const parentId = replyToReplyId || replyToCommentId;

      const commentData: CreateCommentsRequestModel = {
        post_id: postId,
        content: comment,
        parent_id: parentId,
      };

      // try {
      //   const response = await defaultCommentRepo.createComment(commentData);
      //   if (!response.error) {
      //     Toast.show({
      //       type: "success",
      //       text1: `${localStrings.PostDetails.ReplySuccess}`,
      //     });

      //     const newComment = { ...response.data, replies: [] };
      //     setComments((prev) => {
      //       const parentComment = prev.find(
      //         (comment) => comment.id === parentId
      //       );
      //       return [...prev];
      //     });
      //     fetchComments(); // Gọi lại hàm fetchComments để cập nhật lại danh sách comment
      //   } else {
      //     Toast.show({
      //       type: "error",
      //       text1: `${localStrings.PostDetails.ReplyFailed}`,
      //     });
      //   }
      // } catch (error) {
      //   console.error("Error adding comment:", error);
      //   Toast.show({
      //     type: "error",
      //     text1: `${localStrings.PostDetails.ReplyFailed}`,
      //   });
      // }
      try {
        const response = await defaultCommentRepo.createComment(commentData);
        if (!response.error) {
          // Toast.show({
          //   type: "success",
          //   text1: `${localStrings.PostDetails.ReplySuccess}`,
          // });

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
          // Toast.show({
          //   type: "error",
          //   text1: `${localStrings.PostDetails.ReplyFailed}`,
          // });
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        // Toast.show({
        //   type: "error",
        //   text1: `${localStrings.PostDetails.ReplyFailed}`,
        // });
      } finally {
        setNewComment("");
        setReplyToReplyId(null);
        textInputRef.current?.blur();
      }
    }
  };

  return {
    comments,
    likeCount,
    userLikes,
    newComment,
    replyToCommentId,
    replyToReplyId,
    textInputRef,
    handleLike,
    handleAddComment,
    handleAddReply,
    setNewComment,
    setReplyToCommentId,
    setReplyToReplyId,
    fetchReplies,
    handleUpdate,
    // handleDelete,
    // handleAction,
    isEditModalVisible,
    setEditModalVisible,
    editCommentContent,
    setEditCommentContent,
    handleEditComment,
    currentCommentId,
    replyMap,
    likeIcon,
    fetchComments,
  };
};

export default usePostDetailsViewModel;
