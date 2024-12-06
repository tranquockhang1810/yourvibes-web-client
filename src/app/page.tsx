import { PostResponseModel } from '@/api/features/post/models/PostResponseModel'
import Post from '@/components/common/post/views/Post'
import React from 'react'

const HomePage = () => {

  const likedPost: PostResponseModel = {
    "id": "3c56102f-f139-44b5-9314-feb7898c677a",
    "user_id": "7dfdf978-9706-4720-aa3f-382af4b14f70",
    "user": {
      "id": "7dfdf978-9706-4720-aa3f-382af4b14f70",
      "family_name": "Pc",
      "name": "Huy",
      "avatar_url": "https://res.cloudinary.com/dkf51e57t/image/upload/v1731483436/yourVibes/t33btwrq6rurxho4o5sc.jpg"
    },
    "parent_id": undefined,
    "parent_post": undefined,
    "content": "test post",
    "like_count": 1,
    "comment_count": 1,
    "privacy": "public",
    "location": "",
    "is_advertisement": false,
    "status": true,
    "created_at": "2024-11-19T03:55:39.89293+07:00",
    "updated_at": "2024-11-28T20:32:52.075703+07:00",
    "media": [
      {
        "id": 44,
        "post_id": "3c56102f-f139-44b5-9314-feb7898c677a",
        "media_url": "https://res.cloudinary.com/dkf51e57t/image/upload/v1731963346/yourVibes/s40veufkaso1lyscxrub.png",
        "status": true,
        "created_at": "2024-11-19T03:55:49.838189+07:00"
      }
    ],
    "is_liked": false
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-center w-full'>
        <Post post={likedPost}>
          <Post isParentPost post={likedPost}/>
        </Post>
      </div>
    </div>
  )
}

export default HomePage