import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { CreatePostRequestModel } from "@/api/features/post/models/CreatePostRequestModel";
import { PostRepo } from "@/api/features/post/PostRepo";
import { useAuth } from "@/context/auth/useAuth";
import { usePostContext } from "@/context/post/usePostContext";
import { useState } from "react";
import { UploadFile, UploadChangeParam, UploadProps } from "antd/es/upload";
import { convertMediaToFiles } from "@/utils/helper/TransferToFormData";
import { GetProp } from "antd";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

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
  const [postContent, setPostContent] = useState('');
  const [privacy, setPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<UploadFile[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);


  const createPost = async (data: CreatePostRequestModel) => {
    try {
      setCreateLoading(true);
      const response = await repo.createPost(data);
      if (!response?.error) {
        setPostContent('');
        clearSavedPost!();
        router.push("/profile?tabNum=1");
      } else {
        console.error("Error creating post:", response.error);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
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


  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);


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