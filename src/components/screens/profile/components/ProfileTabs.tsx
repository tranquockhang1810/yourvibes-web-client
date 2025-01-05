"use client"
import { useAuth } from '@/context/auth/useAuth';
import useColor from '@/hooks/useColor';
import { Tabs, TabsProps } from 'antd';
import React, { useEffect, useState } from 'react';
import AboutTab from './AboutTab';
import { PostResponseModel } from '@/api/features/post/models/PostResponseModel';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';
import { FriendResponseModel } from '@/api/features/profile/model/FriendReponseModel';
import SettingsTab from './SettingTabs';
import ListFriends from './ListFriends';
import PostList from './PostList';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const ProfileTabs = ({
  posts,
  loading,
  profileLoading,
  loadMorePosts,
  userInfo,
  friendCount,
  friends,
  resultCode,
}: {
  posts: PostResponseModel[],
  loading: boolean,
  profileLoading: boolean,
  loadMorePosts: () => void,
  userInfo: UserModel,
  friendCount: number,
  friends: FriendResponseModel[],
  resultCode: number,
}) => {
    const { brandPrimary } = useColor();
    const { localStrings, user } = useAuth();
    const searchParams = useSearchParams(); // Lấy tham số search của URL
    const tab = searchParams.get('tab'); // Lấy giá trị của tham số 'tab' từ URL
    
    const [activeKey, setActiveKey] = useState<string>('info'); // Quản lý activeKey

    // Cập nhật activeKey khi tham số 'tab' thay đổi trong URL
    useEffect(() => {
      if (tab) {
        setActiveKey(tab); // Cập nhật activeKey nếu có tab trong URL
      }
    }, [tab]);

    const items: TabsProps['items'] = [
        {
            key: 'info',
            label: <Link href={userInfo?.id === user?.id ?"/profile?tab=info" : `/user/${userInfo?.id}?tab=info`} style={{ textDecoration: 'none', color: 'inherit' }}>{ localStrings.Public.About} </Link>,
            children: <AboutTab 
                        user={userInfo} 
                        loading={profileLoading} 
                        friendCount={friendCount} 
                        friends={friends} 
                        resultCode={resultCode}
                        posts={posts} 
                        loadMorePosts={loadMorePosts} 
                    />,
        },
        // {
        //     key: 'posts',
        //     label: <Link href={userInfo?.id === user?.id ? "/profile?tab=posts" : `/user/${userInfo?.id}?tab=posts`} style={{ textDecoration: 'none', color: 'inherit' }}>{ localStrings.Public.Post} </Link>,
        //     children: <PostList 
        //                 loading={loading} 
        //                 posts={posts} 
        //                 loadMorePosts={loadMorePosts} 
        //                 user={userInfo} 
        //             />,
        // },
        // {
        //     key: 'friends',
        //     label: <Link href={userInfo?.id === user?.id ? "/profile?tab=friends" : `/user/${userInfo?.id}?tab=friends`} style={{ textDecoration: 'none', color: 'inherit' }}>{ localStrings.Public.Friend} </Link>,
        //     children: <ListFriends 
        //                 friends={friends} 
        //                 page={1} 
        //                 setPage={() => {}} 
        //                 totalPage={1} 
        //             />,
        // },
        ...(userInfo?.id === user?.id ? [
            {
                key: 'settings',
                label: <Link href="/profile?tab=settings" style={{ textDecoration: 'none', color: 'inherit' }}>{localStrings.Public.SetingProfile} </Link>,
                children: <SettingsTab />,
            },
        ] : []),
    ];

  return (
    <Tabs  
      activeKey={activeKey} // Sử dụng activeKey thay vì defaultActiveKey
      centered 
      items={items}
      onChange={setActiveKey} // Cập nhật activeKey khi người dùng thay đổi tab
    />
  );
};

export default ProfileTabs;
