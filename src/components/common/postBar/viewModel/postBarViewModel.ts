import { useState } from "react";
import { message } from "antd";

const usePostBarViewModel = () => {
  const [postContent, setPostContent] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);

  // Xử lý đăng bài viết
  const handlePost = () => {
    if (postContent.trim()) {
      message.success(`Bài viết của bạn: ${postContent}`);
      resetForm();
    } else {
      message.warning("Vui lòng nhập nội dung bài viết.");
    }
  };

  // Reset form sau khi đăng bài
  const resetForm = () => {
    setPostContent("");
    setFileList([]);
    setIsModalVisible(false);
  };

  // Xử lý khi người dùng hủy modal
  const handleCancel = () => {
    resetForm();
  };

  // Cập nhật danh sách file khi người dùng tải ảnh lên
  const handleUploadChange = ({ fileList: newFileList }: { fileList: any[] }) => {
    setFileList(newFileList);
  };

  // Hiển thị modal khi người dùng nhấn vào box
  const handleBoxClick = () => {
    setIsModalVisible(true);
  };

  return {
    postContent,
    setPostContent,
    isModalVisible,
    fileList,
    handlePost,
    resetForm,
    handleCancel,
    handleUploadChange,
    handleBoxClick,
  };
};

export default usePostBarViewModel;
