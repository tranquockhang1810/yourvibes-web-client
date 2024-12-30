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

const Homepage = () => {
  const { brandPrimary, backgroundColor, lightGray } = useColor();
  const { loading, newFeeds, fetchNewFeeds, loadMoreNewFeeds, deleteNewFeed } =
    HomeViewModel(defaultNewFeedRepo);
  const { user, localStrings } = useAuth();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        <Modal centered title={localStrings.AddPost.NewPost} 
        open={isModalVisible} onCancel={() => setIsModalVisible(false)} width={800} footer={null}>
          <AddPostScreen onPostSuccess={() => {
            setIsModalVisible(false);
            fetchNewFeeds();
          }} />
        </Modal>
     </>
    );
  }, [user, localStrings, isModalVisible]);

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
    <div className="flex justify-center items-center mt-4">
      <div className="rounded-md border-solid border-gray-900 basis-2/4">
        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", marginTop: "50px" }}>
          {renderAddPost()}
          {newFeeds?.length > 0 ? (
            newFeeds.map((item) => (
              <div key={item?.id}>
                <Post post={item}>
                  {item?.parent_post && (
                    <Post post={item?.parent_post} isParentPost />
                  )}
                </Post>
              </div>
            ))
          ) :  (
            <div className="w-full h-screen flex justify-center items-center">
            <Spin tip="Loading...">
            </Spin>
          </div>
          )}

          {renderFooter()}
        </div>
      </div>
    </div>
  );
};

export default Homepage;