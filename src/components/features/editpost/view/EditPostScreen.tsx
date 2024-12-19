"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Image } from "antd";
import useColor from "@/hooks/useColor";
import { useAuth } from "@/context/auth/useAuth";
import { CreatePostRequestModel } from "@/api/features/post/models/CreatePostRequestModel";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { usePostContext } from "@/context/post/usePostContext";
import EditPostViewModel from "../viewModel/EditPostViewModel";
import { UpdatePostRequestModel } from "@/api/features/post/models/UpdatePostRequestModel";
import { convertMediaToFiles } from "@/utils/helper/TransferToFormData";
import Toast from "react-toastify";
import { IoMdClose } from "react-icons/io";

const EditPostScreen = ({ id }: { id: string }) => {
  const { user, localStrings } = useAuth();
  const savedPost = usePostContext();
  const { brandPrimary, backgroundColor, brandPrimaryTap, lightGray } =
    useColor();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    postContent,
    setPostContent,
    updatePost,
    updateLoading,
    privacy,
    setPrivacy,
    getDetailPost,
    post,
    mediaIds,
    originalImageFiles,
    setOriginalImageFiles,
    handleMedias,
  } = EditPostViewModel(defaultPostRepo);

  const pickImage = async () => {
    setLoading(true);
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = true;

      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement)?.files;
        if (files) {
          const images: string[] = [];
          for (const file of files) {
            const reader = new FileReader();
            reader.onload = () => {
              images.push(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
          setOriginalImageFiles([...originalImageFiles, ...images]);
        }
      };

      input.click();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImageFile = [...originalImageFiles];
    updatedImageFile.splice(index, 1);
    setOriginalImageFiles(updatedImageFile);
  };

  const handleSubmitPost = async () => {
    if (postContent.trim() === "" && originalImageFiles.length === 0) {
      return;
    }
    const { detetedMedias, newMediaFiles } = handleMedias(
      mediaIds,
      originalImageFiles
    );

    const mediaFiles = await convertMediaToFiles(newMediaFiles);
    const updatedPost: UpdatePostRequestModel = {
      postId: id,
      content: postContent,
      privacy: privacy,
      location: "HCM",
      media: mediaFiles.length > 0 ? mediaFiles : undefined,
      media_ids: detetedMedias.length > 0 ? detetedMedias : undefined,
    };
    await updatePost(updatedPost);
  };

  const renderPrivacyText = () => {
    switch (privacy) {
      case Privacy.PUBLIC:
        return localStrings.Public.Everyone.toLowerCase();
      case Privacy.FRIEND_ONLY:
        return localStrings.Public.Friend.toLowerCase();
      case Privacy.PRIVATE:
        return localStrings.Public.Private.toLowerCase();
      default:
        return localStrings.Public.Everyone.toLowerCase();
    }
  };

  useEffect(() => {
    if (!post) {
      getDetailPost(id);
    }
  }, [post]);

  useEffect(() => {
    if (savedPost.savedPostContent) {
      setPostContent(savedPost.savedPostContent);
    }
    if (savedPost.savedPrivacy) {
      setPrivacy(savedPost.savedPrivacy);
    }
  }, [savedPost]);

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ backgroundColor, paddingTop: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 10px",
            alignItems: "center",
          }}
        >
          <Button onClick={() => navigate(-1)} style={{ border: "none" }}>
            <IoMdClose name="close" size={24} color={brandPrimary} />
          </Button>
          <h2>{localStrings.Post.EditPost}</h2>
        </div>
      </div>

      {/* Avatar and Input */}
      <div style={{ display: "flex", flexDirection: "row", marginBottom: 20 }}>
        <Image
          src={
            user?.avatar_url ||
            "https://res.cloudinary.com/dfqgxpk50/image/upload/v1712331876/samples/look-up.jpg"
          }
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
        <div style={{ marginLeft: 10, flex: 1 }}>
          <h4>
            {user?.family_name + " " + user?.name ||
              localStrings.Public.UnknownUser}
          </h4>
          <Input.TextArea
            placeholder={localStrings.AddPost.WhatDoYouThink}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            autoSize={{ minRows: 3 }}
            style={{ paddingLeft: 10, borderColor: brandPrimaryTap }}
          />
        </div>
      </div>

      {/* Image Upload */}
      {!post?.parent_post && (
        <div style={{ paddingRight: 10, paddingLeft: 60 }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {originalImageFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
                {file?.uri?.includes("mp4") || file?.uri?.includes("mov") ? (
                  <video
                    src={file?.uri}
                    controls
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 10,
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                ) : (
                  <Image
                    src={file?.uri}
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 10,
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                )}
                <Button
                  onClick={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    backgroundColor: "white",
                    borderRadius: "50%",
                    padding: 2,
                  }}
                >
                  <IoMdClose name="close" size={18} color={brandPrimary} />
                </Button>
              </div>
            ))}
            {/* Add Image Button */}
            <Button
              onClick={pickImage}
              style={{
                width: 75,
                height: 75,
                borderRadius: 10,
                backgroundColor: lightGray,
              }}
              disabled={loading}
            >
              {loading ? (
                <Input size="small" disabled />
              ) : (
                <IoMdClose name="image-outline" size={30} color={brandPrimary} />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Privacy Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <span style={{ color: "gray", fontSize: 14, paddingRight: 5 }}>
          {localStrings.AddPost.PrivacyText}
        </span>
        <Button
          onClick={() => {
            /* handle privacy change */
          }}
          style={{ color: "gray", fontSize: 14 }}
        >
          {renderPrivacyText()}
        </Button>
      </div>

      {/* Post Button */}
      <Button
        type="primary"
        onClick={handleSubmitPost}
        loading={updateLoading}
        style={{ marginTop: 20, width: "100%" }}
      >
        {localStrings.Public.Save}
      </Button>
    </div>
  );
};

export default EditPostScreen;