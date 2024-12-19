"use client"
import { Privacy } from '@/api/baseApiResponseModel/baseApiResponseModel';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';
import { FriendResponseModel } from '@/api/features/profile/model/FriendReponseModel';
import { useAuth } from '@/context/auth/useAuth';
import useColor from '@/hooks/useColor';
import { Button, Flex, Modal, Spin } from 'antd';
import { CreditCardFilled, LoadingOutlined, MailFilled, PhoneFilled } from '@ant-design/icons';
import React from 'react'
import { DateTransfer } from '@/utils/helper/DateTransfer';
import { FaGlobe, FaLock } from 'react-icons/fa';
import { IoMdPeople } from 'react-icons/io';
import { AiFillEdit } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import ModalObjectProfile from './ModalObjectProfile';

const AboutTab = ({
    user,
    loading,
    friendCount,
    friends,
    resultCode,
}:{
    user: UserModel;
    loading: boolean;
    friendCount: number;
    friends: FriendResponseModel[];
    resultCode: number;
}) => {
    const router = useRouter();
    const {brandPrimaryTap,lightGray} = useColor();
    const {isLoginUser, localStrings } = useAuth();
    const [showObject, setShowObject] = React.useState(false);
    
    
  
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
                        <div className='flex justify-between mb-2'>
                            <span className='font-bold text-lg'>{localStrings.Public.Detail}</span>
                            {isLoginUser(user?.id as string) && (
                                <div>
                                <div className='flex flex-row items-center'>
                                    <span className='pr-2'>
                                        {renderPrivacyIcon()}
                                    </span>
                                    <button onClick={() => setShowObject(true)}>
                                        <AiFillEdit  size={24} className='pr-2' />
                                    </button>
                                    
                                </div>
                                <Modal
                                    centered
                                    title={localStrings.Public.EditProfile}
                                    open={showObject}
                                    onCancel={() => setShowObject(false)}
                                    footer={null}
                                >
                                    <ModalObjectProfile closedModalObject={() => setShowObject(false)} />
                                </Modal>
                                </div>
                            )}
                        </div>
                        {resultCode === 20001 ? (
                            <div>
                            {/* // email */}
                            <div className='flex flex-row mb-2'>
                                <MailFilled />
                                <p className='ml-2'>{localStrings.Public.Mail}:{""} <span className='font-bold'>{user?.email}</span>
                                </p>
                            </div>
                            {/* // phone */}
                            <div className='flex flex-row mb-2'>
                            <PhoneFilled />
                             <p className='ml-2'>{localStrings.Public.Phone}:{""} <span className='font-bold'>{user?.phone_number}</span></p>
                            </div>    
                            {/* // birthday */}
                            <div className='flex flex-row  mb-2'>
                            <CreditCardFilled />
                                <p className='ml-2'>{localStrings.Public.Birthday}:{""} <span className='font-bold'>{DateTransfer(user?.birthday)}</span></p>
                            </div>
                            {/* // created_at */}
                            <div className='flex flex-row  mb-2'>
                            <CreditCardFilled />
                                <p className='ml-2'>{localStrings.Public.Active}:{""} <span className='font-bold'>{DateTransfer(user?.created_at)}</span></p>
                            </div>
                            </div>
                        )
                            :resultCode === 50016 ?(
                                <p className='text-center'> {`${user?.family_name || ""} ${user?.name || ""} ${localStrings.Public.HideInfo}`}</p>
                            ):resultCode === 50015 ? (
                                <p className='text-center'>{`${user?.family_name || ""} ${user?.name || ""} ${localStrings.Public.HideInfo} ${localStrings.Public.FriendOnly}`}</p>
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
                            <span className='font-bold text-lg'>{localStrings.Public.Friend}</span>
                            <span className='text-gray-500'>
                                {/* {user?.friend_count}  */}
                                {friendCount}
                                {localStrings.Public.Friend}</span>
                        </div>
                        <div className='cursor-pointer'>
                            <p style={ { color: brandPrimaryTap }} onClick={() => router.push('#')}>
                            {localStrings.Public.FriendFind}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        {friends.map((friend, index) => (
                            <div key={index} className='w-1/4 items-center mb-2 mx-1'
                            onClick={() => router.push(`/user/${friend?.id}`)}
                        >
                            <img
                            src={friend?.avatar_url}
                            className='w-12 h-12 rounded-full bg-gray-300 mr-2'
                            />
                            <p className='mt-2'>
                                {friend?.family_name} {friend?.name}
                            </p>
                        </div>))}
                        
                    </div>
                    <div className='flex justify-center' onClick={() => router.push('#')}>
                        {localStrings.Public.FriendView}
                    </div>
                </div>
            </div>
        )}
        </div>
    </div>
  )
}

export default AboutTab
