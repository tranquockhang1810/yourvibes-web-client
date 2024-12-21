import React, { useEffect, useState } from "react";
import Post from "@/components/common/post/views/Post";
import { Avatar, Col, Row } from "antd";
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa";
import PostDetailsViewModel from "@/components/screens/postDetails/viewModel/postDetailsViewModel";
import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import { PostResponseModel } from "@/api/features/post/models/PostResponseModel";

interface CommentsScreenProps {
  postId?: string;
  post?: PostResponseModel;
}

const { brandPrimary, brandPrimaryTap, lightGray, backgroundColor } = useColor();

const PostDetailsScreen: React.FC<CommentsScreenProps> = ({ postId, post }) => {
  const {
    comments,
    replyMap,
    likeCount,
    userLikes,
    newComment,
    isEditModalVisible,
    editCommentContent,
    handleAddComment,
    handleAddReply,
    handleLike,
    handleDelete,
    handleEditComment,
    setNewComment,
    setEditCommentContent,
    replyContent,
    setReplyContent,
  } = PostDetailsViewModel(postId || "");

  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const { localStrings } = useAuth();
  const [likedPost, setLikedPost] = useState<PostResponseModel | undefined>(undefined); 
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (replyToCommentId) {
      setReplyContent(e.target.value);  
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

  const handleReplyClick = (commentId: string) => {
    setReplyToCommentId(commentId);
    setReplyContent("");   
  };
 

  return (
    <div className="comments-container bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <Post post={post} />
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
                    <FaEdit
                      size={16}
                      color="gray"
                      style={{
                        stroke: "black",
                        strokeWidth: 2,
                        marginRight: 50,
                      }}
                      onClick={() => handleEditComment(comment.id)}
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
                      onClick={() => setReplyToCommentId(comment.id)} 
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
              {replyMap[comment.id]?.map((reply) => (
                <div
                  key={reply.id}
                  className="reply-item bg-gray-100 p-3 rounded-lg mt-2 text-sm"
                >
                  <p className="text-gray-700">{reply.content}</p>
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
            replyToCommentId
              ? "Write your reply here..."
              : "Write your comment here..."
          }
          value={replyToCommentId ? replyContent : newComment}
          onChange={handleTextChange}
        />
        <button
          onClick={handlePostAction}
          className="post-btn mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {localStrings?.Public?.Conform ||
            (replyToCommentId ? "Reply" : "Post")}
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