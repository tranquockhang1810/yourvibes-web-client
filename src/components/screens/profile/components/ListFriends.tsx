import { useAuth } from '@/context/auth/useAuth';
import React from 'react'
import UserProfileViewModel from '../viewModel/UserProfileViewModel';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';

const ListFriends = () => {
    const { friends, loading, page} = UserProfileViewModel();
    const {localStrings} = useAuth();
   
  return (
    <div className="flex justify-center items-center">
        
        <div className='border rounded-md border-solidborder-gray-900 basis-2/4'>
            <div className='text-xl font-bold pb-2'>{localStrings.ListFriends.ListFriends}</div>
            {/* {loading && page === 1 ? (
                <div>Loading...</div>
            ) : (
                friends.map((friend) => ( */}
                   <div className=" m-2 grid grid-cols-2 gap-x-4 gap-y-2">
                        {[1, 2, 3, 4, 5, 6].map((user, index) => (
                        <div key={index} className="flex flex-row items-center p-2 border rounded-md shadow-sm">
                            <img
                            src={
                                "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg"
                            }
                            alt={"avatar"}
                            className="w-14 h-14 rounded-full"
                            />
                            <span className="ml-4 text-lg font-semibold">{"User Name " + user}</span>
                            <IoEllipsisVerticalSharp className="ml-auto" />
                        </div>
                        ))}
                    </div>
                {/* ))
            )} */}
        </div>
    </div>
    
  )
}

export default ListFriends