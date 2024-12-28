"use client";
import {
  Button,
  Form,
  Input,
  Avatar,
  Typography,
  Upload,
  Spin,
  GetProp,
  Select,
} from "antd";
import {
  CloseOutlined,
  PlusOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/useAuth";
import { usePostContext } from "@/context/post/usePostContext";
import EditPostViewModel from "../viewModel/EditPostViewModel";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { UploadFile, UploadProps } from "antd/es/upload";
import { useEffect, useState } from "react";

const { TextArea } = Input;
const { Text } = Typography;

interface EditPostScreenProps {
  id: string;
}

const EditPostScreen = ({ id }: EditPostScreenProps) => {
  const { user, localStrings } = useAuth();
  const savedPost = usePostContext();

  const {
    handlePreview,
    handleChange,
    updateLoading,
    postContent,
    setPostContent,
    originalImageFiles,
    setOriginalImageFiles,
    privacy,
    setPrivacy,
    updatePost,
    getDetailPost,
    fileList,
    handleSubmit,
    updateMedia,
  } = EditPostViewModel(defaultPostRepo, id);

  useEffect(() => {
    getDetailPost(id);
  }, [id]);
  
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const handleMediaChange = async (newMedia: any[]) => {
    await updateMedia(newMedia);
  };
  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Button
          icon={<CloseOutlined />}
          onClick={() => window.history.back()}
        />
        <Typography.Title level={4}>
          {localStrings.Post.EditPost}
        </Typography.Title>
        <Button type="primary" onClick={handleSubmit} loading={updateLoading}>
          {localStrings.Public.Save}
        </Button>
      </div>

      {/* User Info */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <Avatar src={user?.avatar_url} size="large" />
        <div style={{ marginLeft: "10px" }}>
          <Text strong>
            {user?.family_name + " " + user?.name ||
              localStrings.Public.UnknownUser}
          </Text>
        </div>
      </div>

      {/* Content Input */}
      <Form.Item>
        <TextArea
          rows={4}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder={localStrings.AddPost.WhatDoYouThink}
        />
      </Form.Item>

      {/* Image/Media Upload */}
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={(info) => {
          handleChange(info);
          const newMedia = info.fileList.map((file) => file.originFileObj);
          updateMedia(newMedia);
        }}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>

      {/* Privacy Text */}
      <div style={{ marginTop: "10px" }}>
        <Text>{localStrings.AddPost.PrivacyText}: </Text>
        <Select
          value={privacy}
          onChange={(value) => setPrivacy(value)}
          style={{ width: 120 }}
        >
          <Select.Option value={Privacy.PUBLIC}>Public</Select.Option>
          <Select.Option value={Privacy.FRIEND_ONLY}>Friends</Select.Option>
          <Select.Option value={Privacy.PRIVATE}>Private</Select.Option>
        </Select>
      </div>
    </div>
  );
};

export default EditPostScreen;
