import React, { useCallback } from 'react';
import { List, Spin } from 'antd';
import { PostResponseModel } from '@/api/features/post/models/PostResponseModel';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';
import useColor from '@/hooks/useColor';
import { useAuth } from '@/context/auth/useAuth';
import Post from '@/components/common/post/views/Post';


const PostList = ({ loading, posts, loadMorePosts, user }:{
  loading: boolean;
  posts: PostResponseModel[];
  loadMorePosts: () => void;
  user: UserModel;
}) => {
  const { backgroundColor, lightGray, grayBackground, brandPrimary } = useColor();
  const { localStrings } = useAuth();
  console.log('PostList', posts, "user", user);
  

  const renderFooter = useCallback(() => {
    return loading ? (
      <div className="flex justify-center py-4">
        <Spin size="large" />
      </div>
    ) : null;
  }, [loading]);

  return (
    <div className={`flex flex-col bg-${grayBackground} p-4`}>
      {/* Add Post Button */}
      <div
        // onClick={() => router.push('/add')}
        className="flex items-center p-2 bg-white border border-gray-300 rounded-md mb-4"
      >
        <img
          src={user?.avatar_url || 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'}
          alt="User Avatar"
          width={50}
          height={50}
          className="rounded-full bg-gray-200"
        />
        <div className="ml-3 flex-1">
          <p className="font-bold">{user?.family_name + ' ' + user?.name || localStrings.Public.Username}</p>
          <p className="text-gray-500">{localStrings.Public.Today}</p>
        </div>
      </div>

      {/* Posts List */}
      <List
        dataSource={posts}
        renderItem={(item) => (
          <List.Item key={item?.id} className="mb-4">
            <Post post={item}>
              {item?.parent_post && <Post post={item?.parent_post} isParentPost />}
            </Post>
          </List.Item>
        )}
        // loading={loading}
        // loadMore={renderFooter()}
      />
    </div>
  );
};

export default PostList;
