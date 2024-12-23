"use client";

import { useSearchParams } from 'next/navigation';
import PostDetailsScreen from '@/components/screens/postDetails/view/postDetailsScreen';

const PostDetailsPage = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  

  if (!postId) {
    return <div>Post ID is missing</div>;
  }

  return <PostDetailsScreen postId={postId}  />;
};

export default PostDetailsPage;