"use client"
import React from 'react'
import ProfileHeader from '../components/ProfileHeader'
import useColor from '@/hooks/useColor';
import { useAuth } from '@/context/auth/useAuth';
// import { useRouter } from 'next/router';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';
import ProfileTabs from '../components/ProfileTabs';
import { FriendStatus, Privacy } from '@/api/baseApiResponseModel/baseApiResponseModel';

const ProfileFeature = () => {
    const { backgroundColor } = useColor();
  const { user, localStrings } = useAuth();
//   const router = useRouter();
//   const {
//     loading,
//     posts,
//     fetchUserPosts,
//     loadMorePosts,
//     total,
//     friends, 
//     friendCount,  
//     resultCode,
//     fetchUserProfile,
//   } = ProfileViewModel();
  return (
    <div>
        <ProfileHeader total={0} user={{  id: "1d0c5d48-4eb5-4cad-9e67-e6430182d582",
        family_name: "Thanh ",
        name: "Phương ",
        email: "",
        phone_number: "",
        birthday: "2000-02-01T00:00:00Z",
        privacy: Privacy.PUBLIC,
        biography: "Hello",
        post_count: 0,
        friend_count: 0,
        status: true,
        friend_status: FriendStatus.NotFriend,
        created_at: "2024-10-01T00:00:00Z",
        updated_at: "2024-10-01T00:00:00Z" }} loading={false} friendCount={0}
              />
        <ProfileTabs userInfo={{id: "1d0c5d48-4eb5-4cad-9e67-e6430182d582",
        family_name: "Thanh ",
        name: "Phương ",
        email: "",
        phone_number: "",
        birthday: "2000-02-01T00:00:00Z",
        privacy: Privacy.PUBLIC,
        biography: "Hello",
        post_count: 0,
        friend_count: 0,
        status: true,
        friend_status: FriendStatus.NotFriend,
        created_at: "2024-10-01T00:00:00Z",
        updated_at: "2024-10-01T00:00:00Z" }} />
      </div>
  )
}

export default ProfileFeature

