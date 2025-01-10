import { NewFeedResponseModel } from "@/api/features/newFeed/Model/NewFeedModel";
import { NewFeedRepo } from "@/api/features/newFeed/NewFeedRepo";
import { useAuth } from "@/context/auth/useAuth";
import { message } from "antd";
import { useState, useRef } from "react";

const HomeViewModel = (repo: NewFeedRepo) => {
  const [newFeeds, setNewFeeds] = useState<NewFeedResponseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { localStrings } = useAuth();
  const limit = 20;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchNewFeeds = async (newPage: number = 1) => {
    try {
      setLoading(true);
      const response = await repo.getNewFeed({
        page: newPage,
        limit: limit,
      });
      if (!response?.error) {
        if (newPage === 1) {
          setNewFeeds(response?.data || []);
        } else {
          setNewFeeds((prevNewFeeds) => [
            ...prevNewFeeds,
            ...(response?.data || []),
          ]);
        }
        const { page: currentPage, limit: currentLimit, total: totalRecords } =
          response?.paging;
        setTotal(totalRecords);
        setPage(currentPage);
        setHasMore(currentPage * currentLimit < totalRecords);
      } else {
        // Handle error
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNewFeed = async (id: string) => {
    try {
      setLoading(true);
      const res = await repo.deleteNewFeed(id);
      setNewFeeds((newFeeds) =>
        newFeeds.filter((post) => post.id !== id)
      );
      if (!res?.error) {
        message.success(localStrings.DeletePost.DeleteSuccess);
      } else {
        message.error(localStrings.DeletePost.DeleteFailed);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNewFeeds = () => {
    if (!loading && hasMore) {
      fetchNewFeeds(page + 1);
    }
  };


  return {
    newFeeds,
    loading,
    fetchNewFeeds,
    loadMoreNewFeeds,
    deleteNewFeed,
  };
};

export default HomeViewModel;