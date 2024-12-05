"use client"
import { Privacy } from '@/api/baseApiResponseModel/baseApiResponseModel';
import { PostResponseModel } from '@/api/features/post/models/PostResponseModel';
import { useAuth } from '@/context/auth/useAuth';
import useColor from '@/hooks/useColor';
import { Card, Form } from 'antd';
import React, { useCallback, useState } from 'react';
import { FaGlobe, FaHeart, FaLock, FaRegHeart } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { getTimeDiff } from '@/utils/helper/DateTransfer';
import { RiAdvertisementLine } from "react-icons/ri";
import { HiDotsVertical } from "react-icons/hi";

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
  // const {
  //   deleteLoading,
  //   likePost,
  //   likedPost,
  //   setLikedPost,
  //   sharePost,
  //   shareLoading,
  //   deletePost,
  // } = EditPostViewModel(defaultPostRepo);
  // const { deleteNewFeed } = HomeViewModel(defaultNewFeedRepo)

  const likedPost: PostResponseModel = {
    "id": "3c56102f-f139-44b5-9314-feb7898c677a",
    "user_id": "7dfdf978-9706-4720-aa3f-382af4b14f70",
    "user": {
      "id": "7dfdf978-9706-4720-aa3f-382af4b14f70",
      "family_name": "Pc",
      "name": "Huy",
      "avatar_url": "https://res.cloudinary.com/dkf51e57t/image/upload/v1731483436/yourVibes/t33btwrq6rurxho4o5sc.jpg"
    },
    "parent_id": undefined,
    "parent_post": undefined,
    "content": "test post",
    "like_count": 1,
    "comment_count": 1,
    "privacy": "public",
    "location": "",
    "is_advertisement": false,
    "status": true,
    "created_at": "2024-11-19T03:55:39.89293+07:00",
    "updated_at": "2024-11-28T20:32:52.075703+07:00",
    "media": [
      {
        "id": 44,
        "post_id": "3c56102f-f139-44b5-9314-feb7898c677a",
        "media_url": "https://res.cloudinary.com/dkf51e57t/image/upload/v1731963346/yourVibes/s40veufkaso1lyscxrub.png",
        "status": true,
        "created_at": "2024-11-19T03:55:49.838189+07:00"
      }
    ],
    "is_liked": false
  }

  const renderPrivacyIcon = () => {
    switch ("public") {
      case Privacy.PUBLIC:
        return <FaGlobe size={24} color={brandPrimaryTap} />;
      // case Privacy.FRIEND_ONLY:
      //   return <BsFillPeopleFill  size={24} color={brandPrimaryTap} />;
      // case Privacy.PRIVATE:
      //   return <FaLock size={24} color={brandPrimaryTap} />;
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
    // if (likedPost?.is_liked) {
    if (true) {
      return <FaHeart size={24} color={"red"} />;
    } else {
      return <FaRegHeart size={24} color={brandPrimaryTap} />;
    }
  }, []);

  return (
    <Card
      style={{
        margin: 10,
        borderColor: isParentPost ? brandPrimary : "red",
        maxWidth: 800
      }}
      title={
        <div style={{ display: 'flex', flexDirection: 'row', marginRight: 8 }}>
          <div
            onClick={() => router.push(`/(tabs)/user/${likedPost?.user?.id}`)}
          >
            <img
              src={likedPost?.user?.avatar_url}
              style={{
                width: 40,
                height: 40,
                borderRadius: 30
              }}
            />
          </div>
          <div style={{ flexDirection: 'column', marginLeft: 8, width: '92%' }}>
            <div
              onClick={() => router.push(`/(tabs)/user/${likedPost?.user?.id}`)}
            >
              <span style={{ fontWeight: 'bold', fontSize: 14 }}>{likedPost?.user?.family_name} {likedPost?.user?.name}</span>
            </div>
            <div style={{ flexDirection: 'row', alignItems: 'center' }}>
              {likedPost?.is_advertisement ? (
                <>
                  <span style={{ color: brandPrimaryTap, fontSize: 12, opacity: 0.5, marginRight: 10 }}>{localStrings.Post.Sponsor}</span>
                  <RiAdvertisementLine size={24} color={brandPrimaryTap} />
                </>)
                : (
                  <>
                    <span style={{ color: brandPrimaryTap, fontSize: 12, opacity: 0.5, marginRight: 10 }}>{getTimeDiff(likedPost?.created_at, localStrings)}</span>
                    {renderPrivacyIcon()}
                  </>
                )
              }

            </div>
          </div>
          {isParentPost || noFooter ? null : (
            <div
              style={{ width: '8%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
              //onClick={showAction}
            >
              <HiDotsVertical size={16} />
            </div>
          )}
        </div>
      }
    >
      <span className='font-bold'>hello</span>
      {renderPrivacyIcon()}
      {renderLikeIcon()}
    </Card >
  );
})

export default Post