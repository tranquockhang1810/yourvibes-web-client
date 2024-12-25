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
  Image,
  Select,
} from "antd";
import {
  CloseOutlined,
  PictureOutlined,
  PlusOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/useAuth";
import { usePostContext } from "@/context/post/usePostContext";
import AddPostViewModel from "../viewModel/AddpostViewModel";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { UploadFile, UploadProps } from "antd/es/upload";

const { TextArea } = Input;
const { Text } = Typography;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface AddPostScreenProps {
  onPostSuccess: () => void;
}

const AddPostScreen: React.FC<AddPostScreenProps> = ({ onPostSuccess }) => {
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
    handleSubmitPost,
    selectedMediaFiles,
    setSelectedMediaFiles,
    image,
    setImage,
    handleChange,
    handlePreview,
    fileList,
    previewImage,
    previewOpen,
    setPreviewOpen,
    setPreviewImage,
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

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

return (
    <div style={{ padding: "20px" }}>
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
        className="pt-4"
        accept="image/*,video/*"
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        onPreview={handlePreview}
        beforeUpload={() => false}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Select
          value={privacy}
          onChange={(value) => setPrivacy(value)}
          style={{ width: 120 }}
        >
          <Select.Option value={Privacy.PUBLIC}>{localStrings.Public.Everyone}</Select.Option>
          <Select.Option value={Privacy.FRIEND_ONLY}>{localStrings.Public.Friend}</Select.Option>
          <Select.Option value={Privacy.PRIVATE}>{localStrings.Public.Private}</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={() =>{handleSubmitPost()}}
          disabled={!postContent.trim() && selectedMediaFiles.length === 0}
          loading={createLoading}
        >
          {createLoading ? <Spin /> : localStrings.AddPost.PostNow}
        </Button>
      </div>
    </div>
  );
};

export default AddPostScreen;