"use client";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { PostResponseModel } from "@/api/features/post/models/PostResponseModel";
import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Menu,
  MenuProps,
  Modal,
  Popover,
  Row,
  Tooltip,
  Select,
  Input,
} from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaGlobe,
  FaHeart,
  FaLock,
  FaRegComments,
  FaRegHeart,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getTimeDiff } from "@/utils/helper/DateTransfer";
import { RiAdvertisementLine } from "react-icons/ri";
import { HiDotsVertical } from "react-icons/hi";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import EditPostViewModel from "@/components/features/editpost/viewModel/EditPostViewModel";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import MediaView from "@/components/foundation/MediaView";
import HomeViewModel from "@/components/screens/home/viewModel/HomeViewModel";
import { defaultNewFeedRepo } from "@/api/features/newFeed/NewFeedRepo";
import EditPostScreen from "@/components/features/editpost/view/EditPostScreen";
import PostDetailsScreen from "@/components/screens/postDetails/view/postDetailsScreen";
interface IPost {
  post?: PostResponseModel;
  isParentPost?: boolean;
  noFooter?: boolean;
  children?: React.ReactNode;
}

const Post: React.FC<IPost> = React.memo(
  ({ post, isParentPost = false, noFooter = false, children }) => {
    const router = useRouter();
    const { brandPrimary, brandPrimaryTap, lightGray, backgroundColor } =
      useColor();
    const { user, localStrings } = useAuth();
    const [shareForm] = Form.useForm();
    const [showSharePopup, setShowSharePopup] = useState(false);

    const {
      deleteLoading,
      likePost,
      likedPost,
      setLikedPost,
      sharePost,
      shareLoading,
      deletePost,
      updatePost,
    } = EditPostViewModel(defaultPostRepo, post?.id || "");
    const { deleteNewFeed } = HomeViewModel(defaultNewFeedRepo);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [sharePostPrivacy, setSharePostPrivacy] = useState<Privacy>(
      Privacy.PUBLIC
    );
    const [shareContent, setShareContent] = useState("");
    const renderPrivacyIcon = () => {
      switch (likedPost?.privacy) {
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
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
    const handleCommentClick = useCallback(() => {
      setIsCommentModalVisible(true);
    }, []);

    const [isShareModalVisible, setIsShareModalVisible] = useState(false);

    const renderPrivacyText = () => {
      switch (sharePostPrivacy) {
        case Privacy.PUBLIC:
          return localStrings.Public.Everyone.toLowerCase();
        case Privacy.FRIEND_ONLY:
          return localStrings.Public.Friend.toLowerCase();
        case Privacy.PRIVATE:
          return localStrings.Public.Private.toLowerCase();
        default:
          return localStrings.Public.Everyone.toLowerCase();
      }
    };

    const handleLikeClick = useCallback(() => {
      if (likedPost?.id) {
        likePost(likedPost.id);
      }
    }, [likedPost?.id, likePost]);

    const renderLikeIcon = () => {
      if (likedPost?.is_liked) {
        return <FaHeart size={24} color={"red"} onClick={handleLikeClick} />;
      } else {
        return (
          <FaRegHeart
            size={24}
            color={brandPrimaryTap}
            onClick={handleLikeClick}
          />
        );
      }
    };

    const items: MenuProps["items"] = useMemo(() => {
      if (user?.id === likedPost?.user?.id)
        return [
          {
            key: "1",
            label: localStrings.Post.EditPost,
            type: "item",
            onClick: async () => {
              if (post && post.id) {
                setIsEditModalVisible(true); 
                <EditPostScreen 
                  id={post.id}  
                />;
              }
              Modal.confirm({
                title: localStrings.Public.Confirm,
                content: localStrings.Post.EditPost,
                okText: localStrings.Public.Confirm,
                cancelText: localStrings.Public.Cancel,
                onOk: () => { 
                  setIsEditModalVisible(true); 
                  <EditPostScreen 
                    id={post?.id as string}  
                  />
                },
              });
            },
          },
          {
            key: "2",
            label: localStrings.Post.DeletePost,
            type: "item",
            onClick: () => {
              Modal.confirm({
                centered: true,
                title: localStrings.Public.Confirm,
                content: localStrings.DeletePost.DeleteConfirm,
                okText: localStrings.Public.Confirm,
                cancelText: localStrings.Public.Cancel,
                onOk: () => {
                  deletePost && deletePost(post?.id as string);
                },
              });
            },
          },
          {
            key: "3",
            label: localStrings.Post.Advertisement,
            type: "item",
            onClick: () => {
              router.push(`/ads/${post?.id}`);
            },
          },
        ];
      else
        return [
          {
            key: "1",
            label: localStrings.Post.ReportPost,
            type: "item",
            onClick: () => {
              router.push(`/report?postId=${post?.id}`);
            },
          },
          {
            key: "2",
            label: localStrings.Post.DeleteNewFeed,
            type: "item",
            onClick: () => {
              Modal.confirm({
                centered: true,
                title: localStrings.Public.Confirm,
                content: localStrings.DeletePost.DeleteConfirm,
                okText: localStrings.Public.Confirm,
                cancelText: localStrings.Public.Cancel,
                onOk: () => {
                  deletePost && deletePost(post?.id as string);
                },
              });
            },
          },
        ];
    }, [user, likedPost]);

    useEffect(() => {
      setLikedPost(post);
    }, [post]);

    return (
      <Card
        style={{
          margin: 10,
          borderColor: isParentPost ? brandPrimary : "black",
          maxWidth: 600,
          width: "100%",
        }}
        title={
          <Row
            gutter={[8, 8]}
            className="m-2"
            // onClick={() => {
            //   setIsCommentModalVisible(false);
            //   router.push(`postDetails?postId=${likedPost?.id}`);
            // }}
          >
            <Col
              xs={4}
              md={2}
              className="hover:cursor-pointer"
              onClick={() => router.push(`/user/${likedPost?.user?.id}`)}
            >
              <Avatar src={likedPost?.user?.avatar_url} shape="circle" />
            </Col>
            <Col xs={18} md={21}>
              <Row>
                <Col
                  span={24}
                  className="hover:cursor-pointer hover:underline"
                  onClick={() => router.push(`/user/${likedPost?.user?.id}`)}
                >
                  <span style={{ fontWeight: "bold", fontSize: 14 }}>
                    {likedPost?.user?.family_name} {likedPost?.user?.name}
                  </span>
                </Col>
                <Col span={24}>
                  {likedPost?.is_advertisement ? (
                    <div className="flex flex-row items-center">
                      <span
                        style={{
                          color: brandPrimaryTap,
                          fontSize: 12,
                          opacity: 0.5,
                          marginRight: 10,
                        }}
                      >
                        {localStrings.Post.Sponsor}
                      </span>
                      <RiAdvertisementLine size={24} color={brandPrimaryTap} />
                    </div>
                  ) : (
                    <div className="flex flex-row items-center">
                      <span
                        style={{
                          color: brandPrimaryTap,
                          fontSize: 12,
                          opacity: 0.5,
                          marginRight: 10,
                        }}
                      >
                        {getTimeDiff(likedPost?.created_at, localStrings)}
                      </span>
                      {renderPrivacyIcon()}
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
            {isParentPost || noFooter ? null : (
              <Col
                xs={2}
                md={1}
                className="hover:cursor-pointer"
                // onClick={showAction}
              >
                <Dropdown trigger={["click"]} menu={{ items }}>
                  <HiDotsVertical size={16} />
                </Dropdown>
              </Col>
            )}
          </Row>
        }
        actions={
          isParentPost || noFooter
            ? undefined
            : [
                <Row align={"middle"} justify={"center"}>
                  {renderLikeIcon()}
                  <span style={{ color: brandPrimary }} className="ml-2">
                    {likedPost?.like_count}
                  </span>
                </Row>,

                <Row align={"middle"} justify={"center"}>
                  <FaRegComments
                    size={24}
                    color={brandPrimary}
                    onClick={() => setIsCommentModalVisible(true)}
                  />
                  <span style={{ color: brandPrimary }} className="ml-2">
                    {likedPost?.comment_count}
                  </span>
                </Row>,
                // <Row align={"middle"} justify={"center"}>
                //   <FaRegComments
                //     size={24}
                //     color={brandPrimary}
                // onClick={() => {
                //   setIsCommentModalVisible(false);
                //   router.push(`postDetails?postId=${likedPost?.id}`);
                // }}
                //   />
                //   <span style={{ color: brandPrimary }} className="ml-2">
                //     {likedPost?.comment_count}
                //   </span>
                // </Row>,

                <Row align={"middle"} justify={"center"}>
                  <IoShareSocialOutline
                    size={24}
                    color={brandPrimary}
                    onClick={() => setIsShareModalVisible(true)}
                  />
                </Row>,
              ]
        }
      >
        <Row gutter={[8, 8]} className="mx-2">
          {!isParentPost && children ? (
            <Col span={24}>
              {likedPost?.content && (
                <span className="pl-2">{likedPost?.content}</span>
              )}
              {children}
            </Col>
          ) : likedPost?.content && likedPost?.parent_id ? (
            <div>
              <div style={{ paddingLeft: 10 }}>
                <span>{likedPost?.content}</span>
              </div>
              <div style={{ paddingLeft: 5, paddingRight: 5 }}>
                <div
                  style={{
                    padding: 10,
                    borderColor: "#000",
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                >
                  <span
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {localStrings.Post.NoContent}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Col span={22}>
              {likedPost?.content && (
                <span className="pl-2">{likedPost?.content}</span>
              )}
              {likedPost?.media && likedPost?.media?.length > 0 && (
                <MediaView mediaItems={likedPost?.media} />
              )}
            </Col>
          )}
        </Row>
        <Modal
          visible={isEditModalVisible}
          width={800}
          footer={null}
          closable={false}
        >
          {post?.id ? (
            <EditPostScreen id={post.id} />
          ) : (
            <div>No post ID available</div>
          )}
        </Modal>
        {/* Modal for comments */}
        <Modal
          visible={isCommentModalVisible}
          width={800}
          footer={null}
          closable={true}
          onCancel={() => setIsCommentModalVisible(false)}
        >
          <PostDetailsScreen postId={likedPost?.id} />
        </Modal>

        {/* Modal for share Post */}
        <Modal
          visible={isShareModalVisible}
          onCancel={() => setIsShareModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setIsShareModalVisible(false)}>
              {localStrings.Public.Cancel}
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={shareLoading}
              onClick={(event) =>
                likedPost &&
                sharePost(likedPost.id!, {
                  privacy: sharePostPrivacy,
                  content: shareContent,
                })
              }
            >
              {localStrings.Public.Conform}
            </Button>,
          ]}
        >
          <Form form={shareForm}>
            <Card
              style={{
                width: "100%",
                padding: 16,
                border: "1px solid #ddd",
                borderRadius: 4,
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={4} md={2} className="hover:cursor-pointer">
                  <Avatar src={likedPost?.user?.avatar_url} shape="circle" />
                </Col>
                <Col xs={18} md={21}>
                  <Row>
                    <Col
                      span={24}
                      className="hover:cursor-pointer hover:underline"
                    >
                      <span style={{ fontWeight: "bold", fontSize: 14 }}>
                        {likedPost?.user?.family_name} {likedPost?.user?.name}
                      </span>
                    </Col>
                    <Col span={24}>
                      {likedPost?.is_advertisement ? (
                        <div className="flex flex-row items-center">
                          <span
                            style={{
                              color: brandPrimaryTap,
                              fontSize: 12,
                              opacity: 0.5,
                              marginRight: 10,
                            }}
                          >
                            {localStrings.Post.Sponsor}
                          </span>
                          <RiAdvertisementLine
                            size={24}
                            color={brandPrimaryTap}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-row items-center">
                          <span
                            style={{
                              color: brandPrimaryTap,
                              fontSize: 12,
                              opacity: 0.5,
                              marginRight: 10,
                            }}
                          >
                            {getTimeDiff(likedPost?.created_at, localStrings)}
                          </span>
                          {renderPrivacyIcon()}
                        </div>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
              {likedPost?.content && (
                <Form.Item>
                  <span>{likedPost?.content}</span>
                </Form.Item>
              )}
              {likedPost?.media && likedPost?.media?.length > 0 && (
                <Form.Item>
                  <MediaView mediaItems={likedPost?.media} />
                </Form.Item>
              )}
              <Form.Item>
                <Input.TextArea
                  value={shareContent}
                  onChange={(e) => setShareContent(e.target.value)}
                  placeholder="Nhập nội dung"
                />
              </Form.Item>
            </Card>

            <Form.Item
              name="sharePostPrivacy"
              label={localStrings.ObjectPostPrivacy.PostPrivacy}
            >
              <Select
                value={sharePostPrivacy}
                onChange={(value) => setSharePostPrivacy(value)}
                style={{ width: 120 }}
              >
                <Select.Option value={Privacy.PUBLIC}>
                  {localStrings.Public.Everyone}
                </Select.Option>
                <Select.Option value={Privacy.FRIEND_ONLY}>
                  {localStrings.Public.Friend}
                </Select.Option>
                <Select.Option value={Privacy.PRIVATE}>
                  {localStrings.Public.Private}
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        {/* Modal for edit Post*/}
        {isEditModalVisible && (
          <Modal
            title={localStrings.Post.EditPost}
            visible={isEditModalVisible}
            onOk={() => {
              setIsEditModalVisible(false);
              
            }}
            onCancel={() => {
              setIsEditModalVisible(false);
            }}
          >
            <EditPostScreen  
              id={post?.id || ''}
            />
          </Modal>
        )}
      </Card>
    );
  }
);

export default Post;