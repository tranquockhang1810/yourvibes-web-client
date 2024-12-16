import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { CreatePostRequestModel } from "@/api/features/post/models/CreatePostRequestModel";
import { PostRepo } from "@/api/features/post/PostRepo";
import { useAuth } from "@/context/auth/useAuth";
import { usePostContext } from "@/context/post/usePostContext";
import { useState } from "react";
import { UploadFile, UploadChangeParam } from "antd/es/upload";
import { convertMediaToFiles } from "@/utils/helper/TransferToFormData";

const AddPostViewModel = (repo: PostRepo, router: any) => {
  const { localStrings } = useAuth();
  const { clearSavedPost } = usePostContext();
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [postContent, setPostContent] = useState('');
  const [privacy, setPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<UploadFile[]>([]);
  const [image, setImage] = useState<File | null>(null);

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

  // Hàm xử lý khi chọn ảnh
  const handleImageChange = (info: any) => {
    if (info.file.status === "done") {
      setImage(info.file.originFileObj); // Lưu ảnh vào state
    }
  };

  // Xử lý khi người dùng chọn ảnh từ file input
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // Lưu file vào state
    }
  };

  // Hàm upload ảnh hoặc video
  const pickMedia = async ({ file }: UploadChangeParam) => {
    setCreateLoading(true);
    try {
      if (file.originFileObj) {
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
            alert(localStrings.AddPost.CreatePostFailed); // Thông báo loại file không hỗ trợ
          }
        }
      }
    } catch (error) {
      console.error("Error uploading media:", error);
    } finally {
      setCreateLoading(false);
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

  return {
    createLoading,
    createPost,
    postContent,
    setPostContent,
    privacy,
    setPrivacy,
    handleImageChange,
    handleSelectImage,
    pickMedia,
    removeMedia,
    handleSubmitPost,
    selectedMediaFiles,
    setSelectedMediaFiles,
    image,
    setImage,
  };
};

export default AddPostViewModel;