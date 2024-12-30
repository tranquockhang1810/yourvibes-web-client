"use client";
import React, { useCallback, useEffect, useState } from "react";
import useColor from "@/hooks/useColor";
import Post from "@/components/common/post/views/Post";
import HomeViewModel from "../viewModel/HomeViewModel";
import { defaultNewFeedRepo } from "@/api/features/newFeed/NewFeedRepo";
import { useAuth } from "@/context/auth/useAuth";
import { useRouter } from "next/navigation"; 
import { Modal, Spin } from 'antd';
import AddPostScreen from "../../addPost/view/AddPostScreen";
import ProfileViewModel from "../../profile/viewModel/ProfileViewModel";

const Homepage = () => {
  const { brandPrimary, backgroundColor, lightGray } = useColor();
  const { loading, newFeeds, fetchNewFeeds, loadMoreNewFeeds, deleteNewFeed } =
    HomeViewModel(defaultNewFeedRepo);
  const { user, localStrings } = useAuth();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {friends, fetchMyFriends} = ProfileViewModel();


  const handleModalClose = () => {
    setIsModalVisible(false); 
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
          <AddPostScreen onPostSuccess={() => setIsModalVisible(false)} />
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
        right: '10px',
      }}>
        {friends.map((user) => (
          <div
            key={user.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 10,
              borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer',
            }}
            onClick={() => router.push(`/user/${user?.id}`)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={user.avatar_url}
                alt={user.name}
                style={{ width: 50, height: 50, borderRadius: '50%' }}
              />
              <span style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>
                {user.family_name + ' ' + user.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <div style={{ padding: "10px", textAlign: "center" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchNewFeeds();
  }, []);

  return (
    <div className="flex mt-4 ">
      {/* Content */}
      <div className="flex-auto w-auto flex flex-col items-center justify-center">
        {renderAddPost()}
        {newFeeds?.length > 0 ? (
          newFeeds.map((item) => (
            <div key={item?.id} style={{ width: "100%", maxWidth: "600px" }}>
              <Post post={item}>
                {item?.parent_post && (
                  <Post post={item?.parent_post} isParentPost />
                )}
              </Post>
            </div>
          ))
        ) : (
          <div className="w-full h-screen flex justify-center items-center">
          <Spin tip="Loading...">
          </Spin>
        </div>
        )}
  
        {renderFooter()}
      </div>
      <div className="flex-initial w-[300px]">
        {renderFriends()}
      </div>
    </div>
  );
}
  
  export default Homepage;