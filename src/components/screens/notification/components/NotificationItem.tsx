import { NotificationResponseModel } from "@/api/features/notification/models/NotifiCationModel";
import { useAuth } from "@/context/auth/useAuth";
import { getTimeDiff } from "@/utils/helper/DateTransfer";
import { Avatar, List, Modal } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  IoArrowRedoCircle,
  IoChatbubbleEllipses,
  IoHeartCircle,
  IoNotificationsCircle,
  IoPersonCircle,
} from "react-icons/io5";
import PostDetailsScreen from "../../postDetails/view/postDetailsScreen";
import EditPostViewModel from "@/components/features/editpost/viewModel/EditPostViewModel";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import MediaView from "@/components/foundation/MediaView";
import Post from "@/components/common/post/views/Post";
const NotificationItem = ({
  notifications,
  onUpdate,
}: {
  notifications: NotificationResponseModel;
  onUpdate: () => void;
}) => {
  const router = useRouter();
  const {
    from,
    from_url,
    content,
    created_at,
    notification_type = "",
    status,
    content_id,
  } = notifications;
  const { localStrings } = useAuth();
  const typeMap: Record<
    string,
    { icon: React.ReactNode; color: string; type: string }
  > = {
    like_post: {
      icon: <IoHeartCircle />,
      color: "text-red-500",
      type: `${localStrings.Notification.Items.LikePost}`,
    },
    new_share: {
      icon: <IoArrowRedoCircle />,
      color: "text-blue-500",
      type: `${localStrings.Notification.Items.SharePost}`,
    },
    new_comment: {
      icon: <IoChatbubbleEllipses />,
      color: "text-green-500",
      type: `${localStrings.Notification.Items.CommentPost}`,
    },
    friend_request: {
      icon: <IoPersonCircle />,
      color: "text-gray-600",
      type: `${localStrings.Notification.Items.Friend}`,
    },
    accept_friend_request: {
      icon: <IoPersonCircle />,
      color: "text-gray-600",
      type: `${localStrings.Notification.Items.AcceptFriend}`,
    },
    new_post: {
      icon: <IoNotificationsCircle />,
      color: "text-black",
      type: `${localStrings.Notification.Items.NewPost}`,
    },
    like_comment: {
      icon: <IoHeartCircle />,
      color: "text-red-500",
      type: `${localStrings.Notification.Items.LikeComment}`,
    },
  };

  const { likedPost } = EditPostViewModel(defaultPostRepo);

  const notificationDetails = typeMap[notification_type] || {
    icon: <IoNotificationsCircle />,
    color: "text-black",
    type: `${localStrings.Notification.Notification}`,
  };
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const handleClick = () => {
    onUpdate();
    if (
      notification_type === "friend_request" ||
      notification_type === "accept_friend_request"
    ) {
      router.push(`/user/${content_id}`);
    } else if (
      ["like_post", "new_comment", "new_share", "new_post"].includes(
        notification_type
      )
    ) {
      router.push(`/postDetails?postId=${content_id}`);
      // setIsCommentModalVisible(true);
    }
  };

  return (
    <List.Item
      onClick={handleClick}
      className={`${status ? "bg-white" : "bg-gray-100"}`}
    >
      <div className="flex items-center">
        {/* Avatar with Icon */}
        <div className="relative mr-4">
          <Avatar src={from_url} size={40} className="bg-gray-300" />
          <div
            className={`absolute bottom-0 right-0 text-lg ${notificationDetails.color}`}
          >
            {notificationDetails.icon}
          </div>
        </div>

        {/* Notification Content */}
        <div className="flex-1">
          <p className="text-sm text-gray-800">
            <span className="font-semibold">{from}</span>{" "}
            {notificationDetails.type}
          </p>
          {content && (
            <p className="text-sm text-gray-600 truncate" title={content}>
              {content}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {getTimeDiff(created_at, localStrings)}
          </p>
        </div>
      </div>
      {/* Modal for comments */}
      {/* <Modal
        visible={isCommentModalVisible}
        width={800}
        footer={null}
        closable={true}
        maskClosable={true}
        onCancel={() => setIsCommentModalVisible(false)}
      >
        <PostDetailsScreen postId={content_id} post={notifications} />
      </Modal> */}
    </List.Item>
  );
};
export default NotificationItem;
