import { defaultCommentRepo } from "@/api/features/comment/CommentRepo";
import { ReportCommentRequestModel } from "@/api/features/comment/models/ReportComment";
import { ReportPostRequestModel } from "@/api/features/post/models/ReportPost";
import { PostRepo } from "@/api/features/post/PostRepo";
import { ReportUserRequestModel } from "@/api/features/profile/model/ReportUser";
import { defaultProfileRepo } from "@/api/features/profile/ProfileRepository";
import { useAuth } from "@/context/auth/useAuth";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ReportViewModel = (repo: PostRepo) => {
    const router = useRouter();
    const { localStrings } = useAuth();
    const [loading, setLoading] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);

    const reportPost = async (params: ReportPostRequestModel) => {
        try {
            setReportLoading(true);
            const res = await repo.reportPost(params);
            console.log("resPost", res);
            
            if (!res?.error) {
                // Toast.show({
                //     type: 'success',
                //     text1: localStrings.Report.ReportSuccess,
                // });
                router.back();
            } else {
            //    Toast.show({
            //          type: 'error',
            //          text1: localStrings.Report.ReportFailed,
            //          text2: res?.error?.message,
            //     });
            }
        } catch (error: any) {
            console.error(error);
            // Toast.show({
            //     type: 'error',
            //     text1: localStrings.Report.ReportFailed,
            //     text2: error?.error?.message,
            // });
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
            router.back();
          } else {
            message.error(localStrings.Report.ReportFailed);
          }
        } catch (error: any) {
          console.error(error);
        //   Toast.show({
        //     type: 'error',
        //     text1: localStrings.Report.ReportFailed,
        //     text2: error?.message,
        //   });
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
            //   Toast.show({
            //     type: 'success',
            //     text1: localStrings.Report.ReportSuccess,
            //   });
              router.back();
            } else {
            //   Toast.show({
            //     type: 'error',
            //     text1: localStrings.Report.ReportFailed,
            //     text2: res?.error?.message,
            //   });
            }
          } catch (error: any) {
            console.error(error);
            // Toast.show({
            //   type: 'error',
            //   text1: localStrings.Report.ReportFailed,
            //   text2: error?.message,
            // });
          } finally {
            setReportLoading(false);
          }
        }
    return {
        loading,
        reportLoading,
        reportPost,
        reportUser,
        reportComment,
        setLoading,
    }
}
export default ReportViewModel;