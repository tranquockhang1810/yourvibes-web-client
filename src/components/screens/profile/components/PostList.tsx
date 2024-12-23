import React, { useCallback } from 'react';
import { List, Spin } from 'antd';
import { PostResponseModel } from '@/api/features/post/models/PostResponseModel';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';
import useColor from '@/hooks/useColor';
import { useAuth } from '@/context/auth/useAuth';
import Post from '@/components/common/post/views/Post';
import { useRouter } from 'next/navigation';


const PostList = ({ loading, posts, loadMorePosts, user }:{
  loading: boolean;
  posts: PostResponseModel[];
  loadMorePosts: () => void;
  user: UserModel;
}) => {
  const { backgroundColor, lightGray, grayBackground, brandPrimary } = useColor();
  const { localStrings } = useAuth();
  const router = useRouter();
  

  const renderFooter = useCallback(() => {
    return loading ? (
      <div className="flex justify-center py-4">
        <Spin size="large" />
      </div>
    ) : null;
  }, [loading]);

  const renderAddPost = useCallback(() => {
      return (
        <div
          onClick={() => router.push("/addPost")}
          style={{
            padding: "10px",
            display: "flex",
            alignItems: "center",
            margin: "10px",
            backgroundColor: backgroundColor,
            border: `1px solid ${lightGray}`,
            borderRadius: "10px",
            cursor: "pointer",
            width: "100%", 
            maxWidth: "600px", 
          }}
        >
          <img
            src={user?.avatar_url}
            alt="User Avatar"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "25px",
              backgroundColor: lightGray,
            }}
          />
          <div style={{ marginLeft: "10px", flex: 1 }}>
            <p>
              {user?.family_name + " " + user?.name ||
                localStrings.Public.Username}
            </p>
            <p style={{ color: "gray" }}>{localStrings.Public.Today}</p>
          </div>
        </div>
      );
    }, [user, backgroundColor, lightGray, localStrings]);
    
  

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="border-none rounded-md border-solid border-gray-900 basis-2/4">
      {/* Add Post Button */}
      {renderAddPost()}
     
      {/* Posts List */}
      {posts.map((item) => (
        <div key={item?.id} className="mb-4">
          <Post post={item}>
            {item?.parent_post && <Post post={item?.parent_post} isParentPost />}
          </Post>
        </div>))}
      {/* <List
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
      /> */}
    </div>
    </div>
  );
};

export default PostList;