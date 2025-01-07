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
  convertMediaDataToFiles,
  convertMediaToFiles,
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
  const [selectedMediaFilesToSend, setSelectedMediaFilesToSend] = useState<
    any[]
  >([]);

  const getDetailPost = async (id: string) => {
    if (!repo) return;

    try {
      setGetPostLoading(true);
      const res = await repo.getPostById(id);
      console.log("API Response:", res); // Log the API response
      
      if (res && !res.error) {
        setPost(res.data);
        setPostContent(res.data?.content || "");
        setPrivacy(res.data?.privacy);
        setMediaIds(
          res.data?.media?.map((item) => item?.id?.toString() || "") || []
        );
        const mediaFiles = convertMediaDataToFiles(res.data?.media || []);
        
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

  const updatePost = async (data: UpdatePostRequestModel) => {
    if (!repo) return;

    try {
      setUpdateLoading(true);
      console.log("updatePost UpdatePostRequestModel:", data); // Log the request data
      const res = await repo.updatePost({
        ...data,
        media: data.media, // truyền mảng media vào trường media
      });
      console.log("API Response:", res); // Log the API response
      if (res && !res.error) {
        message.success(localStrings.UpdatePost.UpdatePostSuccess);
        await getNewFeed(); // Gọi API làm mới dữ liệu
        router.push("/profile?tabNum=posts");
      } else {
        message.error(localStrings.UpdatePost.UpdatePostFailed);
      }
    } catch (error) {
      console.error("Update Post Error:", error);
      message.error(localStrings.UpdatePost.UpdatePostFailed);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getNewFeed = async () => {
    await defaultNewFeedRepo.getNewFeed({ limit: 10, page: 1 });
  };

  const handleSubmit = async () => {
    if (!postContent.trim() && fileList.length === 0) return;
      // Debug giá trị đầu vào
  console.log("Media IDs (ban đầu)List:", mediaIds);
  console.log("New Media List:", fileList);
    const validFiles = fileList
      .map((file) => file.originFileObj)
      .filter((file): file is RcFile => !!file);
    const { deletedMedias, newMediaFiles } = handleMedias(mediaIds, validFiles);
      // Debug giá trị đầu ra
  console.log("Saved MediasList:", validFiles);
  
  console.log("Deleted Medias list:", deletedMedias);
  console.log("New Media Files List:", newMediaFiles);

    const updatePostRequest: UpdatePostRequestModel = {
      postId: id,
      content: postContent,
      privacy: privacy,
      media: newMediaFiles.length > 0 ? newMediaFiles : undefined,
      media_ids: deletedMedias.length > 0 ? deletedMedias : undefined,

    };
    console.log("Submit UpdatePostRequestModel:", updatePostRequest);
    await updatePost(updatePostRequest);
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

  const handleMedias = (mediaIds: string[], newMedias: RcFile[]) => {
    console.log("Media IDs (ban đầu):", mediaIds);
    console.log("New Medias (trước khi xử lý):", newMedias);
  
    const savedMedias: string[] = [];
    const newMediaFiles: RcFile[] = [];
  
    // Lọc qua các ảnh mới
    newMedias.forEach((item) => {
      if (item?.name && mediaIds.includes(item.name)) {
        savedMedias.push(item.name);
      } else {
        newMediaFiles.push(item);
      }
    });
  
    console.log("Saved Medias:", savedMedias);
    console.log("New Media Files:", newMediaFiles);
  
    const deletedMediaIds = mediaIds.filter((id) => !savedMedias.includes(id));
    console.log("Deleted Medias:", deletedMediaIds);
  
    return {
      deletedMedias: deletedMediaIds,
      newMediaFiles,
    };
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
      .filter((file): file is RcFile => !!file);

    const mediaFiles = await convertMediaToFiles(validFiles);
    setSelectedMediaFiles(mediaFiles);
  };

//   const handleChange: UploadProps["onChange"] = async ({
//     fileList: newFileList,
//   }) => {
//     console.log("File List Updated:", newFileList);
//     setFileList(newFileList); // Cập nhật danh sách file mới
  
//     // Phân loại ảnh cũ và ảnh mới
//     const validFiles = newFileList
//       .map((file) => file.originFileObj)
//       .filter((file): file is RcFile => !!file);
  
//     const oldFiles = newFileList.filter((file) => !file.originFileObj && file.url);
  
//     // Xử lý ảnh mới
//     const newMediaFiles = await convertMediaToFiles(validFiles);
  
//     // Thêm ảnh cũ vào danh sách media
//     const combinedMediaFiles = [
//       ...newMediaFiles,
//       ...oldFiles.map((file) => ({
//         uid: file.uid,
//         name: file.fileName || "unknown",
//         type: "image/jpeg", // Loại file mặc định, cần chỉnh nếu cần
//         url: file.url,
//       })),
//     ];
  
//     setSelectedMediaFiles(combinedMediaFiles); // Cập nhật danh sách media đã xử lý
//     console.log("Old Files:", oldFiles);
// console.log("New Media Files (converted):", newMediaFiles);
// console.log("Combined Media Files:", combinedMediaFiles);

//   };
  
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
    originalImageFiles
  };
};

export default EditPostViewModel;