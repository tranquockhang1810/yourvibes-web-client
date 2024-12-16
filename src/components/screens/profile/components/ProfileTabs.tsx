"use client"
import { useAuth } from '@/context/auth/useAuth';
import useColor from '@/hooks/useColor';
import { Tabs, TabsProps } from 'antd';
import React from 'react';
import AboutTab from './AboutTab';
import { FriendStatus, Privacy } from '@/api/baseApiResponseModel/baseApiResponseModel';
import { PostResponseModel } from '@/api/features/post/models/PostResponseModel';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';
import { FriendResponseModel } from '@/api/features/profile/model/FriendReponseModel';
import SettingsTab from './SettingTabs';
import ListFriends from './ListFriends';
import PostList from './PostList';

const ProfileTabs = ({
  tabNum,
  posts,
  loading,
  profileLoading,
  loadMorePosts,
  userInfo,
  friendCount,
  friends,
  resultCode,
}: {
  tabNum: number,
  posts: PostResponseModel[],
  loading: boolean,
  profileLoading: boolean,
  loadMorePosts: () => void,
  userInfo: UserModel,
  friendCount: number,
  friends:FriendResponseModel[];
  resultCode: number;
}) => {
    const { brandPrimary } = useColor();
    const { localStrings, user } = useAuth();

    const items: TabsProps['items'] = [
        {
            key: '1',
            label:  localStrings.Public.About,
            children:  <AboutTab 
              user={userInfo} 
              loading={profileLoading} 
              friendCount={friendCount} 
              friends={friends} 
              resultCode={resultCode} 
            />,
        },
        {
            key: '2',
            label: localStrings.Public.Post,
            children: <PostList 
              loading={loading} 
              posts={posts} 
              loadMorePosts={loadMorePosts} 
              user={userInfo} 
            />,
        },
        {
            key: '3',
            label: localStrings.Public.Friend,
            children: <ListFriends 
              user={userInfo} 
              loading={loading} 
              friends={friends} 
              page={1} 
              setPage={() => {}} 
              totalPage={1} 
            />,
        },
        ...(userInfo?.id === user?.id ?[
        {
            key: '4',
            label: localStrings.Public.SetingProfile,
            children: <SettingsTab />,
        },
        ]: []),
    ];

  return (
    <Tabs  defaultActiveKey="1"
    centered items={items}/>
  );
};

export default ProfileTabs;
