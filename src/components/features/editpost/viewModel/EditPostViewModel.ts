import { PostResponseModel } from "@/api/features/post/models/PostResponseModel";
import { SharePostRequestModel } from "@/api/features/post/models/SharePostRequestModel";
import { UpdatePostRequestModel } from "@/api/features/post/models/UpdatePostRequestModel";
import { PostRepo } from "@/api/features/post/PostRepo";
import { useAuth } from "@/context/auth/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { message } from "antd";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { UploadFile, UploadProps } from "antd/es/upload";
import { RcFile } from "antd/es/upload";
import {
  convertMediaToFiles,
  TransferToFormData,
} from "@/utils/helper/TransferToFormData";
import { GetProp } from "antd";
import { LikeUsersModel } from "@/api/features/post/models/LikeUsersModel";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import { defaultNewFeedRepo } from "@/api/features/newFeed/NewFeedRepo";

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
  const [modalVisible, setModalVisible] = useState(false);

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
        setFileList(mediaFiles); // Cập nhật giá trị của fileList
      } else {
        message.error(localStrings.Profile.Posts.GetOnePostFailed);
      }
    } catch (err: any) {
      console.error(err);
      message.error(localStrings.Profile.Posts.GetOnePostFailed);
    } finally {
      setGetPostLoading(false);
    }
  };

  const handleMediaChange = (info: UploadProps) => {
    if (info.fileList) {
      const newMedia = info.fileList
        .filter((file): file is RcFile => file !== undefined)
        .map((file) => ({
          ...file,
          originFileObj: file,
        }));
      updateMedia(newMedia);
      setFileList(newMedia); // Cập nhật giá trị của fileList
    }
  };

  useEffect(() => {
    if (selectedMediaFiles.length > 0) {
      setFileList(selectedMediaFiles);
    }
  }, [selectedMediaFiles]);

  const updatePost = async (data: UpdatePostRequestModel) => {
    if (!repo) return;

    try {
      setUpdateLoading(true);
      const res = await repo.updatePost({
        ...data,
        media_ids: mediaIds, // truyền id media từ post id vào trường media_ids
      });
      if (res && !res.error) {
        message.success(localStrings.UpdatePost.UpdatePostSuccess);
        await getNewFeed(); // Gọi API làm mới dữ liệu
        router.push("/profile?tabNum=posts");
      } else {
        message.error(localStrings.UpdatePost.UpdatePostFailed);
      }
    } catch (error) {
      console.error(error);
      message.error(localStrings.UpdatePost.UpdatePostFailed);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getNewFeed = async () => {
    await defaultNewFeedRepo.getNewFeed({ limit: 10, page: 1 });
  };

  const handleSubmit = async () => {
    const data: UpdatePostRequestModel = {
      postId: id,
      content: postContent,
      privacy: privacy,
      media: selectedMediaFiles,
      media_ids: mediaIds,
    };
    await updatePost(data);
    setModalVisible(false); // Đóng Modal sau khi cập nhật
  };

  useEffect(() => {
    if (!updateLoading && post) {
      getNewFeed(); // Làm mới dữ liệu
    }
  }, [updateLoading]);

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

  const updateMedia = (media: any[]) => {
    const mediaFiles = media.map((item) => ({
      uri: item?.originFileObj?.uri || "",
      fileName: item?.originFileObj?.name || "",
    }));
    setSelectedMediaFiles(mediaFiles);
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
    handlePreview,
    handleChange,
    updateLoading,
    postContent,
    setPostContent,
    privacy,
    setPrivacy,
    getDetailPost,
    fileList,
    handleSubmit,
    updateMedia,
    selectedMediaFiles,
    getNewFeed,
    previewImage,
    setMediaIds,
    setPreviewImage,
    setFileList,
    deleteLoading,
    likePost,
    likedPost,
    setLikedPost,
    sharePost,
    shareLoading,
    deletePost,
    updatePost,
    fetchUserLikePosts,
    userLikePost,
    setUserLikePost,
  };
};

export default EditPostViewModel;
