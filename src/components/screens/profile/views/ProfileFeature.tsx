"use client"
import React, { useEffect } from 'react'
import ProfileHeader from '../components/ProfileHeader'
import useColor from '@/hooks/useColor';
import { useAuth } from '@/context/auth/useAuth';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';
import ProfileTabs from '../components/ProfileTabs';
import { FriendStatus, Privacy } from '@/api/baseApiResponseModel/baseApiResponseModel';
import ProfileViewModel from '../viewModel/ProfileViewModel';
import { useRouter } from 'next/navigation';

const ProfileFeature = () => {
    const { backgroundColor } = useColor();
  const { user, localStrings } = useAuth();
  
  const {
    loading,
    posts,
    fetchUserPosts,
    loadMorePosts,
    total,
    friends, 
    friendCount,  
    resultCode,
    fetchUserProfile,
  } = ProfileViewModel();

  useEffect(() => {
    fetchUserProfile(user?.id as string);
    fetchUserPosts();
  }, [user]);

  return (
    <div>
        <ProfileHeader total={total} user={user as UserModel} loading={false} friendCount={friendCount}/>
        <ProfileTabs
          tabNum={0}
          posts={posts}
          loading={loading}
          profileLoading={false}
          loadMorePosts={loadMorePosts}
          userInfo={user as UserModel}
          friendCount={friendCount}
          friends={friends}
          resultCode={resultCode}
        />
      </div>
  )
}

export default ProfileFeature