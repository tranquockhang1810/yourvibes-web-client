"use client"
import { Privacy } from '@/api/baseApiResponseModel/baseApiResponseModel';
import { PostResponseModel } from '@/api/features/post/models/PostResponseModel';
import { useAuth } from '@/context/auth/useAuth';
import useColor from '@/hooks/useColor';
import { Avatar, Button, Card, Col, Dropdown, Form, Menu, MenuProps, Modal, Popover, Row, Tooltip } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaGlobe, FaHeart, FaLock, FaRegComments, FaRegHeart } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { getTimeDiff } from '@/utils/helper/DateTransfer';
import { RiAdvertisementLine } from "react-icons/ri";
import { HiDotsVertical } from "react-icons/hi";
import { BsFillPeopleFill } from 'react-icons/bs';
import { IoShareSocialOutline } from 'react-icons/io5';
import EditPostViewModel from '@/components/features/editpost/viewModel/EditPostViewModel';
import { defaultPostRepo } from '@/api/features/post/PostRepo';

interface IPost {
  post?: PostResponseModel,
  isParentPost?: boolean,
  noFooter?: boolean,
  children?: React.ReactNode,
}

const Post: React.FC<IPost> = React.memo(({
  post,
  isParentPost = false,
  noFooter = false,
  children,
}) => {
  const router = useRouter();
  const { brandPrimary, brandPrimaryTap, lightGray, backgroundColor } = useColor();
  const { user, localStrings } = useAuth();
  const [shareForm] = Form.useForm();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [sharePostPrivacy, setSharePostPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);
  const {
    deleteLoading,
    likePost,
    likedPost,
    setLikedPost,
    sharePost,
    shareLoading,
    deletePost,
  } = EditPostViewModel(defaultPostRepo);
  // const { deleteNewFeed } = HomeViewModel(defaultNewFeedRepo)

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
  }

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

  const renderLikeIcon = useCallback(() => {
    if (likedPost?.is_liked) {
      return <FaHeart size={24} color={"red"} />;
    } else {
      return <FaRegHeart size={24} color={brandPrimaryTap} />;
    }
  }, [likedPost?.is_liked]);

  const items: MenuProps['items'] = useMemo(() => {
    if (user?.id === likedPost?.user?.id)
      return [
        {
          key: '1',
          label: localStrings.Post.EditPost,
          type: 'item',
          onClick: () => {
            router.push(`/edit-post/${post?.id}`);
          }
        },
        {
          key: '2',
          label: localStrings.Post.DeletePost,
          type: 'item',
          onClick: () => {
            Modal.confirm({
              centered: true,
              title: localStrings.Public.Confirm,
              content: localStrings.DeletePost.DeleteConfirm,
              okText: localStrings.Public.Confirm,
              cancelText: localStrings.Public.Cancel,
              onOk: () => {
                deletePost && deletePost(post?.id as string);
              }
            });
          }
        },
        {
          key: '3',
          label: localStrings.Post.Advertisement,
          type: 'item',
          onClick: () => {
            router.push(`/ads?postId=${post?.id}`);
          }
        }
      ]
    else return [
      {
        key: '1',
        label: localStrings.Post.ReportPost,
        type: 'item',
        onClick: () => {
          router.push(`/report?postId=${post?.id}`);
        }
      },
      {
        key: '2',
        label: localStrings.Post.DeleteNewFeed,
        type: 'item',
        onClick: () => {
          Modal.confirm({
            centered: true,
            title: localStrings.Public.Confirm,
            content: localStrings.DeletePost.DeleteConfirm,
            okText: localStrings.Public.Confirm,
            cancelText: localStrings.Public.Cancel,
            onOk: () => {
              deletePost && deletePost(post?.id as string);
            }
          });
        }
      }
    ]
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
        <Row gutter={[8, 8]} className='m-2'>
          <Col xs={4} md={2}
            className='hover:cursor-pointer'
            onClick={() => router.push(`/(tabs)/user/${likedPost?.user?.id}`)}
          >
            <Avatar
              src={likedPost?.user?.avatar_url}
              shape='circle'
            />
          </Col>
          <Col xs={18} md={21}>
            <Row>
              <Col
                span={24}
                className='hover:cursor-pointer hover:underline'
                onClick={() => router.push(`/(tabs)/user/${likedPost?.user?.id}`)}
              >
                <span style={{ fontWeight: 'bold', fontSize: 14 }}>{likedPost?.user?.family_name} {likedPost?.user?.name}</span>
              </Col>
              <Col span={24}>
                {likedPost?.is_advertisement ? (
                  <div className='flex flex-row items-center'>
                    <span style={{ color: brandPrimaryTap, fontSize: 12, opacity: 0.5, marginRight: 10 }}>{localStrings.Post.Sponsor}</span>
                    <RiAdvertisementLine size={24} color={brandPrimaryTap} />
                  </div>
                ) : (
                  <div className='flex flex-row items-center'>
                    <span style={{ color: brandPrimaryTap, fontSize: 12, opacity: 0.5, marginRight: 10 }}>{getTimeDiff(likedPost?.created_at, localStrings)}</span>
                    {renderPrivacyIcon()}
                  </div>
                )}
              </Col>
            </Row>
          </Col>
          {isParentPost || noFooter ? null : (

            <Col xs={2} md={1}
              className='hover:cursor-pointer'
            //onClick={showAction}
            >
              <Dropdown
                trigger={['click']}
                menu={{ items }}
              >
                <HiDotsVertical size={16} />
              </Dropdown>
            </Col>
          )}
        </Row>
      }
      actions={isParentPost || noFooter ? undefined : [
        <Row align={'middle'} justify={'center'}>
          {renderLikeIcon()}
          <span style={{ color: brandPrimary }} className='ml-2'>{likedPost?.like_count}</span>
        </Row>,
        <Row align={'middle'} justify={'center'}>
          <FaRegComments size={24} color={brandPrimary} />
          <span style={{ color: brandPrimary }} className='ml-2'>{likedPost?.comment_count}</span>
        </Row>,
        <Row align={'middle'} justify={'center'}>
          <IoShareSocialOutline size={24} color={brandPrimary} />
        </Row>,
      ]}
    >
      <Row gutter={[8, 8]} className='mx-2'>
        {!isParentPost && children ? (
          <Col span={24} >
            {likedPost?.content && (
              <span className='pl-2'>{likedPost?.content}</span>
            )}
            {children}
          </Col>
        ) : (
          likedPost?.content &&
            likedPost?.parent_id ? (
            <div>
              <div style={{ paddingLeft: 10 }}>
                <span>{likedPost?.content}</span>
              </div>
              <div style={{ paddingLeft: 5, paddingRight: 5 }}>
                <div style={{ padding: 10, borderColor: "#000", borderWidth: 1, borderRadius: 5 }}>
                  <span style={{ textAlign: 'center', fontWeight: "bold", fontSize: 16 }}>
                    {localStrings.Post.NoContent}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Col span={22}>
              {likedPost?.content && (
                <span className='pl-2'>{likedPost?.content}</span>
              )}
              {/* {likedPost?.media && likedPost?.media?.length > 0 && <MediaView mediaItems={likedPost?.media} />} */}
            </Col>
          ))}
      </Row>
    </Card >
  );
})

export default Post