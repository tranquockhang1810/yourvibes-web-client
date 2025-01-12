"use client";
import React, { useCallback, useEffect, useState } from "react";
import useColor from "@/hooks/useColor";
import Post from "@/components/common/post/views/Post";
import HomeViewModel from "../viewModel/HomeViewModel";
import { defaultNewFeedRepo } from "@/api/features/newFeed/NewFeedRepo";
import { useAuth } from "@/context/auth/useAuth";
import { useRouter } from "next/navigation";
import { Empty, Modal, Spin } from 'antd';
import AddPostScreen from "../../addPost/view/AddPostScreen";
import ProfileViewModel from "../../profile/viewModel/ProfileViewModel";
import { LoadingOutlined } from '@ant-design/icons';
import InfiniteScroll from "react-infinite-scroll-component";

const Homepage = () => {
  const { brandPrimary, backgroundColor, lightGray } = useColor();
  const { loading, newFeeds, setNewFeeds,fetchNewFeeds, loadMoreNewFeeds, deleteNewFeed, hasMore } = HomeViewModel(defaultNewFeedRepo);
  const { user, localStrings } = useAuth();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { friends, fetchMyFriends, page } = ProfileViewModel();

  useEffect(() => {
    if (user) {
      fetchMyFriends(page);
      fetchNewFeeds();
    }
  }, [page]);

  

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleDeleteNewFeed = async (id: string) => {
    await deleteNewFeed(id);
    setNewFeeds((prevNewFeeds) => prevNewFeeds.filter((post) => post.id !== id));
  }

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
            <p><b>{user?.family_name + " " + user?.name || localStrings.Public.Username}</b></p>
            <p style={{ color: "gray" }}>{localStrings.Public.Today}</p>
          </div>
        </div>
        <Modal
          centered
          title={localStrings.AddPost.NewPost}
          open={isModalVisible}
          onCancel={handleModalClose}
          width={800}
          footer={null}
        >
          <AddPostScreen onPostSuccess={() => setIsModalVisible(false)} fetchNewFeeds={fetchNewFeeds} />
        </Modal>
      </>
    );
  }, [user, localStrings, isModalVisible]);

  const renderFriends = () => {
    return (
      <div style={{
        marginInline: "10px",
        position: 'fixed',
        width: '280px',
        maxHeight: '400px',
        overflowY: 'auto',
        backgroundColor,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '8px',
      }}>
        {friends.map((user) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
            }}
            onClick={() => router.push(`/user/${user?.id}`)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={user.avatar_url}
                alt={user.name}
                style={{ width: 50, height: 50, borderRadius: "50%" }}
              />
              <span style={{ marginLeft: 10, fontWeight: "bold", fontSize: 16 }}>
                {user.family_name + " " + user.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="lg:flex mt-4 ">
      {/* Content */}
      {loading ?(
        <div className="flex-auto w-auto flex items-center justify-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>):(<>
         <div className="flex-auto w-auto flex flex-col items-center justify-center">
        {renderAddPost()}
        <div style={{ width: "100%" }}>
        {newFeeds?.length > 0 ? (
          <InfiniteScroll
          className="flex flex-col items-center"
            dataLength={newFeeds.length}
            next={loadMoreNewFeeds}
            hasMore={hasMore}
            loader={<Spin indicator={<LoadingOutlined spin />} size="large" />}>
               {newFeeds.map((item) => (
            <div key={item?.id} style={{ width: "100%", maxWidth: "600px" }}>
              <Post post={item} onDeleteNewFeed={handleDeleteNewFeed} />
              {item?.parent_post && (
                <div style={{ marginLeft: "20px" }}>
                  <Post post={item?.parent_post} isParentPost />
                </div>
              )}
            </div>
          ))}
            </InfiniteScroll>
          
        ) : (
          <div className="w-full h-screen flex justify-center items-center">
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
      <div className="flex-initial w-[300px] hidden xl:block">
        {renderFriends()}
      </div>
        </>)}
     
    </div>
  );
};

export default Homepage;