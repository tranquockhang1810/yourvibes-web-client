import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { CreatePostRequestModel } from "@/api/features/post/models/CreatePostRequestModel";
import { PostRepo } from "@/api/features/post/PostRepo";
import { useAuth } from "@/context/auth/useAuth";
import { usePostContext } from "@/context/post/usePostContext"; 
import { useState } from "react"; 
import { useRouter } from 'next/router'; 

const AddPostViewModel = (repo: PostRepo) => {
  const { localStrings } = useAuth();
  const { clearSavedPost } = usePostContext();
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [postContent, setPostContent] = useState('');
  const [selectedImageFiles, setSelectedImageFiles] = useState<ImagePickerAsset[]>([]);
  const [privacy, setPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);
  const router = useRouter();
  const createPost = async (data: CreatePostRequestModel) => {
    try {
      setCreateLoading(true);
      const response = await repo.createPost(data);
      if (!response?.error) { 
        setPostContent('');
        setSelectedImageFiles([]);
        clearSavedPost!();
        router.push("/(tabs)/profile?tabNum=1");
      } else { 
      }
    } catch (err: any) {
      console.error( err); 
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
    setPrivacy
  };
};

export default AddPostViewModel;