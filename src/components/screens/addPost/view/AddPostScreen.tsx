"use client";
import { Button, Form, Input, Avatar, Typography, Upload, Spin, Space } from "antd";
import { CloseOutlined, PictureOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/useAuth";
import { usePostContext } from "@/context/post/usePostContext";
import AddPostViewModel from "../viewModel/AddpostViewModel";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { UploadFile } from "antd/es/upload";

const { TextArea } = Input;
const { Text } = Typography;

const AddPostScreen = () => {
  const { user, localStrings } = useAuth();
  const savedPost = usePostContext();
  const router = useRouter();
  const {
    postContent,
    setPostContent,
    createPost,
    createLoading,
    privacy,
    setPrivacy,
    handleImageChange,
    handleSelectImage,
    pickMedia,
    removeMedia,
    handleSubmitPost,
    selectedMediaFiles,
    setSelectedMediaFiles,
    image,
    setImage,
  } = AddPostViewModel(defaultPostRepo, router);

  // Hiển thị chế độ quyền riêng tư
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

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <Button
          icon={<CloseOutlined />}
          type="text"
          onClick={() => router.back()}
        />
        <Text strong style={{ fontSize: "18px", marginLeft: "10px" }}>
          {localStrings.AddPost.NewPost}
        </Text>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <Avatar
          src={
            user?.avatar_url ||
            "https://res.cloudinary.com/dfqgxpk50/image/upload/v1712331876/samples/look-up.jpg"
          }
          size={40}
        />
        <div style={{ marginLeft: "10px", flex: 1 }}>
          <Text strong>
            {user?.family_name + " " + user?.name ||
              localStrings.Public.UnknownUser}
          </Text>
          <Form.Item>
            <TextArea
              placeholder={localStrings.AddPost.WhatDoYouThink}
              autoSize={{ minRows: 3, maxRows: 5 }}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </Form.Item>
        </div>
      </div>

      <Upload
        listType="picture-card"
        multiple
        accept="image/*,video/*"
        fileList={selectedMediaFiles}
        onRemove={removeMedia}
        beforeUpload={() => false}
        onChange={pickMedia}
      >
        {createLoading ? (
          <Spin />
        ) : (
          <div>
            <PictureOutlined
              style={{ fontSize: "24px", marginRight: "10px" }}
            />
            <VideoCameraOutlined style={{ fontSize: "24px" }} />
          </div>
        )}
      </Upload>

      <div style={{ marginTop: "20px" }}>
        {selectedMediaFiles.map((file) => (
          <div key={file.uid} style={{ marginBottom: "10px" }}>
            {file.type && file.type.split("/")[0] === "image" ? (
              <img
                src={file.url}
                alt={file.name}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ) : file.type && file.type.split("/")[0] === "video" ? (
              <video
                controls
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              >
                <source src={file.url} />
              </video>
            ) : null}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: "14px" }}>
          <Text>{renderPrivacyText()}</Text>
        </div>
        <Button
          type="primary"
          onClick={handleSubmitPost}
          disabled={!postContent.trim() && selectedMediaFiles.length === 0}
        >
          {createLoading ? <Spin /> : localStrings.AddPost.PostNow}
        </Button>
      </div>
    </div>
  );
};

export default AddPostScreen;