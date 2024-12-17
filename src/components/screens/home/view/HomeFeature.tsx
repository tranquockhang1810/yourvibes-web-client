"use client";
import React, { useCallback, useEffect } from "react";
import useColor from "@/hooks/useColor";
import Post from "@/components/common/post/views/Post";
import HomeViewModel from "../viewModel/HomeViewModel";
import { defaultNewFeedRepo } from "@/api/features/newFeed/NewFeedRepo";
import { useAuth } from "@/context/auth/useAuth";
import { useRouter } from "next/navigation";
import PostBar from "@/components/common/postBar/view/postBar";

const Homepage = () => {
  const { brandPrimary, backgroundColor, lightGray } = useColor();
  const { loading, newFeeds, fetchNewFeeds, loadMoreNewFeeds, deleteNewFeed } =
    HomeViewModel(defaultNewFeedRepo);
  const { user, localStrings } = useAuth();
  const router = useRouter();

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
  }, [user]);

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
      <div className="border-none rounded-md border-solid border-gray-900 basis-2/4">
        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
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
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No posts available
            </p>
          )}

          {renderFooter()}
        </div>
      </div>
    </div>
  );
};

export default Homepage;