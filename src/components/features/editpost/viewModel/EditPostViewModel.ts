import { PostResponseModel } from "@/api/features/post/models/PostResponseModel";
import { SharePostRequestModel } from "@/api/features/post/models/SharePostRequestModel";
import { UpdatePostRequestModel } from "@/api/features/post/models/UpdatePostRequestModel";
import { PostRepo } from "@/api/features/post/PostRepo";
import { useAuth } from "@/context/auth/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { message } from "antd";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { UploadFile, UploadChangeParam, UploadProps } from "antd/es/upload";
import { RcFile } from "antd/es/upload";
import {
  convertMediaToFiles,
  TransferToFormData,
} from "@/utils/helper/TransferToFormData";
import { GetProp } from "antd";
//UserLikePost
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import { LikeUsersModel } from "@/api/features/post/models/LikeUsersModel";
import { Modal } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const EditPostViewModel = (
  repo: PostRepo | undefined,
  id: string | undefined,
  postId: string
) => {
  const { localStrings } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState<PostResponseModel | undefined>(undefined);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [postContent, setPostContent] = useState("");
  const [originalImageFiles, setOriginalImageFiles] = useState<any[]>([]);
  const [privacy, setPrivacy] = useState<Privacy | undefined>(Privacy.PUBLIC);
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [likedPost, setLikedPost] = useState<PostResponseModel | undefined>(
    undefined
  );
  const [shareLoading, setShareLoading] = useState<boolean>(false);
  const [hidePost, setHidePost] = useState<PostResponseModel[]>([]);
  const [getPostLoading, setGetPostLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<any[]>([]);
  const [userLikePost, setUserLikePost] = useState<LikeUsersModel[]>([]);

  const getDetailPost = async (id: string) => {
    if (!repo) return;

    try {
      setGetPostLoading(true);
      const res = await repo.getPostById(id);
      if (res && !res.error) {
        setPost(res.data);
        setPostContent(res.data?.content || "");
        setPrivacy(res.data?.privacy);
        setMediaIds(
          res.data?.media?.map((item) => item?.id?.toString() || "") || []
        );
        const mediaFiles = res.data?.media?.map((item) => ({
          uri: item?.media_url || "",
          fileName: item?.id?.toString() || "",
        })) as any[];
        setOriginalImageFiles(mediaFiles);
      } else {
        message.error(localStrings.Profile.Posts.GetOnePostFailed);
        // router.back();
      }
    } catch (err: any) {
      console.error(err);
      message.error(localStrings.Profile.Posts.GetOnePostFailed);
    } finally {
      setGetPostLoading(false);
    }
  };

  useEffect(() => {
    if (id && !post && repo) {
      getDetailPost(id);
    }
  }, [id, post, repo]);

  const updatePost = async (data: UpdatePostRequestModel) => {
    if (!repo) return;

    try {
      setUpdateLoading(true);
      const res = await repo.updatePost(data);
      if (res && !res.error) {
        // router.push('/profile?tab');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateLoading(false);
    }
  };
  const handleSubmit = async () => {
    const data: UpdatePostRequestModel = {
      postId: id,
      content: postContent,
      privacy: privacy,
    };
    await updatePost(data);
  };
  const deletePost = async (id: string) => {
    if (!repo) return;

    try {
      setDeleteLoading(true);
      const res = await repo.deletePost(id);
      setHidePost((hidePost) => hidePost.filter((post) => post.id !== id));
      if (!res?.error) {
        message.success(localStrings.DeletePost.DeleteSuccess);
        router.push("/profile?tabNum=posts");
      } else {
        message.error(localStrings.DeletePost.DeleteFailed);
      }
    } catch (err: any) {
      console.error(err);
      message.error(localStrings.DeletePost.DeleteFailed);
    } finally {
      setDeleteLoading(false);
    }
  };

  const likePost = async (id: string) => {
    if (!repo) return;

    try {
      const res = await repo.likePost(id);
      if (!res?.error) {
        setLikedPost(res?.data);
      } else {
        message.error(localStrings.Post.LikePostFailed);
      }
    } catch (error: any) {
      console.error(error);
      message.error(localStrings.Post.LikePostFailed);
    }
  };

  const sharePost = async (id: string, data: SharePostRequestModel) => {
    if (!repo) return;

    try {
      setShareLoading(true);
      const res = await repo.sharePost(id, data);
      if (!res?.error) {
        message.success(localStrings.Post.SharePostSuccess);
        router.push("/profile?tabNum=1");
      } else {
        message.error(localStrings.Post.SharePostFailed);
      }
    } catch (error: any) {
      console.error(error);
      message.error(localStrings.Post.SharePostFailed);
    } finally {
      setShareLoading(false);
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

  // Xử lý đăng bài viết
  const handleSubmitPost = async () => {
    if (!postContent.trim() && fileList.length === 0) return;

    const validFiles = fileList
      .map((file) => file.originFileObj)
      .filter((file): file is RcFile => !!file);

    const mediaFiles = await convertMediaToFiles(validFiles);

    // Chuyển đổi mediaFiles sang dạng file
    const mediaFilesAsFiles = mediaFiles
      .map((file) => {
        if (file.uri) {
          const blob = new Blob([file.uri], { type: file.type });
          return new File([blob], file.name, { type: file.type });
        } else {
          console.log(`File ${file.name} không có URI, bỏ qua`);
          return null;
        }
      })
      .filter((file) => file !== null);

    const formData = TransferToFormData({
      content: postContent,
      privacy,
      media: mediaFilesAsFiles,
    });

    const UpdatePostRequestModel: UpdatePostRequestModel = {
      content: postContent,
      privacy: privacy,
      media: mediaFilesAsFiles, // Đảm bảo rằng media được truyền đúng
    };

    await updatePost(UpdatePostRequestModel);
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

  const updateMedia = async (newMedia: any[]) => {
    const mediaIds = newMedia.map((item) => item.fileName);
    const originalImageFiles = newMedia.map((item) => ({
      uri: item.uri,
      fileName: item.fileName,
    }));

    setMediaIds(mediaIds);
    setOriginalImageFiles(originalImageFiles);
  };

  const fetchUserLikePosts = async (postId: string) => {
    const response = await defaultPostRepo.getPostLikes({
      postId: postId,
      page: 1,
      limit: 10,
    }); 
    setUserLikePost(response?.data);
  }; 

  return {
    updateMedia,
    handleSubmit,
    handlePreview,
    handleChange,
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
    hidePost,
    setHidePost,
    getPostLoading,
    previewOpen,
    setPreviewOpen,
    previewImage,
    setPreviewImage,
    selectedMediaFiles,
    setSelectedMediaFiles,
    handleSubmitPost,
    fileList,
    setFileList,
    fetchUserLikePosts,
    userLikePost,
    setUserLikePost,
  };
};

export default EditPostViewModel;