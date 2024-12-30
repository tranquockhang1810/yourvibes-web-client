"use client";
import { ApiPath } from "@/api/ApiPath";
import { defaultNotificationRepo } from "@/api/features/notification/NotifiCationRepo";
import MyHeader from "@/components/common/header/view/Header";
import { useAuth } from "@/context/auth/useAuth";
import { Button, notification } from "antd";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }): React.ReactElement {
    const { user, localStrings } = useAuth();
    const [statusNotifi, setStatusNotifi] = useState(false);
    const mapNotifiCationContent = (type: string) => {
        switch (type) {
            case 'like_post':
                return localStrings?.Notification?.Items?.LikePost || 'Like Post';
            case 'new_share':
                return localStrings?.Notification?.Items?.SharePost || 'Share Post';
            case 'new_comment':
                return localStrings?.Notification?.Items?.CommentPost || 'Comment Post';
            case 'friend_request':
                return localStrings?.Notification?.Items?.Friend || 'Friend Request';
            case 'accept_friend_request':
                return localStrings?.Notification?.Items?.AcceptFriend || 'Friend Request Accepted';
            case 'new_post':
                return localStrings?.Notification?.Items?.NewPost || 'New Post';
            case 'like_comment':
                return localStrings?.Notification?.Items?.LikeComment || 'Like Comment';
            default:
                return 'notifications';
        }
    };

    const connectWebSocket = () => {
        const ws = new WebSocket(`${ApiPath.GET_WS_PATH}${user?.id}`);
    
        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (e) => {
            const notificationData = JSON.parse(e.data);
            const { from: userName, content, notification_type: type } = notificationData;

            console.log("Message:", notificationData);
            setStatusNotifi(true);

            const mappedType = mapNotifiCationContent(type);

            const key = `open${Date.now()}`;

            notification.open({
                message: `${userName} ${mappedType}`,
                description: content,
                placement: "topRight",
                key,
            });
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        // Cleanup WebSocket on component unmount
        return () => {
            ws.close();
        };
    };

    useEffect(() => {
        if (user?.id) {
            const closeWebSocket = connectWebSocket();
            return () => {
                closeWebSocket();
            };
        }
    }, [user]);

    return (
        <div className="mb-10"> 
            <MyHeader />
            <div className="pt-15 pl-13 pb-12 md:pl-2">
                {children}
            </div>

        </div>
    );
}
