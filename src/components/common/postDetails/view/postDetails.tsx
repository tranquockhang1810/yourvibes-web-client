"use client";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { PostResponseModel } from "@/api/features/post/models/PostResponseModel";
import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import { Avatar, Button, Card, Col, Form, Input, Row } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaGlobe, FaHeart, FaLock, FaRegHeart } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { getTimeDiff } from "@/utils/helper/DateTransfer";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import usePostDetailsViewModel from "../viewModel/postDetailsViewModel";

interface IPostDetail {
  postId: string;
}

const PostDetail: React.FC<IPostDetail> = ({ postId }) => {
  const { user, localStrings } = useAuth();
  const { brandPrimary, brandPrimaryTap } = useColor();

  const [post, setPost] = useState<PostResponseModel | null>(null);
  const {
    comments,
    userLikes,
    handleLike,
    handleAction,
    handleAddComment,
    handleAddReply,
    setNewComment,
    setReplyToReplyId,
    handleUpdate,
    fetchReplies,
    currentCommentId,
    isEditModalVisible,
    setEditModalVisible,
    replyMap,
    likeCount,
    fetchComments,
    replyToReplyId,
    setEditCommentContent,
    editCommentContent,
    userLikePost,
  } = usePostDetailsViewModel(postId, user?.id || "");


  const renderPrivacyIcon = () => {
    switch (post?.privacy) {
      case Privacy.PUBLIC:
        return <FaGlobe size={12} color={brandPrimaryTap} />;
      case Privacy.FRIEND_ONLY:
        return <BsFillPeopleFill size={12} color={brandPrimaryTap} />;
      case Privacy.PRIVATE:
        return <FaLock size={12} color={brandPrimaryTap} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ margin: 20 }}>
      {post && (
        <Card
          style={{ maxWidth: 600, margin: "0 auto", borderColor: brandPrimary }}
          title={
            <Row gutter={[8, 8]}>
              <Col span={4}>
                <Avatar src={post.user?.avatar_url} shape="circle" />
              </Col>
              <Col span={20}>
                <div style={{ fontWeight: "bold", fontSize: 16 }}>
                  {post.user?.name}
                </div>
                <div style={{ color: brandPrimaryTap, fontSize: 12 }}>
                  {getTimeDiff(post.created_at, localStrings)}{" "}
                  {renderPrivacyIcon()}
                </div>
              </Col>
            </Row>
          }
        >
          <p>{post.content}</p>

          <Row justify="space-between">
            <Col>
              <div style={{ cursor: "pointer" }}>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      <div style={{ marginTop: 20, maxWidth: 600, margin: "0 auto" }}>
        <Form onFinish={handleAddComment}>
          <Form.Item>
            <Input.TextArea
              rows={3}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
          >
            llll
          </Button>
        </Form>

        <div style={{ marginTop: 20 }}>
          {comments.map((comment, index) => (
            <Card key={index} style={{ marginBottom: 10 }}>
              <Row>
                <Col span={4}>
                  <Avatar src={comment.user?.avatar_url} shape="circle" />
                </Col>
                <Col span={20}>
                  <div style={{ fontWeight: "bold" }}>{comment.user?.name}</div>
                  <div style={{ color: brandPrimaryTap, fontSize: 12 }}>
                    {getTimeDiff(comment.created_at, localStrings)}
                  </div>
                  <p>{comment.content}</p>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;