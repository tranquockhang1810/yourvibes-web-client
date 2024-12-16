"use client";

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Typography,
  Spin,
  Space,
} from "antd";
import {
  CloseOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth/useAuth";
import AddPostViewModel from "@/components/screens/addPost/viewModel/AddpostViewModel";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import { convertMediaToFiles } from "@/utils/helper/TransferToFormData";
import { usePostContext } from "@/context/post/usePostContext";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { UploadFile, UploadChangeParam } from "antd/es/upload";

const { TextArea } = Input;
const { Text } = Typography;

const AddPostScreen = () => {
  const { user, localStrings } = useAuth();
  const savedPost = usePostContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    postContent,
    setPostContent,
    createPost,
    createLoading,
    privacy,
    setPrivacy,
  } = AddPostViewModel(defaultPostRepo, router);

  const [selectedMediaFiles, setSelectedMediaFiles] = useState<UploadFile[]>(
    []
  );

  // Hàm upload ảnh hoặc video
  const pickMedia = async ({ file }: UploadChangeParam) => {
    setLoading(true);
    try {
      if (file.originFileObj) {
        // Kiểm tra nếu file.type có giá trị hợp lệ
        if (file.type) {
          const fileType = file.type.split("/")[0];
          if (fileType === "image" || fileType === "video") {
            const newMedia: UploadFile = {
              uid: file.uid,
              name: file.name,
              status: "done",
              url: URL.createObjectURL(file.originFileObj),
              originFileObj: file.originFileObj,
            };
            setSelectedMediaFiles((prev) => [...prev, newMedia]);
          } else {
            console.error("File type not supported");
          }
        } else {
          console.error("File type is undefined");
        }
      } else {
        console.error("File object is missing originFileObj property");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
    } finally {
      setLoading(false);
    }
  };  

  // Hàm xoá ảnh hoặc video
  const removeMedia = (file: UploadFile) => {
    setSelectedMediaFiles((prev) =>
      prev.filter((item) => item.uid !== file.uid)
    );
  };

  // Xử lý đăng bài viết
  const handleSubmitPost = async () => {
    if (!postContent.trim() && selectedMediaFiles.length === 0) return;

    const mediaFiles = await convertMediaToFiles(
      selectedMediaFiles.map((file) => file.originFileObj)
    );

    const newPost = {
      content: postContent,
      privacy,
      location: "HCM",
      media: mediaFiles.length ? mediaFiles : undefined,
    };

    await createPost(newPost);
  };

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

  // Xử lý dữ liệu lưu trữ khi component được render
  useEffect(() => {
    if (savedPost.savedPostContent) {
      setPostContent(savedPost.savedPostContent);
    }
    if (savedPost.savedPrivacy) {
      setPrivacy(savedPost.savedPrivacy);
    }
  }, [savedPost]);
  // Hàm giải thoát tài nguyên URL khi không cần thiết nữa =))
  useEffect(() => {
    return () => {
      selectedMediaFiles.forEach((file) => {
        if (file.url) URL.revokeObjectURL(file.url);
      });
    };
  }, [selectedMediaFiles]);
  

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

      {/* Avatar và ô nhập */}
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

      {/* Khu vực upload ảnh hoặc video */}
      <Upload
        listType="picture-card"
        multiple
        accept="image/*,video/*"
        fileList={selectedMediaFiles}
        onRemove={removeMedia}
        beforeUpload={() => false}
        onChange={pickMedia}
      >
        {loading ? (
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Space>
          <Text type="secondary">{localStrings.AddPost.PrivacyText}</Text>
          <Button
            type="link"
            onClick={() => {
              savedPost?.setSavedPostContent!(postContent);
              savedPost?.setSavedPrivacy!(privacy);
              savedPost?.setSavedSelectedImageFiles!(selectedMediaFiles);
              router.push("/object");
            }}
          >
            {renderPrivacyText()}
          </Button>
        </Space>
        <Button
          type="primary"
          loading={createLoading}
          onClick={handleSubmitPost}
        >
          {localStrings.AddPost.PostNow}
        </Button>
      </div>
    </div>
  );
};



export default AddPostScreen;