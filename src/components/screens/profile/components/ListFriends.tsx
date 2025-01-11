import { useAuth } from '@/context/auth/useAuth';
import React from 'react'
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import { FriendResponseModel } from '@/api/features/profile/model/FriendReponseModel';
import { useRouter } from 'next/navigation';

const ListFriends = ({
	friends,
}: {
	friends: FriendResponseModel[];
	page: number;
	setPage: (page: number) => void;
	totalPage: number;
}) => {
	const { localStrings } = useAuth();
	const router = useRouter();


	return (
		<div className=" m-2 grid md:grid-cols-2 gap-x-4 gap-y-2 cursor-pointer">
			{friends.map((friend, index) => (
				<div key={index} className="flex flex-row items-center p-2 border rounded-md">
					<div className='flex flex-row items-center' onClick={() => router.push(`/user/${friend?.id}`)}>
						<img
							src={friend?.avatar_url || 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'}
							alt={"avatar"}
							className="w-14 h-14 rounded-full"
						/>
						<span className="ml-4 text-lg font-semibold">{friend?.family_name} {friend?.name}</span>
					</div>

					<IoEllipsisVerticalSharp className="ml-auto" />
				</div>))
			}
		</div>

	)
}

export default ListFriends