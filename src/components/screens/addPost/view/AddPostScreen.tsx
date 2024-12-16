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
  
  const [selectedImageFiles, setSelectedImageFiles] = useState<UploadFile[]>([]); // Change the type to UploadFile[]

  
  // Hàm upload ảnh
  const pickImage = async ({ file }: UploadChangeParam) => {
    setLoading(true);
    try {
      if (file.originFileObj) {
        const newImage: UploadFile = {
          uid: file.uid, // uid từ file gốc
          name: file.name, // name từ file gốc
          status: "done",
          url: URL.createObjectURL(file.originFileObj), // Tạo URL từ Blob
          originFileObj: file.originFileObj, // Giữ lại đối tượng gốc
          lastModified: file.originFileObj.lastModified, // Thêm thuộc tính lastModified
          lastModifiedDate: new Date(file.originFileObj.lastModified), // Thêm lastModifiedDate
        };
        setSelectedImageFiles((prev) => [...prev, newImage]);
      } else {
        console.error("File object is missing originFileObj property");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Hàm xoá ảnh
  const removeImage = (file: UploadFile) => {
    setSelectedImageFiles((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  // Xử lý đăng bài viết
  const handleSubmitPost = async () => {
    if (!postContent.trim() && selectedImageFiles.length === 0) return;

    const mediaFiles = await convertMediaToFiles(
      selectedImageFiles.map((file) => file.originFileObj)
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

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <Button
          icon={<CloseOutlined />}
          type="text"
          onClick={() => router.back()} // Quay lại trang trước đó
        />
        <Text strong style={{ fontSize: "18px", marginLeft: "10px" }}>
          {localStrings.AddPost.NewPost}
        </Text>
      </div>

      {/* Avatar và ô nhập */}
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "20px" }}>
        <Avatar
          src={
            user?.avatar_url ||
            "https://res.cloudinary.com/dfqgxpk50/image/upload/v1712331876/samples/look-up.jpg"
          }
          size={40}
        />
        <div style={{ marginLeft: "10px", flex: 1 }}>
          <Text strong>
            {user?.family_name + " " + user?.name || localStrings.Public.UnknownUser}
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

      {/* Khu vực upload ảnh */}
      <Upload
        listType="picture-card"
        multiple
        fileList={selectedImageFiles}
        onRemove={removeImage}
        beforeUpload={() => false} // Ngăn tải lên tự động
        onChange={pickImage}
      >
        {loading ? <Spin /> : <PictureOutlined />}
      </Upload>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <Space>
          <Text type="secondary">{localStrings.AddPost.PrivacyText}</Text>
          <Button
            type="link"
            onClick={() => {
              savedPost?.setSavedPostContent!(postContent);
              savedPost?.setSavedPrivacy!(privacy);
              savedPost?.setSavedSelectedImageFiles!(selectedImageFiles);
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
