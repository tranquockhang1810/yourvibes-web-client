"use client";
import { UserModel } from "@/api/features/authenticate/model/LoginModel";
import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import React, { useCallback, useEffect } from "react";
import UserProfileViewModel from "../viewModel/UserProfileViewModel";
import { FriendStatus } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { Button, Flex, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { log } from "console";

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
        );
      case FriendStatus.SendFriendRequest:
        return (
          <div style={{ marginTop: 10 }}>
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
                <ImCross name="cross" size={24} color={brandPrimary} />
                <text
                  style={{
                    color: brandPrimary,
                    fontSize: 16,
                    fontWeight: "bold",
                    marginLeft: 5,
                  }}
                >
                  {localStrings.Public.CancelFriendRequest}
                </text>
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
          <div className="w-full h-72" style={{ backgroundColor: lightGray }}>
            <img
              src={user?.capwall_url}
              alt="Cover"
              className="w-full h-full"
            />
          </div>

          {/* Profile Image */}
          <div className="mt-[-60px] text-center">
            <img
              src={
                user?.avatar_url ||
                "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg"
              }
              alt="Profile"
              className="w-52 h-52 rounded-full mx-auto"
              style={{ backgroundColor: lightGray }}
            />
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
