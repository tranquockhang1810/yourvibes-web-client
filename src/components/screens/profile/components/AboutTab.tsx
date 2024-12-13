"use client"
import { Privacy } from '@/api/baseApiResponseModel/baseApiResponseModel';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';
import { FriendResponseModel } from '@/api/features/profile/model/FriendReponseModel';
import { useAuth } from '@/context/auth/useAuth';
import useColor from '@/hooks/useColor';
import { Flex, Spin } from 'antd';
import { CreditCardFilled, EditFilled, LoadingOutlined, MailFilled, PhoneFilled } from '@ant-design/icons';
import React from 'react'
import { DateTransfer } from '@/utils/helper/DateTransfer';
import { FaGlobe, FaLock, FaUsers } from 'react-icons/fa';
import { IoMdPeople } from 'react-icons/io';
import router from 'next/router';

const AboutTab = ({
    user,
    loading,
    // friendCount,
    // friends,
    resultCode,
}:{
    user: UserModel;
    loading: boolean;
    // friendCount: number;
    // friends: FriendResponseModel[];
    resultCode: number;
}) => {
    const {brandPrimaryTap,lightGray} = useColor();
    const {isLoginUser, localStrings } = useAuth();
  
    const renderPrivacyIcon = () => {
        switch (user?.privacy) {
          case Privacy.PUBLIC:
            return <FaGlobe size={18} color={brandPrimaryTap} />;
          case Privacy.FRIEND_ONLY:
            return <IoMdPeople size={18} color={brandPrimaryTap} />;
          case Privacy.PRIVATE:
            return <FaLock name="lock-closed" size={18} color={brandPrimaryTap} />;
          default:
            return null;
        }
      }
  
  return (
    <div className="flex justify-center items-center mt-4">
        <div className='border rounded-md border-solidborder-gray-900  basis-2/4'>
        {loading ? (
            <Flex align="center" gap="middle">
                <Spin indicator={<LoadingOutlined spin />} size="large" />
            </Flex>
        ):(
            <div className='flex px-5'>
                {/* // detail */}
                <div className='py-2 w-60'>
                    <div>
                        <div>
                            <text className='font-bold text-lg'>{localStrings.Public.Detail}</text>
                            {isLoginUser(user?.id as string) && (
                                <div className='flex-row'>
                                    <text className='pr-5'>icon
                                        {renderPrivacyIcon()}
                                    </text>
                                    <EditFilled />
                                </div>
                            )}
                        </div>
                        {resultCode === 20001 ? (
                            <div>
                            {/* // email */}
                            <div className='flex-row   mb-2'>
                                <MailFilled />
                                <text className='ml-2'>{localStrings.Public.Mail}:{""} <text className='font-bold'>{user?.email}</text>
                                </text>
                            </div>
                            {/* // phone */}
                            <div className='flex-row mb-2'>
                            <PhoneFilled />
                            <text className='ml-2'>{localStrings.Public.Phone}:{""} <text className='font-bold'>{user?.phone_number}</text></text>
                            </div>    
                            {/* // birthday */}
                            <div className='flex-row  mb-2'>
                            <CreditCardFilled />
                                <text className='ml-2'>{localStrings.Public.Birthday}:{""} <text className='font-bold'>{DateTransfer(user?.birthday)}</text></text>
                            </div>
                            {/* // created_at */}
                            <div className='flex-row  mb-2'>
                            <CreditCardFilled />
                                <text className='ml-2'>{localStrings.Public.Active}:{""} <text className='font-bold'>{DateTransfer(user?.created_at)}</text></text>
                            </div>
                            </div>
                        )
                            :resultCode === 50016 ?(
                                <text className='text-center'> {`${user?.family_name || ""} ${user?.name || ""} ${localStrings.Public.HideInfo}`}</text>
                            ):resultCode === 50015 ? (
                                <text className='text-center'>{`${user?.family_name || ""} ${user?.name || ""} ${localStrings.Public.HideInfo} ${localStrings.Public.FriendOnly}`}</text>
                            ):null
                            }
                    </div>
                </div>
                
                 {/* Divider */}
    <div className='w-px bg-gray-300 h-auto mr-4'></div>

                {/* friends  */}
                <div className='py-2 flex-1'>
                    <div className='flex justufy-between mb-2'>
                       <div className='flex flex-col flex-1'>
                            <text className='font-bold text-lg'>{localStrings.Public.Friend}</text>
                            <text className='text-gray-500'>{user?.friend_count} {localStrings.Public.Friend}</text>
                        </div>
                        <div className='cursor-pointer'>
                            <text style={ { color: brandPrimaryTap }} onClick={() => router.push('#')}>
                            {localStrings.Public.FriendFind}
                            </text>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='w-1/4 items-center mb-2 mx-1'
                            // onClick={() => router.push(`/(tabs)/user/${likedPost?.user?.id}`)}
                        >
                            <img
                            src={user?.avatar_url}
                            className='w-12 h-12 rounded-full bg-gray-300 mr-2'
                            />
                            <text className='mt-2'>{user?.family_name} {user?.name}</text>
                        </div>
                        
                    </div>
                </div>
            </div>
        )}
        </div>
    </div>
  )
}

export default AboutTab