import { ForgotPasswordRepo } from "@/api/features/forgotPassword/ForgotPasswordRepo";
import {ForgotPasswordResponseModel } from "@/api/features/forgotPassword/models/ForgotPassword";
import { message } from "antd";

export class ForgotPasswordViewModel {
  private repo: ForgotPasswordRepo;

  constructor() {
    this.repo = new ForgotPasswordRepo();
  }

  // Yêu cầu OTP
  public async requestOTP(email: string, otp: string): Promise<void> {
    try {
      if (!email) {
        message.error("Vui lòng nhập email hợp lệ.");
        return;
      }
      await this.repo.verifyOTP({ email });
      message.success("OTP đã được gửi thành công đến email của bạn.");
    } catch (error) {
      message.error("Không thể gửi OTP. Vui lòng thử lại sau.");
    }
  }

  // Đặt lại mật khẩu
  public async resetPassword(request: ForgotPasswordResponseModel): Promise<void> {
    try {
      const { email, new_password, otp } = request;
      if (!email || !new_password || !otp) {
        message.error("Vui lòng nhập đầy đủ thông tin.");
        return;
      }
      await this.repo.resetPassword({ email, new_password, otp });
      message.success("Mật khẩu đã được đặt lại thành công.");
    } catch (error) {
      message.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
    }
  }
}