import { PostResponseModel } from "@/api/features/post/models/PostResponseModel";
import { SharePostRequestModel } from "@/api/features/post/models/SharePostRequestModel";
import { UpdatePostRequestModel } from "@/api/features/post/models/UpdatePostRequestModel";
import { PostRepo } from "@/api/features/post/PostRepo";
import { useAuth } from "@/context/auth/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { message } from "antd";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";

const EditPostViewModel = (repo: PostRepo) => { 
 const { localStrings } = useAuth();
  const router = useRouter(); 

  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [postContent, setPostContent] = useState('');
  const [originalImageFiles, setOriginalImageFiles] = useState<any[]>([]);
  const [privacy, setPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);
  const [post, setPost] = useState<PostResponseModel | undefined>(undefined);
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [likedPost, setLikedPost] = useState<PostResponseModel | undefined>(undefined);
  const [shareLoading, setShareLoading] = useState<boolean>(false);
  const [hidePost, setHidePost] = useState<PostResponseModel[]>([]);

  const updatePost = async (data: UpdatePostRequestModel) => {
    setUpdateLoading(true);
    try {
      const res = await repo.updatePost(data);
      if (res && !res.error) {
        router.push('/profile?tabNum=1');
        message.success({
          content: localStrings.UpdatePost.UpdatePostSuccess,
        });
      } else {
        message.error({
          content: localStrings.UpdatePost.UpdatePostFailed,
        });
      }
    } catch (error) {
      message.error({
        content: localStrings.UpdatePost.UpdatePostFailed,
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const getDetailPost = async (id: string) => {
    try {
      setUpdateLoading(true);
      const res = await repo.getPostById(id);
      if (!res?.error) {
        setPost(res?.data);
        setPostContent(res?.data?.content || '');
        setPrivacy(res?.data?.privacy);
        setMediaIds(res?.data?.media?.map((item) => item?.id?.toString() || '') || []);
        const mediaFiles = res?.data?.media?.map((item) => ({
          uri: item?.media_url || '',
          fileName: item?.id?.toString() || '',
        })) as any[];
        setOriginalImageFiles(mediaFiles);
      } else {
        message.error({
          content: localStrings.Profile.Posts.GetOnePostFailed,
        });
        router.back();
      }
    } catch (err: any) {
      console.error(err);
      message.error({
        content: localStrings.Profile.Posts.GetOnePostFailed,
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleMedias = (mediaIds: string[], newMedias: any[]) => {
    const deletedMedias: string[] = [];
    const savedMedias: string[] = [];
    const newMediaFiles: any[] = [];
  
    newMedias?.forEach((item) => {
      if (!mediaIds.includes(item?.fileName as string)) {
        newMediaFiles.push(item);
      } else {
        const ids = mediaIds.find((id) => id === item?.fileName) as string;
        savedMedias.push(ids);
      }
    });
  
    const deletedMediaIds = mediaIds?.filter((id) => !savedMedias.includes(id));
  
    return {
      deletedMedias: deletedMediaIds,
      newMediaFiles,
    };
  };  

  const deletePost = async (id: string) => {
    try {
      setDeleteLoading(true);
      const res = await repo.deletePost(id);
      setHidePost((hidePost) => hidePost.filter((post) => post.id !== id));
      if (!res?.error) {
        message.success({
          content: localStrings.DeletePost.DeleteSuccess,
        });
        router.push('/profile?tabNum=posts');
      } else {
        message.error({
          content: localStrings.DeletePost.DeleteFailed,
        });
      }
    } catch (err: any) {
      console.error(err);
      message.error({
        content: localStrings.DeletePost.DeleteFailed,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const likePost = async (id: string) => {
    try {
      const res = await repo.likePost(id);
      if (!res?.error) {
        setLikedPost(res?.data);
      } else {
        message.error({
          content: localStrings.Post.LikePostFailed,
        });
      }
    } catch (error: any) {
      console.error(error);
      message.error({
        content: localStrings.Post.LikePostFailed,
      });
    }
  };

  const sharePost = async (id: string, data: SharePostRequestModel) => {
    try {
      setShareLoading(true);
      const res = await repo.sharePost(id, data);
      if (!res?.error) {
        message.success({
          content: localStrings.Post.SharePostSuccess,
        });
        router.push('/profile?tabNum=1');
      } else {
        message.error({
          content: localStrings.Post.SharePostFailed,
        });
      }
    } catch (error: any) {
      console.error(error);
      message.error({
        content: localStrings.Post.SharePostFailed,
      });
    } finally {
      setShareLoading(false);
    }
  };

  return {
    updateLoading,
    postContent,
    setPostContent,
    originalImageFiles,
    setOriginalImageFiles,
    privacy,
    setPrivacy,
    updatePost,
    getDetailPost,
    post,
    mediaIds,
    handleMedias,
    deletePost,
    deleteLoading,
    likePost,
    likedPost,
    setLikedPost,
    sharePost,
    shareLoading,
  };
};

export default EditPostViewModel;