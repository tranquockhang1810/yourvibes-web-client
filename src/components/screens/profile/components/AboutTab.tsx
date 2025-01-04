"use client";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { UserModel } from "@/api/features/authenticate/model/LoginModel";
import { FriendResponseModel } from "@/api/features/profile/model/FriendReponseModel";
import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import { Button, Flex, Modal, Spin } from "antd";
import {
  CreditCardFilled,
  LoadingOutlined,
  MailFilled,
  PhoneFilled,
} from "@ant-design/icons";
import React from "react";
import { DateTransfer } from "@/utils/helper/DateTransfer";
import { FaGlobe, FaLock } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import { useRouter } from "next/navigation";
import ModalObjectProfile from "./ModalObjectProfile";
import PostList from "./PostList";
import { PostResponseModel } from "@/api/features/post/models/PostResponseModel";
import ListFriends from "./ListFriends";

const AboutTab = ({
  user,
  loading,
  friendCount,
  friends,
  resultCode,
  posts,
  loadMorePosts,
}: {
  user: UserModel;
  loading: boolean;
  friendCount: number;
  friends: FriendResponseModel[];
  resultCode: number;
  posts: PostResponseModel[];
  loadMorePosts: () => void;
}) => {
  const router = useRouter();
  const { brandPrimaryTap, backgroundColor } = useColor();
  const { isLoginUser, localStrings } = useAuth();
  const [showObject, setShowObject] = React.useState(false);
  const [showFriend, setShowFriend] = React.useState(false);

  const renderPrivacyIcon = () => {
    switch (user?.privacy) {
      case Privacy.PUBLIC:
        return <FaGlobe size={16} color={brandPrimaryTap} />;
      case Privacy.FRIEND_ONLY:
        return <IoMdPeople size={20} color={brandPrimaryTap} />;
      case Privacy.PRIVATE:
        return <FaLock name="lock-closed" size={17} color={brandPrimaryTap} />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 lg:mx-16 ">
      <div>
        {loading ? (
          <Flex align="center" gap="middle">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </Flex>
        ) : (
          <div className="flex flex-col xl:flex-row w-full items-center gap-4 xl:items-start">
            <div className="w-full max-w-[600px]">
              <div
                className="w-auto flex flex-col px-5 border rounded-md "
                style={{ backgroundColor: backgroundColor }}
              >
                {/* // detail */}
                <div className="py-2">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-lg">
                        {localStrings.Public.Detail}
                      </span>
                      {isLoginUser(user?.id as string) && (
                        <div>
                          <div className="flex flex-row items-center">
                            <span className="pr-2">{renderPrivacyIcon()}</span>
                            <button onClick={() => setShowObject(true)}>
                              <AiFillEdit size={24} className="pr-2" />
                            </button>
                          </div>
                          <Modal
                            centered
                            title={localStrings.ObjectProfile.ProfilePrivacy}
                            open={showObject}
                            onCancel={() => setShowObject(false)}
                            footer={null}
                          >
                            <ModalObjectProfile
                              closedModalObject={() => setShowObject(false)}
                            />
                          </Modal>
                        </div>
                      )}
                    </div>
                    {resultCode === 20001 ? (
                      <div>
                        {/* // email */}
                        <div className="flex flex-row mb-2">
                          <MailFilled />
                          <span className="ml-2">
                            {localStrings.Public.Mail}:{""}{" "}
                            <span className="font-bold">{user?.email}</span>
                          </span>
                        </div>
                        {/* // phone */}
                        <div className="flex flex-row mb-2">
                          <PhoneFilled />
                          <span className="ml-2">
                            {localStrings.Public.Phone}:{""}{" "}
                            <span className="font-bold">
                              {user?.phone_number}
                            </span>
                          </span>
                        </div>
                        {/* // birthday */}
                        <div className="flex flex-row  mb-2">
                          <CreditCardFilled />
                          <span className="ml-2">
                            {localStrings.Public.Birthday}:{""}{" "}
                            <span className="font-bold">
                              {DateTransfer(user?.birthday)}
                            </span>
                          </span>
                        </div>
                        {/* // created_at */}
                        <div className="flex flex-row  mb-2">
                          <CreditCardFilled />
                          <span className="ml-2">
                            {localStrings.Public.Active}:{""}{" "}
                            <span className="font-bold">
                              {DateTransfer(user?.created_at)}
                            </span>
                          </span>
                        </div>
                      </div>
                    ) : resultCode === 50016 ? (
                      <span className="text-center">
                        {" "}
                        {`${user?.family_name || ""} ${user?.name || ""} ${
                          localStrings.Public.HideInfo
                        }`}
                      </span>
                    ) : resultCode === 50015 ? (
                      <span className="text-center">{`${
                        user?.family_name || ""
                      } ${user?.name || ""} ${localStrings.Public.HideInfo} ${
                        localStrings.Public.FriendOnly
                      }`}</span>
                    ) : null}
                  </div>
                </div>
                <hr />
                {/* friends  */}
                <div className="py-2 flex-1">
                  <div className="flex mb-2">
                    <div className="flex flex-col flex-1">
                      <span className="font-bold text-lg">
                        {localStrings.Public.Friend}
                      </span>
                      <span className="text-gray-500">
                        {/* {user?.friend_count}  */}
                        {friendCount}
                        {localStrings.Public.Friend}
                      </span>
                    </div>
                    <div className="cursor-pointer">
                      <span
                        style={{ color: brandPrimaryTap }}
                        onClick={() => router.push("#")}
                      >
                        {localStrings.Public.FriendFind}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {friends.map((friend, index) => (
                      <div
                        key={index}
                        className="w-[70px]  mb-2 mx-1"
                        onClick={() => router.push(`/user/${friend?.id}`)}
                      >
                        <img
                          src={friend?.avatar_url}
                          alt={`${friend?.family_name} ${friend?.name}`}
                          className="w-12 h-12 rounded-full bg-gray-300 mr-2"
                        />
                        <span className="mt-2">
                          {friend?.family_name} {friend?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="flex justify-center cursor-pointer"
                    onClick={() => setShowFriend(true)}
                  >
                    {localStrings.Public.FriendView}
                  </div>
                  <Modal
                    title={
                      <span className="text-xl font-bold">
                        {localStrings.ListFriends.ListFriends}
                      </span>
                    }
                    open={showFriend}
                    onCancel={() => setShowFriend(false)}
                    footer={null}
                    centered
                    width={1000}
                  >
                    <ListFriends
                      friends={friends}
                      page={1}
                      setPage={() => {}}
                      totalPage={1}
                    />
                    ,
                  </Modal>
                </div>
              </div>
            </div>

            <div className="w-full">
              <PostList
                loading={loading}
                posts={posts}
                loadMorePosts={loadMorePosts}
                user={user}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutTab;
