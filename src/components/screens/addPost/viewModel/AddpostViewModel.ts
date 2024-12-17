import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { CreatePostRequestModel } from "@/api/features/post/models/CreatePostRequestModel";
import { PostRepo } from "@/api/features/post/PostRepo";
import { useAuth } from "@/context/auth/useAuth";
import { usePostContext } from "@/context/post/usePostContext";
import { useState } from "react";
import { UploadFile, UploadChangeParam, UploadProps } from "antd/es/upload";
import { convertMediaToFiles } from "@/utils/helper/TransferToFormData";
import { GetProp } from "antd";
import { RcFile } from "antd/es/upload";
import { TransferToFormData } from "@/utils/helper/TransferToFormData";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AddPostViewModel = (repo: PostRepo, router: any) => {
  const { localStrings } = useAuth();
  const { clearSavedPost } = usePostContext();
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [postContent, setPostContent] = useState("");
  const [privacy, setPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<UploadFile[]>(
    []
  );
  const [image, setImage] = useState<File | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const createPost = async (data: CreatePostRequestModel) => {
    try {
      setCreateLoading(true);
      const response = await repo.createPost(data);

      if (response?.error) {
        console.error("Lỗi khi tạo bài viết:", response.error);
      } else {
        setPostContent("");
        clearSavedPost?.();
        router.push("/profile?tabNum=1");
      }
    } catch (error) {
      console.error("Lỗi không mong muốn:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  // Xử lý đăng bài viết
  const handleSubmitPost = async () => {
    if (!postContent.trim() && fileList.length === 0) return;
  
    const validFiles = fileList
      .map((file) => file.originFileObj)
      .filter((file): file is RcFile => !!file);
  
    const mediaFiles = await convertMediaToFiles(validFiles);
  
    // Chuyển đổi mediaFiles sang dạng file
    const mediaFilesAsFiles = mediaFiles.map((file) => {
      if (file.uri) {
        const blob = new Blob([file.uri], { type: file.type });
        return new File([blob], file.name, { type: file.type });
      } else {
        console.log(`File ${file.name} không có URI, bỏ qua`);
        return null;
      }
    }).filter((file) => file !== null);
  
    const formData = TransferToFormData({
      content: postContent,
      privacy,
      media: mediaFilesAsFiles,
    });
  
    const createPostRequestModel: CreatePostRequestModel = {
      content: postContent,
      privacy: privacy,
      media: mediaFilesAsFiles, // Đảm bảo rằng media được truyền đúng
    };
  
    await createPost(createPostRequestModel);
  };

  const handlePreview = async (file: UploadFile) => {
    let preview = file.url || file.preview;

    if (!preview && file.originFileObj) {
      preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(preview || "");
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    const validFiles = newFileList
      .map((file) => file.originFileObj)
      .filter((file): file is RcFile => !!file); // Lọc các file hợp lệ

    const mediaFiles = await convertMediaToFiles(validFiles); // Chuyển đổi thành URI hợp lệ
    setSelectedMediaFiles(mediaFiles);
  };

  return {
    createLoading,
    createPost,
    postContent,
    setPostContent,
    privacy,
    setPrivacy,
    handleSubmitPost,
    selectedMediaFiles,
    setSelectedMediaFiles,
    image,
    setImage,
    handlePreview,
    handleChange,
    fileList,
    previewOpen,
    setPreviewOpen,
    previewImage,
    setPreviewImage,
  };
};

export default AddPostViewModel;