import { useAuth } from '@/context/auth/useAuth';
import React from 'react'
import UserProfileViewModel from '../viewModel/UserProfileViewModel';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import { UserModel } from '@/api/features/authenticate/model/LoginModel';
import { FriendResponseModel } from '@/api/features/profile/model/FriendReponseModel';

const ListFriends = ({
    user,
    loading,
    friends,
    page,
    setPage,
    totalPage,
}:{
    user: UserModel;
    loading: boolean;
    friends: FriendResponseModel[];
    page: number;
    setPage: (page: number) => void;
    totalPage: number;
}) => {
    const {localStrings} = useAuth();
    console.log("friends", friends);
    
   
  return (
    <div className="flex justify-center items-center">
        
        <div className='border rounded-md border-solidborder-gray-900 basis-2/4'>
            <div className='text-xl font-bold pb-2'>{localStrings.ListFriends.ListFriends}</div>
           {
                friends.map((friend, index) => (
                   <div className=" m-2 grid grid-cols-2 gap-x-4 gap-y-2">
                        <div key={index} className="flex flex-row items-center p-2 border rounded-md shadow-sm">
                            <img
                            src={friend?.avatar_url||'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'}
                            alt={"avatar"}
                            className="w-14 h-14 rounded-full"
                            />
                            <span className="ml-4 text-lg font-semibold">{friend?.family_name} {friend?.name}</span>
                            <IoEllipsisVerticalSharp className="ml-auto" />
                        </div>
                    </div>
             ))
            } 
        </div>
    </div>
    
  )
}

export default ListFriends