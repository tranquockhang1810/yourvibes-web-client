import { NotificationResponseModel } from '@/api/features/notification/models/NotifiCationModel';
import { NotifiCationRepo } from '@/api/features/notification/NotifiCationRepo';
import { useState } from 'react';

const NotifiCationViewModel = (repo: NotifiCationRepo) => {
    const [notifications, setNotifications] = useState<NotificationResponseModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 20;

    const fetchNotifications = async (newPage: number = 1) => {
        try {
            setLoading(true);
            const response = await repo.getNotifications({
                sort_by: 'created_at',
                isDescending: true,
                page: newPage,
                limit: limit,
            });

            if (!response?.error) {
                if (newPage === 1) {
                    setNotifications(response?.data || []);
                } else {
                    setNotifications((prevNotifications) => [...prevNotifications, ...(response?.data || [])]);
                }
                const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;

                setTotal(totalRecords);
                setPage(currentPage);
                setHasMore(currentPage * currentLimit < totalRecords);

            } else {
                console.error(response?.message);
            }
        } catch (error: any) {
            console.error(error);
           
        } finally {
            setLoading(false);
        }
    };

    const updateNotification = async (data: NotificationResponseModel) => {
        if (!data.id) {
            
            return;
        }

        try {
            setLoading(true);
            const response = await repo.updateNotification(data);
            if (!response?.error) {
                fetchNotifications();
            } else {
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateAllNotification = async () => {
        try {
            setLoading(true);
            const response = await repo.updateAllNotification();
            if (!response?.error) {
                fetchNotifications();
            } else {
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreNotifi = async () => {
        if (!hasMore || loading) return;

        const nextPage = page + 1;
        await fetchNotifications(nextPage);
    };

    return {
        notifications,
        loading,
        total,
        hasMore,
        fetchNotifications,
        updateNotification,
        updateAllNotification,
        loadMoreNotifi,
    };
};

export default NotifiCationViewModel;
