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
  message,
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
  postId: string;
  onEditPostSuccess?: () => void;
}

const EditPostScreen = ({
  id,
  postId,
  onEditPostSuccess,
}: EditPostScreenProps) => {
  const { user, localStrings } = useAuth();
  const savedPost = usePostContext();

  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const {
    handlePreview,
    handleChange,
    updateLoading,
    postContent,
    setPostContent,
    privacy,
    setPrivacy,
    getDetailPost,
    fileList,
    handleSubmit,
    updateMedia,
    selectedMediaFiles,
    getNewFeed,
  } = EditPostViewModel(defaultPostRepo, id, postId);

  useEffect(() => {
    getDetailPost(id);
  }, [id]);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

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
        <Typography.Title level={4}>
          {localStrings.Post.EditPost}
        </Typography.Title>
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
        onPreview={(file) => {
          let preview = file.url || file.preview;

          if (!preview && file.originFileObj) {
            preview = URL.createObjectURL(file.originFileObj);
          }

          setPreviewImage(preview || "");
          setPreviewOpen(true);
        }}
        onChange={(info) => {
          handleChange(info);
          const newMedia = info.fileList.map((file) => file.originFileObj);
          updateMedia(newMedia);
        }}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>

      {/* Privacy Text */}
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "auto" }}>
          <Text style={{}}>{localStrings.AddPost.PrivacyText}: </Text>
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
        <div style={{ marginLeft: "auto" }}>
          <Button
            type="primary"
            onClick={() => {
              handleSubmit()
                .then(() => {
                  if (onEditPostSuccess) {
                    onEditPostSuccess(); // Đóng màn hình chỉnh sửa (Modal hoặc Component)
                  }
                  getNewFeed(); // Làm mới danh sách bài viết
                })
                .catch((error) => {
                  console.error("Error during post update:", error);
                  message.error(localStrings.PostDetails.Error);
                });
            }}
            disabled={!postContent.trim() && selectedMediaFiles.length === 0}
            loading={updateLoading}
          >
            {localStrings.Public.Save}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPostScreen;
