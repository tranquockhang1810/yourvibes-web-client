import React from "react";
import { Avatar, Input, Button, Modal, Upload } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
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

  return (
    <div className="flex justify-center items-center mt-4">
      <div
        onClick={handleBoxClick}
        className="flex items-center p-3 border border-gray-300 rounded-xl shadow-sm bg-white max-w-full w-[600px] cursor-pointer"
      >
        <Avatar size={40} icon={<UserOutlined />} className="mr-5" />
        <div
          className={`flex-1 mr-4 rounded-lg bg-white p-3 min-h-[35px] text-gray-500 border border-gray-300`} // Giảm chiều cao
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
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture"
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false} // Không upload thực tế
        >
          <Button icon={<UploadOutlined />} className="mb-4">
            Tải ảnh lên
          </Button>
        </Upload>

        {/* Hiển thị ảnh đã tải lên */}
        <div className="mt-4 flex flex-wrap">
          {fileList.map((file) => (
            <img
              key={file.uid}
              src={URL.createObjectURL(file.originFileObj)}
              alt="Uploaded preview"
              className="w-[120px] h-[120px] mr-3 mb-3 rounded-lg"
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default PostBar;
