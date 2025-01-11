import React, { useCallback, useEffect, useState } from 'react';
import { Spin, Modal, Empty, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostResponseModel } from '@/api/features/post/models/PostResponseModel';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';
import useColor from '@/hooks/useColor';
import { useAuth } from '@/context/auth/useAuth';
import Post from '@/components/common/post/views/Post';
import AddPostScreen from '@/components/screens/addPost/view/AddPostScreen';

const PostList = ({ loading, posts, loadMorePosts, user, fetchUserPosts, hasMore, deletePost }: {
  loading: boolean;
  posts: PostResponseModel[];
  loadMorePosts: () => void;
  user: UserModel;
  fetchUserPosts: () => void;
  hasMore: boolean; // Biến để kiểm tra có còn dữ liệu hay không
  deletePost: (postId: string) => void;
}) => {
  const { backgroundColor, lightGray } = useColor();
  const { isLoginUser, localStrings } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [postList, setPostList] = useState<PostResponseModel[]>(posts);
  useEffect(() => {
    setPostList(posts);
  }, [posts]);
  
    // Hàm xóa bài viết khỏi danh sách hiển thị
    const handleDeletePost = (postId: string) => {
      setPostList((prev) => prev.filter((post) => post.id !== postId));
      message.success('Bài viết đã được xóa!');
    };


  const handleModalClose = () => {
    setIsModalVisible(false); 
  };
  

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
      <div style={{width: '100%' }}>
       {posts && posts.length > 0 ? (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loader={<Spin indicator={<LoadingOutlined spin />} size="large" />}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              {/* <b>{localStrings.Public.NoMorePosts}</b> */}
            </p>
          }
        >
         
            {posts.map((item) => (
              <div key={item?.id} className='w-full flex flex-col items-center' >
                <Post post={item} fetchUserPosts={() => {
                    fetchUserPosts(); // Gọi lại API nếu cần
                    item?.id && handleDeletePost(item.id); // Xóa bài viết khỏi danh sách
                  }}>
                  {item?.parent_post && <Post post={item?.parent_post} isParentPost />}
                </Post>
              </div>
            ))}
        </InfiniteScroll>): (
          <div style={{ textAlign: 'center', padding: '20px' }}>
              <Empty description={
                <span style={{ color: 'gray', fontSize: 16 }}>
                  {localStrings.Post.NoPosts}
                </span>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;