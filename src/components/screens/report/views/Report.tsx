// filepath: /c:/cntt/HK3/BE-GO/Gran-Project/yourvibes-web-client/src/components/screens/report/views/Report.tsx
import React, { useState } from 'react';
import { Input, Button, Typography } from 'antd';
import { useAuth } from '@/context/auth/useAuth';
import ReportViewModel from '../ViewModel/reportViewModel';

const { TextArea } = Input;
const { Text, Title } = Typography;

const ReportScreen = ({ postId, userId, commentId }: { postId?: string; userId?: string; commentId?: string }) => {
  const [reportReason, setReportReason] = useState('');
  const { localStrings } = useAuth();
  const { reportPost, reportLoading, reportUser, reportComment, setShowModal } = ReportViewModel();

  const handleReport = async () => {
    if (postId) {
      await reportPost({ report_post_id: postId, reason: reportReason });
      console.log('Report Post:', { report_post_id: postId, reason: reportReason });
    } else if (userId) {
      await reportUser({ reported_user_id: userId, reason: reportReason });
      console.log('Report User:', { reported_user_id: userId, reason: reportReason });
    } else if (commentId) {
      await reportComment({ report_comment_id: commentId, reason: reportReason });
      console.log('Report Comment:', { report_comment_id: commentId, reason: reportReason });
    }
  };

  return (
    <div className="p-2.5">
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
          loading={reportLoading}
          disabled={!reportReason.trim()}
        >
          {localStrings.Public.ReportFriend}
        </Button>
      </div>
    </div>
  );
};

export default ReportScreen;