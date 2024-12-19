import React, { useEffect } from "react";
import CommentsViewModel from "@/components/screens/comments/viewModel/commentsViewModel";
import { CommentsResponseModel } from "@/api/features/comment/models/CommentResponseModel";

interface CommentsScreenProps {
  postId?: string; // ID của bài viết
}

const CommentsScreen: React.FC<CommentsScreenProps> = ({ postId }) => {
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
  } = postId
    ? CommentsViewModel(postId, null)
    : {
        comments: [],
        replyMap: {},
        likeCount: {},
        userLikes: {},
        newComment: "",
        isEditModalVisible: false,
        editCommentContent: "",
        handleAddComment: () => {},
        handleAddReply: () => {},
        handleLike: () => {},
        handleDelete: () => {},
        handleEditComment: () => {},
        setNewComment: () => {},
        setEditCommentContent: () => {},
      };

  useEffect(() => {
    // Fetch initial comments data if needed
  }, []);

  return (
    <div className="comments-container bg-gray-100 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>

      {/* Comments List */}
      <div className="comments-list space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item bg-white p-4 rounded-lg shadow">
            <div className="comment-content">
              <p className="text-gray-700">{comment.content}</p>

              <div className="comment-actions flex space-x-2 mt-2">
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`action-btn like-btn text-sm px-3 py-1 rounded-md ${
                    userLikes?.[comment.id] ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                  } hover:bg-red-200`}
                >
                  {userLikes?.[comment.id] ? "❤️" : "🤍"} {likeCount?.[comment.id] || 0}
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="action-btn delete-btn text-sm px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditCommentContent(comment.content)}
                  className="action-btn edit-btn text-sm px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleAddReply(comment.id)}
                  className="action-btn reply-btn text-sm px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Reply
                </button>
              </div>
            </div>

            <div className="replies pl-6 mt-3 border-l border-gray-200">
              {replyMap[comment.id]?.map((reply: CommentsResponseModel) => (
                <div key={reply.id} className="reply-item bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">{reply.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Comment */}
      <div className="add-comment mt-6">
        <textarea
          className="comment-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={() => handleAddComment(newComment)}
          className="post-btn mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Post
        </button>
      </div>

      {/* Edit Comment Modal */}
      {isEditModalVisible && (
        <div className="edit-modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <textarea
              className="edit-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editCommentContent}
              onChange={(e) => setEditCommentContent(e.target.value)}
            />
            <button
              onClick={() => handleEditComment(editCommentContent)}
              className="save-btn mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsScreen;
