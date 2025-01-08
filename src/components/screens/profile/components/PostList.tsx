import React, { useCallback, useState } from 'react';
import { List, Spin, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { PostResponseModel } from '@/api/features/post/models/PostResponseModel';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';
import useColor from '@/hooks/useColor';
import { useAuth } from '@/context/auth/useAuth';
import Post from '@/components/common/post/views/Post';
import { useRouter } from 'next/navigation';
import AddPostScreen from '@/components/screens/addPost/view/AddPostScreen';

const PostList = ({ loading, posts, loadMorePosts, user, fetchUserPosts }: {
  loading: boolean;
  posts: PostResponseModel[];
  loadMorePosts: () => void;
  user: UserModel;
  fetchUserPosts: () => void;
}) => {
  const { backgroundColor, lightGray, grayBackground, brandPrimary } = useColor();
  const {isLoginUser, localStrings } = useAuth();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false); 
  };

  const renderFooter = useCallback(() => {
    return loading ? (
      <div className="flex justify-center py-4">
        <Spin size="large" />
      </div>
    ) : null;
  }, [loading]);

  const handlePostSuccess = () => {
    setIsModalVisible(false);
    fetchUserPosts();
  };

  const renderAddPost = useCallback(() => {
    return (
      <>
      <div
        onClick={() => setIsModalVisible(true)}
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center", 
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
      <Modal centered title={localStrings.AddPost.NewPost} 
        open={isModalVisible} onCancel={() => setIsModalVisible(false)} width={800} footer={null}>
          <AddPostScreen onPostSuccess={handlePostSuccess} />
        </Modal>
    </>
    );
  }, [user, backgroundColor, lightGray, localStrings, isModalVisible]);

  return (
    <div className="w-auto flex flex-col items-center justify-center">
        {/* Add Post Button */}
        {isLoginUser(user?.id as string) && renderAddPost()}
        

          {/* Posts List */}
        {loading ? (<Spin indicator={<LoadingOutlined spin />} size="large" />) : (posts && posts.length > 0 ? (
        posts.map((item) => (
          <div key={item?.id} className='w-full  flex flex-col items-center'>
            <Post post={item}>
              {item?.parent_post && <Post post={item?.parent_post} isParentPost />}
            </Post>
          </div>
        ))
      ) : null)}
        
      </div>
  );
};

export default PostList;