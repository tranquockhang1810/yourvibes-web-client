import React, { useEffect, useState } from "react";
import Post from "@/components/common/post/views/Post";
import { Avatar, Col, Row } from "antd";
import { FaEdit, FaHeart, FaReply, FaTrash, FaFlag } from "react-icons/fa";
import PostDetailsViewModel from "@/components/screens/postDetails/viewModel/postDetailsViewModel";
import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import { PostResponseModel } from "@/api/features/post/models/PostResponseModel";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import ReportViewModel from "@/components/screens/report/ViewModel/reportViewModel";
import { useRouter } from "next/navigation";
import { Modal, Input, Button } from "antd";
interface CommentsScreenProps {
  postId?: string;
}

const { brandPrimary, brandPrimaryTap, lightGray, backgroundColor } =
  useColor();
const PostDetailsScreen: React.FC<CommentsScreenProps> = ({ postId }) => {
  const {
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
  } = PostDetailsViewModel(postId || "");
  const [post, setPost] = useState<PostResponseModel | null>(null);
  const [loading, setLoading] = useState(false);
  const { localStrings } = useAuth();
  const reportViewModel = ReportViewModel(defaultPostRepo);
  
  const [visibleReplies, setVisibleReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      const post = await defaultPostRepo.getPostById(postId);
      if (!post.error) {
        setPost(post.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  const toggleRepliesVisibility = (commentId: string) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const reportComment = (commentId: string) => {
    router.push(`/report?commentId=${commentId}`);
  };

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  return (
    <div className="comments-container bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <Post post={post || undefined} />
      <div className="comments-list space-y-6 overflow-y-auto max-h-[50vh]">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="comment-item bg-gray-50 p-4 rounded-lg shadow-sm text-sm hover:shadow-md"
          >
            <div className="comment-header flex items-center mb-3">
              <Avatar src={comment.user.avatar_url} size="small" />
              <div className="ml-3">
                <p className="text-gray-800 font-semibold">
                  {comment.user.family_name} {comment.user.name}
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="comment-content">
              <p className="text-gray-800 mb-3">{comment.content}</p>
              <div className="comment-actions flex space-x-4 text-xs">
                <Row>
                  <Col span={4} className="hover:cursor-pointer">
                    <FaHeart
                      size={16}
                      color={userLikes[comment.id] ? "red" : "white"}
                      style={{
                        stroke: "black",
                        strokeWidth: 2,
                        marginRight: 50,
                      }}
                      onClick={() => handleLike(comment.id)}
                    />
                  </Col>
                  <Col span={4} className="hover:cursor-pointer">
                    <FaTrash
                      size={16}
                      color="gray"
                      style={{
                        stroke: "black",
                        strokeWidth: 2,
                        marginRight: 50,
                      }}
                      onClick={() => handleDelete(comment.id)}
                    />
                  </Col>
                  <Col span={4} className="hover:cursor-pointer">
                    <Col span={4} className="hover:cursor-pointer">
                      <FaEdit
                        size={16}
                        color="gray"
                        style={{
                          stroke: "black",
                          strokeWidth: 2,
                          marginRight: 50,
                        }}
                        onClick={() =>
                          handleEditComment(comment.id)
                        }
                      />
                    </Col>
                  </Col>
                  <Col span={4} className="hover:cursor-pointer">
                    <FaReply
                      size={16}
                      color="gray"
                      style={{
                        stroke: "black",
                        strokeWidth: 2,
                        marginRight: 50,
                      }}
                      onClick={() => handleReplyClick(comment.id)}
                    />
                  </Col>
                  <Col span={4} className="hover:cursor-pointer">
                    <FaFlag
                      size={16}
                      color="gray"
                      style={{
                        stroke: "black",
                        strokeWidth: 2,
                        marginRight: 50,
                      }}
                      onClick={() => reportComment(comment.id)}
                    />
                  </Col>
                  <Col span={4}>
                    <span
                      style={{
                        color: brandPrimaryTap,
                        fontSize: 12,
                        opacity: 0.5,
                        marginRight: 50,
                      }}
                    >
                      {likeCount[comment.id]}
                    </span>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="replies pl-6 mt-3 border-l-2 border-gray-200">
              {replyMap[comment.id]?.length > 0 && (
                <button
                  onClick={() => toggleRepliesVisibility(comment.id)}
                  className="show-replies-btn text-blue-500 text-xs mb-2"
                >
                  {visibleReplies[comment.id] ? "Hide Replies" : "Show Replies"}
                </button>
              )}
              {visibleReplies[comment.id] &&
                replyMap[comment.id]?.map((reply) => (
                  <div
                    key={reply.id}
                    className="reply-item bg-gray-100 p-3 rounded-lg mt-2 text-sm"
                  >
                    <div className="reply-header flex items-center mb-3">
                      <Avatar src={reply.user.avatar_url} size="small" />
                      <div className="ml-3">
                        <p className="text-gray-800 font-semibold">
                          {reply.user.family_name} {reply.user.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(reply.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700">{reply.content}</p>
                    <div className="reply-actions flex space-x-4 text-xs">
                      <Row>
                        <Col span={4} className="hover:cursor-pointer">
                          <FaHeart
                            size={16}
                            color={userLikes[reply.id] ? "red" : "white"}
                            style={{
                              stroke: "black",
                              strokeWidth: 2,
                              marginRight: 50,
                            }}
                            onClick={() => handleLike(reply.id)}
                          />
                        </Col>
                        <Col span={4} className="hover:cursor-pointer">
                          <FaTrash
                            size={16}
                            color="gray"
                            style={{
                              stroke: "black",
                              strokeWidth: 2,
                              marginRight: 50,
                            }}
                            onClick={() => handleDelete(reply.id)}
                          />
                        </Col>
                        <Col span={4} className="hover:cursor-pointer">
                          <FaEdit
                            size={16}
                            color="gray"
                            style={{
                              stroke: "black",
                              strokeWidth: 2,
                              marginRight: 50,
                            }}
                            onClick={() => handleEditComment(reply.id)}
                          />
                        </Col>
                        <Col span={4} className="hover:cursor-pointer">
                          <FaReply
                            size={16}
                            color="gray"
                            style={{
                              stroke: "black",
                              strokeWidth: 2,
                              marginRight: 50,
                            }}
                            onClick={() => handleReplyClick(reply.id, true)}
                          />
                        </Col>
                        <Col span={4} className="hover:cursor-pointer">
                          <FaFlag
                            size={16}
                            color="gray"
                            style={{
                              stroke: "black",
                              strokeWidth: 2,
                              marginRight: 50,
                            }}
                            onClick={() => reportComment(reply.id)}
                          />
                        </Col>
                        <Col span={4}>
                          <span
                            style={{
                              color: brandPrimaryTap,
                              fontSize: 12,
                              opacity: 0.5,
                              marginRight: 50,
                            }}
                          >
                            {likeCount[reply.id]}
                          </span>
                        </Col>
                      </Row>
                    </div>
                    <div className="replies pl-6 mt-3 border-l-2 border-gray-200">
                      {replyMap[reply.id]?.length > 0 && (
                        <button
                          onClick={() => toggleRepliesVisibility(reply.id)}
                          className="show-replies-btn text-blue-500 text-xs mb-2"
                        >
                          {visibleReplies[reply.id]
                            ? "Hide Replies"
                            : "Show Replies"}
                        </button>
                      )}
                      {visibleReplies[reply.id] &&
                        replyMap[reply.id]?.map((nestedReply) => (
                          <div
                            key={nestedReply.id}
                            className="reply-item bg-gray-100 p-3 rounded-lg mt-2 text-sm"
                          >
                            <div className="reply-header flex items-center mb-3">
                              <Avatar
                                src={nestedReply.user.avatar_url}
                                size="small"
                              />
                              <div className="ml-3">
                                <p className="text-gray-800 font-semibold">
                                  {nestedReply.user.family_name}{" "}
                                  {nestedReply.user.name}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {new Date(
                                    nestedReply.created_at
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-700">
                              {nestedReply.content}
                            </p>
                            <div className="reply-actions flex space-x-4 text-xs">
                              <Row>
                                <Col span={4} className="hover:cursor-pointer">
                                  <FaHeart
                                    size={16}
                                    color={
                                      userLikes[nestedReply.id]
                                        ? "red"
                                        : "white"
                                    }
                                    style={{
                                      stroke: "black",
                                      strokeWidth: 2,
                                      marginRight: 50,
                                    }}
                                    onClick={() => handleLike(nestedReply.id)}
                                  />
                                </Col>
                                <Col span={4} className="hover:cursor-pointer">
                                  <FaTrash
                                    size={16}
                                    color="gray"
                                    style={{
                                      stroke: "black",
                                      strokeWidth: 2,
                                      marginRight: 50,
                                    }}
                                    onClick={() => handleDelete(nestedReply.id)}
                                  />
                                </Col>
                                <Col span={4} className="hover:cursor-pointer">
                                  <FaEdit
                                    size={16}
                                    color="gray"
                                    style={{
                                      stroke: "black",
                                      strokeWidth: 2,
                                      marginRight: 50,
                                    }}
                                    onClick={() =>
                                      handleEditComment(nestedReply.id)
                                    }
                                  />
                                </Col>
                                <Col span={4} className="hover:cursor-pointer">
                                  <FaReply
                                    size={16}
                                    color="gray"
                                    style={{
                                      stroke: "black",
                                      strokeWidth: 2,
                                      marginRight: 50,
                                    }}
                                    onClick={() =>
                                      handleReplyClick(nestedReply.id, true)
                                    }
                                  />
                                </Col>
                                <Col span={4} className="hover:cursor-pointer">
                                  <FaFlag
                                    size={16}
                                    color="gray"
                                    style={{
                                      stroke: "black",
                                      strokeWidth: 2,
                                      marginRight: 50,
                                    }}
                                    onClick={() =>
                                      reportComment(nestedReply.id)
                                    }
                                  />
                                </Col>
                                <Col span={4}>
                                  <span
                                    style={{
                                      color: brandPrimaryTap,
                                      fontSize: 12,
                                      opacity: 0.5,
                                      marginRight: 50,
                                    }}
                                  >
                                    {likeCount[nestedReply.id]}
                                  </span>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="add-comment mt-8">
        <textarea
          className="comment-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder={
            replyToCommentId || replyToReplyId
              ? "Write your reply here..."
              : "Write your comment here..."
          }
          value={replyToCommentId || replyToReplyId ? replyContent : newComment}
          onChange={handleTextChange}
        />
        <button
          onClick={handlePostAction}
          className="post-btn mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {localStrings?.Public?.Conform ||
            (replyToCommentId || replyToReplyId ? "Reply" : "Post")}
        </button>
      </div>
      {isEditModalVisible && (
        <div className="edit-modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-6 rounded-lg shadow-md w-96 max-h-[80vh]">
            <div className="modal-scrollable-content overflow-y-auto max-h-[60vh]">
              <textarea
                className="edit-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleEditComment(editCommentContent)}
              className="save-btn mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      )} 
    </div>
  );
};

export default PostDetailsScreen;