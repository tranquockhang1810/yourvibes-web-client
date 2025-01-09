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
import ReportScreen from "../../report/views/Report";
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
    setEditModalVisible,
    handleUpdate,
    toggleRepliesVisibility,
    handleReplyClick,
    handleShowEditModal,
    handleOutsideClick,
    setVisibleReplies,
    visibleReplies,
    fetchComments,
    heartColors,
  } = PostDetailsViewModel(postId || "", defaultPostRepo);


  const [post, setPost] = useState<PostResponseModel | null>(null);
  const [loading, setLoading] = useState(false);
  const { localStrings } = useAuth();
  const reportViewModel = ReportViewModel();
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );

  const [isReplyModalVisible, setReplyModalVisible] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;

  const { showModal, setShowModal } = ReportViewModel();
  const router = useRouter();
  const [currentCommentId, setCurrentCommentId] = useState<string>("");
  const reportComment = (commentId: string) => {
    <Modal
      centered
      title={localStrings.Public.ReportFriend}
      open={showModal}
      onCancel={() => setShowModal(false)}
      footer={null}
    >
      <ReportScreen commentId={commentId} setShowModal={setShowModal} />
    </Modal>
  };

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

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      comments.forEach((comment) => {
        fetchReplies(postId, comment.id);
      });
    }
  }, [postId, comments]);
 

  return (
    <div className="comments-container bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <Post noComment={true} post={post || undefined} />

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
                  <Col span={4} className="hover:cursor-pointer" style={{ display: 'flex', alignItems: 'center' }}>
                    <FaHeart
                      size={16}
                      color={heartColors[comment.id] || 'gray'}
                      style={{
                        stroke: "black",
                        strokeWidth: 2,
                        marginRight: 5,
                      }}
                      onClick={() => handleLike(comment.id)}
                    />
                    <span
                      style={{
                        color: brandPrimaryTap,
                        fontSize: 12,
                        opacity: 0.5,
                      }}
                    >
                      {/* {likeCount[comment.id]} */}
                    </span>
                  </Col>
                  {userId === comment.user?.id ? (
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
                  ) : null}
                  <Col span={4} className="hover:cursor-pointer">
                    <Col span={4} className="hover:cursor-pointer">
                      {userId === comment.user?.id ? (
                        <FaEdit
                          size={16}
                          color="gray"
                          style={{
                            stroke: "black",
                            strokeWidth: 2,
                            marginRight: 50,
                          }}
                          onClick={() =>
                            handleShowEditModal(comment.id, comment.content)
                          }
                        />
                      ) : (
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
                      )}
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
                      onClick={() => {
                        setSelectedCommentId(comment.id);
                        handleReplyClick(comment.id);
                        setReplyModalVisible(true);
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </div>
            <div
              onClick={handleOutsideClick}
              className="replies pl-6 mt-3 border-l-2 border-gray-200"
            >
              {replyMap[comment.id]?.length > 0 && (
                <button
                  onClick={() => {
                    toggleRepliesVisibility(comment.id);
                    if (visibleReplies[comment.id]) {
                      fetchReplies(postId || "", comment.id);
                    } else {
                      fetchComments();
                    }
                  }}
                  className="show-replies-btn text-blue-500 text-xs mb-2"
                >
                  {visibleReplies[comment.id] ? `${localStrings.PostDetails.HideReplies}` : `${localStrings.PostDetails.ViewReplies}`}
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
                    <div className="reply-actions mt-3 flex space-x-4 text-xs">
                      <Row>
                        <Col span={4} className="hover:cursor-pointer">
                          <FaHeart
                            size={16}
                            color={heartColors[reply.id] || 'gray'}
                            style={{
                              stroke: "black",
                              strokeWidth: 2,
                              marginRight: 5,
                            }}
                            onClick={() => handleLike(reply.id)}
                          />
                          <span
                            style={{
                              color: brandPrimaryTap,
                              fontSize: 12,
                              opacity: 0.5,
                            }}
                          >
                            {/* {likeCount[reply.id]} */}
                          </span>
                        </Col>
                        {userId === reply.user?.id ? (
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
                        ) : null}
                        <Col span={4} className="hover:cursor-pointer">
                          {userId === reply.user?.id ? (
                            <FaEdit
                              size={16}
                              color="gray"
                              style={{
                                stroke: "black",
                                strokeWidth: 2,
                                marginRight: 50,
                              }}
                              onClick={() =>
                                handleShowEditModal(reply.id, reply.content)
                              }
                            />
                          ) : (
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
                          )}
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
                            onClick={() => {
                              setSelectedCommentId(reply.id);
                              handleReplyClick(reply.id);
                              setReplyModalVisible(true);
                            }}
                          />
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
                            <div className="reply-actions mt-3 flex space-x-4 text-xs">
                              <Row>
                                <Col span={4} className="hover:cursor-pointer">
                                  <FaHeart
                                    size={16}
                                    color={heartColors[nestedReply.id] || 'gray'}
                                    style={{
                                      stroke: "black",
                                      strokeWidth: 2,
                                      marginRight: 5,
                                    }}
                                    onClick={() => handleLike(nestedReply.id)}
                                  />
                                  <span
                                    style={{
                                      color: brandPrimaryTap,
                                      fontSize: 12,
                                      opacity: 0.5,
                                    }}
                                  >
                                    {/* {likeCount[nestedReply.id]} */}
                                  </span>
                                </Col>
                                {userId === nestedReply.user?.id ? (
                                  <Col
                                    span={4}
                                    className="hover:cursor-pointer"
                                  >
                                    <FaTrash
                                      size={16}
                                      color="gray"
                                      style={{
                                        stroke: "black",
                                        strokeWidth: 2,
                                        marginRight: 50,
                                      }}
                                      onClick={() =>
                                        handleDelete(nestedReply.id)
                                      }
                                    />
                                  </Col>
                                ) : null}

                                <Col span={4} className="hover:cursor-pointer">
                                  {userId === nestedReply.user?.id ? (
                                    <FaEdit
                                      size={16}
                                      color="gray"
                                      style={{
                                        stroke: "black",
                                        strokeWidth: 2,
                                        marginRight: 50,
                                      }}
                                      onClick={() =>
                                        handleShowEditModal(
                                          nestedReply.id,
                                          nestedReply.content
                                        )
                                      }
                                    />
                                  ) : (
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
                                  )}
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
                                    onClick={() => {
                                      setSelectedCommentId(nestedReply.id);
                                      handleReplyClick(nestedReply.id);
                                      setReplyModalVisible(true);
                                    }}
                                  />
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
      {/* Phản hồi đến bình luận */}
      <div className="add-comment mt-8">
        <textarea
          className="comment-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder={
            replyToCommentId || replyToReplyId
              ? `${localStrings.Public.ReplyClick}`
              : `${localStrings.Public.CommentClick}`
          }
          value={replyToCommentId || replyToReplyId ? replyContent : newComment}
          onChange={handleTextChange}
        />
        <button
          onClick={handlePostAction}
          className="post-btn mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800"
        >
          {localStrings.Public.Comment ||
            (replyToCommentId || replyToReplyId ? "Reply" : "Post")}
        </button>
      </div>
      {/*Modal Reply*/}
      {isReplyModalVisible && (
        <Modal
          title={`${localStrings.Public.Reply}`}
          centered
          visible={isReplyModalVisible}
          onCancel={() => setReplyModalVisible(false)}
          onOk={() => {
            handlePostAction();
            setReplyModalVisible(false);
            setVisibleReplies((prev) => ({
              ...prev,
              ...Object.keys(prev).reduce(
                (acc, key) => ({ ...acc, [key]: true }),
                {}
              ),
            }));
          }}
        >
          <textarea
            className="comment-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={replyContent}
            placeholder={`${localStrings.Public.ReplyClick}`}
            onChange={(e) => setReplyContent(e.target.value)}
            style={{ border: "0.5px solid gray", height: 100, width: "100%" }}
          />
        </Modal>
      )}

      {/* Modal Edit */}
      {isEditModalVisible && (
        <Modal
          title={`${localStrings.PostDetails.EditComment}`}
          centered
          visible={isEditModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onOk={() => {
            handleUpdate(
              currentCommentId,
              editCommentContent,
              replyToCommentId || ""
            );
            setEditModalVisible(false);
          }}
        >
          <textarea
            className="comment-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={editCommentContent}
            onChange={(e) => setEditCommentContent(e.target.value)}
            style={{ border: "1px solid gray", height: 100, width: "100%" }}
          />
        </Modal>
      )}
    </div>
  );
};


export default PostDetailsScreen;