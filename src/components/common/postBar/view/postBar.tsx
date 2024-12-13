import React from "react";
import { Avatar, Input, Button, Modal, Upload } from "antd";
import { UserOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import usePostBarViewModel from "../viewModel/postBarViewModel";

const PostBar = () => {
  const {
    postContent,
    setPostContent,
    isModalVisible,
    fileList,
    handlePost,
    handleCancel,
    handleUploadChange,
    handleBoxClick,
  } = usePostBarViewModel();

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="flex justify-center items-center mt-4">
      <div
        onClick={handleBoxClick}
        className="flex items-center p-3 border border-gray-300 rounded-xl shadow-sm bg-white max-w-full w-[600px] cursor-pointer"
      >
        <Avatar size={40} icon={<UserOutlined />} className="mr-5" />
        <div
          className={`flex-1 mr-4 rounded-lg bg-white p-3 min-h-[35px] text-gray-500 border border-gray-300`}
        >
          {postContent || "Hôm nay bạn thế nào?"}
        </div>
      </div>

      {/* Modal đăng bài */}
      <Modal
        title="Đăng bài viết"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handlePost}>
            Đăng
          </Button>,
        ]}
        width={600}
      >
        <Input
          placeholder="Nhập nội dung bài viết..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="mb-4"
        />
        <Upload
          className="pt-4"
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false} 
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
      </Modal>
    </div>
  );
};

export default PostBar;
