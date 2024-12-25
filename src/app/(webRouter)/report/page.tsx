"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ReportScreen from '@/components/screens/report/views/Report';

const Page = () => {
  const searchParams = useSearchParams();

  const userId = searchParams.get('userId');
  const postId = searchParams.get('postId');
  const commentId = searchParams.get('commentId');

  if (!userId && !postId && !commentId) {
    return <div className="text-center text-gray-500">Đang tải...</div>;
  }

  return (
    <ReportScreen
      userId={userId || ''}
      postId={postId || ''}
      commentId={commentId || ''}
    />
  );
};

export default Page;
