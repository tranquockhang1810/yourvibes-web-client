import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { CreatePostRequestModel } from "@/api/features/post/models/CreatePostRequestModel";
import { PostRepo } from "@/api/features/post/PostRepo";
import { useAuth } from "@/context/auth/useAuth";
import { usePostContext } from "@/context/post/usePostContext";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const AddPostViewModel = (repo: PostRepo, router: any) => {
  const { localStrings } = useAuth();
  const { clearSavedPost } = usePostContext();
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [postContent, setPostContent] = useState('');
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [privacy, setPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);

  const onDrop = (acceptedFiles: File[]) => {
    setSelectedImageFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
  });

  const createPost = async (data: CreatePostRequestModel) => {
    try {
      setCreateLoading(true);
      const response = await repo.createPost(data);
      if (!response?.error) {
        setPostContent('');
        setSelectedImageFiles([]);
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

  return {
    createLoading,
    createPost,
    postContent,
    setPostContent,
    selectedImageFiles,
    setSelectedImageFiles,
    privacy,
    setPrivacy,
    getRootProps,
    getInputProps,
  };
};

export default AddPostViewModel;