"use client"
import React, { useEffect, useCallback } from 'react';
import {
  List,
  Avatar,
  Button,
  Spin,
  Typography,
  Space,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import NotificationItem from '../components/NotificationItem';
import useColor from '@/hooks/useColor';
import NotifiCationViewModel from '../viewModel/NotifiCationViewModel';
import { defaultNotificationRepo } from '@/api/features/notification/NotifiCationRepo';
import { useAuth } from '@/context/auth/useAuth';


const { Text } = Typography;

const NotificationScreen = () => {
  const { brandPrimary, backgroundColor } = useColor();
  const { loading, fetchNotifications,  loadMoreNotifi, updateNotification,updateAllNotification } = NotifiCationViewModel(defaultNotificationRepo);
  const { localStrings } = useAuth();

  const notifications = [
    {
      id: '1',
      from: 'Thanh Phương',
      from_url: 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg',
      content: ':)))))',
      created_at: '2024-12-10T14:48:00.000Z',
      notification_type: 'like_post',
      status: false,
      content_id: '101',
    },
    {
      id: '2',
      from: 'Phera',
      from_url: 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg',
      content: '.................',
      created_at: '2024-12-09T09:15:00.000Z',
      notification_type: 'new_comment',
      status: true,
      content_id: '102',
    },
    {
      id: '3',
      from: 'Gem',
      from_url: 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg',
      content: 'Hello',
      created_at: '2024-11-27T11:25:00.000Z',
      notification_type: 'new_share',
      status: false,
      content_id: '103',
    },
  ];
  

//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

  // Render footer for loading state
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <div className="py-4 flex justify-center">
        <Spin size="large" style={{ color: brandPrimary }} />
      </div>
    );
  };

  return (
    <div className="flex justify-center mt-4">
        <div className='border rounded-md border-solidborder-gray-900  basis-2/4'>
            {/* Header */}
            <div
                className="w-full py-3 px-4 flex justify-between items-center"
                style={{ backgroundColor }}
            >
                <Space>
                <Text className="font-bold text-lg">
                    {localStrings.Notification.Notification}
                </Text>
                </Space>

                <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={updateAllNotification}
                />
            </div>

            {/* Content */}
            <div className="flex-grow overflow-auto border-t border-gray-300">
                <div className="h-full overflow-auto" onScroll={loadMoreNotifi}>
                <List
                    dataSource={notifications}
                    renderItem={(item) => (
                    <NotificationItem
                        notifications={item}
                    />
                    )}
                    footer={renderFooter()}
                    loading={loading}
                    className="h-full"
                />
                </div>
            </div>
        </div>
    </div>
  );
};

export default NotificationScreen;
