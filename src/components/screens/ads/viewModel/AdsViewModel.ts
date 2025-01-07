import {
  AdvertisePostRequestModel,
  AdvertisePostResponseModel,
} from "@/api/features/post/models/AdvertisePostModel";
import { PostResponseModel } from "@/api/features/post/models/PostResponseModel";
import { PostRepo } from "@/api/features/post/PostRepo";
import { useAuth } from "@/context/auth/useAuth";
import { useState } from "react";

const AdsViewModel = (repo: PostRepo) => {
  const { localStrings } = useAuth();

  // State quản lý trạng thái loading và dữ liệu
  const [loading, setLoading] = useState(false);
  const [adsLoading, setAdsLoading] = useState(false);
  const [post, setPost] = useState<PostResponseModel | undefined>(undefined);
  const [ads, setAdsPost] = useState<AdvertisePostResponseModel | undefined>(
    undefined
  );
  const [adsAll, setAdsAll] = useState<
    AdvertisePostResponseModel[] | undefined
  >(undefined);
  const [page, setPage] = useState<number>(1);

  //Lấy chi tiết bài viết

  const getPostDetail = async (id: string, newAds = false) => {
    try {
      setLoading(true);
      const res = await repo.getPostById(id);
      if (!res?.error) {
        setPost(res?.data);
        if (newAds && res?.data?.is_advertisement) {
          console.log(localStrings.Ads.AdvertisePostSuccess);
        }
      } else {
        console.error("Get Post Detail Failed:", res?.error?.message);
      }
    } catch (error: any) {
      console.error("Get Post Detail Error:", error?.message);
    } finally {
      setLoading(false);
    }
  };

  //Quảng cáo bài viết
  const advertisePost = async (params: AdvertisePostRequestModel) => {
    try {
      setAdsLoading(true);
      const res = await repo.advertisePost(params);
      if (!res?.error) {
        if (res?.data) {
          const result = window.open(res.data, '_blank');
          console.log("WebBrowser result:", result);
          await getPostDetail(params?.post_id || "", true);
          await getAdvertisePost(1, params?.post_id || "");
        }
      } else {
        console.error("Advertise Post Failed:", res?.error?.message);
      }
    } catch (error: any) {
      console.error("Advertise Post Error:", error?.message);
    } finally {
      setAdsLoading(false);
    }
  };

  /**
   * Lấy danh sách quảng cáo
   * @param page Trang hiện tại
   * @param post_id ID bài viết
   */
  const getAdvertisePost = async (page: number, post_id: string) => {
    try {
      setLoading(true);
      const res = await repo.getAdvertisePost({
        post_id: post_id,
        page: page,
        limit: 10,
      });
      if (res?.data?.length > 0) {
        setAdsPost(res?.data?.[0]);
        setAdsAll(Array.isArray(res?.data) ? res?.data : []);
      } else {
        setAdsPost(undefined);
        setAdsAll([]);
      }
    } catch (error: any) {
      console.error("Get Advertise Post Error:", error?.message);
    } finally {
      setLoading(false);
    }
  };

   const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  return {
    getTomorrow,
    loading,
    post,
    getPostDetail,
    advertisePost,
    adsLoading,
    getAdvertisePost,
    ads,
    setAdsPost,
    page,
    setPage,
    adsAll,
    setAdsAll,
  };
};

export default AdsViewModel;