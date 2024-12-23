import React, { useState } from 'react';
import { Input, Button, Spin, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/auth/useAuth';
import ReportViewModel from '../ViewModel/reportViewModel';
import { defaultPostRepo } from '@/api/features/post/PostRepo';
import { useRouter } from 'next/navigation';

const { TextArea } = Input;
const { Text, Title } = Typography;

const ReportScreen = ({ postId, userId, commentId }: { postId?: string; userId?: string; commentId?: string }) => {
  const router = useRouter();
  const [reportReason, setReportReason] = useState('');
  const { localStrings } = useAuth();
  const { reportPost, loading, reportUser, reportComment, setLoading } = ReportViewModel(defaultPostRepo);

  const handleReport = async () => {
    setLoading(true);
    try {
      if (postId) {
        reportPost({ report_post_id: postId, reason: reportReason });
        // Handle post report API call
        console.log('Report Post:', { report_post_id: postId, reason: reportReason });
      } else if (userId) {
        reportUser({ reported_user_id: userId, reason: reportReason });
        // Handle user report API call
        console.log('Report User:', { reported_user_id: userId, reason: reportReason });
      } else if (commentId) {
        reportComment({ report_comment_id: commentId, reason: reportReason });
        // Handle comment report API call
        console.log('Report Comment:', { report_comment_id: commentId, reason: reportReason });
      }
    } catch (error) {
      console.error('Report failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2.5">
      {/* Header */}
      <div className="mb-2 flex items-center">
        <ArrowLeftOutlined
          className="text-xl cursor-pointer text-blue-500"
          onClick={() => router.back()}
        />
       <Text strong style={{ fontSize: "18px", marginLeft: "10px" }}>
            {localStrings.Public.ReportFriend}
        </Text>
      </div>
      {/* Content */}
      <div className="flex-grow p-6">
        <Title level={5} className="text-center">
          {postId ? `${localStrings.Report.ReportPost}` : userId ? `${localStrings.Report.ReportUser}` : `${localStrings.Report.ReportComment}`}
        </Title>
        <Text className="block text-gray-500 text-center my-4">
                 {localStrings.Report.Note}
        </Text>
        <TextArea
          rows={6}
          className="w-full border rounded-lg p-2"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          placeholder={localStrings.Report.placeholder}
        />
      </div>

      {/* Footer */}
      <div className="p-6 bg-white">
        <Button
          type="primary"
          block
          onClick={handleReport}
          loading={loading}
          disabled={!reportReason.trim()}
        >
          {loading ? <Spin /> : `${localStrings.Public.ReportFriend}`}
        </Button>
      </div>
    </div>
  );
};

export default ReportScreen;
