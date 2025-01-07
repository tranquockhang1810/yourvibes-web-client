import { defaultCommentRepo } from "@/api/features/comment/CommentRepo";
import { ReportCommentRequestModel } from "@/api/features/comment/models/ReportComment";
import { ReportPostRequestModel } from "@/api/features/post/models/ReportPost";
import { defaultPostRepo, PostRepo } from "@/api/features/post/PostRepo";
import { ReportUserRequestModel } from "@/api/features/profile/model/ReportUser";
import { defaultProfileRepo } from "@/api/features/profile/ProfileRepository";
import { useAuth } from "@/context/auth/useAuth";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ReportViewModel = () => {
    const router = useRouter();
    const { localStrings } = useAuth();
    const [reportLoading, setReportLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const reportPost = async (params: ReportPostRequestModel) => {
        try {
            setReportLoading(true);
            const res = await defaultPostRepo.reportPost(params);
            console.log("resPost", res);
            
            if (!res?.error) {
                message.success(localStrings.Report.ReportSuccess);
                setShowModal(false);
            } else {
                message.error(localStrings.Report.ReportFailed);
            }
        } catch (error: any) {
            console.error(error);
            message.error(localStrings.Report.ReportFailed);
        } finally {
            setReportLoading(false);
        }
        
    }
      const reportUser = async (params: ReportUserRequestModel) => {
        try {
          setReportLoading(true);
          const res = await defaultProfileRepo.reportUser(params);
          console.log("resUser", res);
          if (!res?.error) {
           message.success(localStrings.Report.ReportSuccess);
           setShowModal(false);
          } else {
            message.error(localStrings.Report.ReportFailed);
          }
        } catch (error: any) {
          console.error(error);
          message.error(localStrings.Report.ReportFailed);
        } finally {
          setReportLoading(false);
        }
        }

        const reportComment = async (params: ReportCommentRequestModel) => {
          try{
            setReportLoading(true);
            const res = await defaultCommentRepo.reportComment(params);
            console.log("resComment", res);
            
            if (!res?.error) {
              message.success(localStrings.Report.ReportSuccess);
              setShowModal(false);
            } else {
              message.error(localStrings.Report.ReportFailed);
            }
          } catch (error: any) {
            console.error(error);
            message.error(localStrings.Report.ReportFailed);
          } finally {
            setReportLoading(false);
          }
        }
    return {
        reportLoading,
        reportPost,
        reportUser,
        reportComment,
        setShowModal,
        showModal,
    }
}
export default ReportViewModel;