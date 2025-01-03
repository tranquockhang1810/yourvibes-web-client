"use client";
import { UserModel } from "@/api/features/authenticate/model/LoginModel";
import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import React, { useCallback, useEffect } from "react";
import UserProfileViewModel from "../viewModel/UserProfileViewModel";
import { FriendStatus } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { Button, Dropdown, Flex, MenuProps, Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";

const ProfileHeader = ({
  total,
  user,
  loading,
  friendCount,
}: {
  total: number;
  user: UserModel;
  loading: boolean;
  friendCount: number;
}) => {
  const { lightGray, brandPrimary, backgroundColor } = useColor();
  const { localStrings, language, isLoginUser } = useAuth();
  const router = useRouter();

  const {
    sendFriendRequest,
    sendRequestLoading,
    refuseFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    unFriend,
    newFriendStatus,
    setNewFriendStatus,
  } = UserProfileViewModel();

  const itemsFriend: MenuProps['items'] = [
    {
      key: '1',
      label: localStrings.Public.UnFriend,
      type: 'item',
      onClick: () => {
        Modal.confirm({
          centered: true,
          title: localStrings.Public.Confirm,
          content: localStrings.Profile.Friend.UnfriendConfirm,
          okText: localStrings.Public.Confirm,
          cancelText: localStrings.Public.Cancel,
          onOk: () => {
            unFriend(user?.id as string);
          }
        });
      }
    },
    {
      key: '2',
      label: localStrings.Public.Cancel,
      type: 'item',
      onClick: () => {
        
      }
    },
    
  ];

  const itemsReport: MenuProps['items'] = [
    {
      key: '1',
      label: localStrings.Public.ReportFriend,
      onClick: () => {
        router.push(`/report?userId=${user?.id}`);
      },
    },
    {
      key: '2',
      label: localStrings.Public.Cancel,
      onClick: () => {
        console.log("Cancel action clicked");
      },
    },
  ];
  


  const renderFriendButton = useCallback(() => {
    switch (newFriendStatus) {
      case FriendStatus.NotFriend:
        return (
          <Button
            type="default"
            onClick={() => {
              sendFriendRequest(user?.id as string);
            }}
          >
            <div className="flex flex-row items-center">
              <FaUserPlus name="user-plus" size={16} color={brandPrimary} />
              <text
                style={{
                  color: brandPrimary,
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 5,
                }}
              >
                {localStrings.Public.AddFriend}
              </text>
            </div>
          </Button>
        );
      case FriendStatus.IsFriend:
        return (
          <Dropdown menu={{ items: itemsFriend }} placement="bottom" arrow>
          <Button type="primary">
            <div className="flex flex-row items-center">
              <FaUserCheck
                name="user-check"
                size={16}
                color={backgroundColor}
              />
              <text
                style={{
                  color: backgroundColor,
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 5,
                }}
              >
                {localStrings.Public.Friend}
              </text>
            </div>
          </Button>
          </Dropdown>
        );
      case FriendStatus.SendFriendRequest:
        return (
          <div className="flex flex-col items-center">
            <text
              style={{
                marginBottom: 10,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {localStrings.Profile.Friend.SendARequest}
            </text>
            <Button
              type="default"
              onClick={() => {
                cancelFriendRequest(user?.id as string);
              }}
              loading={sendRequestLoading}
            >
              <div className="flex flex-row items-center">
                <RxCross2 name="cross" size={24} color={brandPrimary} />
                <span
                >
                  {localStrings.Public.CancelFriendRequest}
                </span>
              </div>
            </Button>
          </div>
        );
      case FriendStatus.ReceiveFriendRequest:
        return (
          <div style={{ marginTop: 10 }}>
            <text
              style={{
                marginBottom: 10,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {localStrings.Profile.Friend.SendYouARequest}
            </text>
            <div
              style={{
                flexDirection: "row",
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                style={{ width: "48%" }}
                type="primary"
                onClick={() => {
                  acceptFriendRequest(user?.id as string);
                }}
                loading={sendRequestLoading}
              >
                {localStrings.Public.AcceptFriendRequest}
              </Button>
              <Button
                style={{ width: "48%" }}
                type="default"
                onClick={() => {
                  refuseFriendRequest(user?.id as string);
                }}
              >
                {localStrings.Public.RefuseFriendRequest}
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <Button type="default" onClick={() => {}}>
            <text style={{ color: brandPrimary, fontSize: 16 }}>
              {localStrings.Public.AddFriend}
            </text>
          </Button>
        );
    }
  }, [newFriendStatus, localStrings, sendRequestLoading]);

  useEffect(() => {
    if (user) setNewFriendStatus(user?.friend_status);
  }, [user]);

  console.log("reload page")
  return (
    <div>
      {loading ? (
        <Flex align="center" gap="middle">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Flex>
      ) : (
        <>
          {/* Cover Image */}
          <div className="h-[400px]" style={{ backgroundColor: lightGray }}>
            <img
              src={user?.capwall_url}
              alt="Cover"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Profile Image */}
          <div className="mt-[-60px] text-center flex justify-center">
            <img
              src={
                user?.avatar_url ||
                "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg"
              }
              alt="Profile"
              className="w-52 h-52 rounded-full mx-auto object-cover"
              style={{ backgroundColor: lightGray }}
            />
             {!isLoginUser(user?.id as string) && (
            <div className="mt-16 mr-2 opacity-50 hover:opacity-100">
              <Dropdown menu={{ items: itemsReport }} placement="bottomRight">
                <BsThreeDots size={20} />
              </Dropdown>

              
            </div>
          )}
          </div>


          {/* User Information */}
          <div className="text-center mt-2">
            <text className="text-lg font-bold">
              {`${user?.family_name} ${user?.name}` ||
                localStrings.Public.Username}
            </text>
            <p className="text-gray-500 mt-1">
              {user?.biography || localStrings.Public.Biography}
            </p>
            <div className="flex justify-center mt-2">
              <text className="mx-5 font-bold">
                {total || user?.post_count} {localStrings.Public.Post}
                {language === "en" &&
                (total || user?.post_count) &&
                ((total && total > 1) ||
                  (user?.post_count && user?.post_count > 1))
                  ? "s"
                  : ""}
              </text>
              <text className="mx-5 font-bold">
                {friendCount} {localStrings.Public.Friend}
              </text>
            </div>
          </div>

          {/* Friend Button */}
          {!isLoginUser(user?.id as string) && (
            <div className="mt-2 flex justify-center">
              {renderFriendButton()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileHeader;
