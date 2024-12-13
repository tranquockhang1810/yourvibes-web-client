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

const ProfileTabs = ({
  // tabNum,
  // posts,
  // loading,
  // profileLoading,
  // loadMorePosts,
  userInfo,
  // friendCount,
  // friends,
  // resultCode,
}: {
  // tabNum: number,
  // posts: PostResponseModel[],
  // loading: boolean,
  // profileLoading: boolean,
  // loadMorePosts: () => void,
  userInfo: UserModel,
  // friendCount: number,
  // friends:FriendResponseModel[];
  // resultCode: number;
}) => {
    const { brandPrimary } = useColor();
    const { localStrings, user } = useAuth();

    const items: TabsProps['items'] = [
        {
            key: '1',
            label:  localStrings.Public.About,
            children:  <AboutTab user={{  id: "1d0c5d48-4eb5-4cad-9e67-e6430182d582",
              family_name: "Thanh ",
              name: "Phương ",
              email: "sgjkqwuow",
              phone_number: "09743122",
              birthday: "2000-02-01T00:00:00Z",
              privacy: Privacy.PUBLIC,
              biography: "Hello",
              post_count: 0,
              friend_count: 0,
              status: true,
              friend_status: FriendStatus.NotFriend,
              created_at: "2024-10-01T00:00:00Z",
              updated_at: "2024-10-01T00:00:00Z"  }} loading={false} resultCode={20001} />,
        },
        {
            key: '2',
            label: localStrings.Public.Post,
            children: 'PosstLisst',
        },
        {
            key: '3',
            label: localStrings.Public.Friend,
            children: <ListFriends />,
        },
        // ...(userInfo?.id === user?.id ?[
        {
            key: '4',
            label: localStrings.Public.SetingProfile,
            children: <SettingsTab />,
        },
        // ]: []),
    ];

  return (
    <Tabs  defaultActiveKey="1"
    centered items={items}/>
  );
};

export default ProfileTabs;
