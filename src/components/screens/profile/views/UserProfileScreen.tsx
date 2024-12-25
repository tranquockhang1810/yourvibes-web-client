"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Drawer, Modal, Space, Typography } from 'antd';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import UserProfileViewModel from '../viewModel/UserProfileViewModel';
import { useAuth } from '@/context/auth/useAuth';
import { useRouter } from 'next/navigation';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';

const UserProfileScreen = ({ id }: { id: string }) => {
  const { localStrings } = useAuth();
  const [tab, setTab] = useState(0);
  const router = useRouter();

  const {
    loading,
    posts,
    loadMorePosts,
    total,
    fetchUserProfile,
    profileLoading,
    userInfo,
    friends,
    friendCount,
    resultCode,
  } = UserProfileViewModel();


  useEffect(() => {
    if (!id) return;
    fetchUserProfile(id);
  }, [id]);

  return (
    <div>
        <ProfileHeader
          total={total}
          user={userInfo as UserModel}
          loading={profileLoading}
          friendCount={friendCount}
        />
        <ProfileTabs
          posts={posts}
          loading={loading}
          profileLoading={profileLoading}
          loadMorePosts={loadMorePosts}
          userInfo={userInfo as UserModel}
          friendCount={friendCount}
          friends={friends}
          resultCode={resultCode}
        />
    </div>
  );
};

export default UserProfileScreen;
