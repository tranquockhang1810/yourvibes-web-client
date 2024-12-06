"use client";
import React from "react";
import { Button, Checkbox, DatePicker, Form, Input, message } from "antd";
import { AuthenRepo } from "@/api/features/authenticate/AuthenRepo";

const ForgotPasswordFeature: React.FC = () => {
  const [form] = Form.useForm();
  const repo = new AuthenRepo(); // Khởi tạo AuthenRepo

  const onRequestOTP = async () => {
    try {
      const email = form.getFieldValue("email");
      const phone = form.getFieldValue("phone");
      if (!email) {
        message.error("Vui lòng nhập email trước khi yêu cầu OTP!");
        return;
      }
      if (!phone) {
        message.error("Vui lòng nhập số điện thoại trúc khi yêu cầu OTP!");
      }
      await repo.verifyOTP({ email });
      message.success("Gửi OTP thành công!");
    } catch (error) {
      message.error("Gửi OTP thất bại. Vui lòng thử lại.");
    }
  };

  function onForgotPassword(values: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-lg p-8 border border-gray-300 rounded-lg shadow-md bg-white">
        {/* Title */}
        <h1 className="text-lg font-bold text-gray-600 mb-6 text-center">
          ĐẶT LẠI MẬT KHẨU
        </h1>

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={onForgotPassword}>
          {/* Phone Number */}
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Số điện thoại" className="w-full" />
          </Form.Item>

          {/* Email and OTP */}
          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="email"
              className="col-span-2"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input placeholder="Email" className="w-full" />
            </Form.Item>
            <Button
              block
              type="default"
              className="bg-black text-white rounded"
              onClick={onRequestOTP}
            >
              Nhận OTP
            </Button>
          </div>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" className="w-full" />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng nhập xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Xác nhận mật khẩu không khớp với mật khẩu!"
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Xác nhận mật khẩu"
              className="w-full"
            />
          </Form.Item>

          {/* Confirm OTP */}
          <Form.Item
            name="otp"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
          >
            <Input placeholder="Mã OTP" className="w-full" />
          </Form.Item>

          {/* Submit Button */}
          <Button
            type="default"
            block
            size="large"
            htmlType="submit"
            className="mt-4 font-bold bg-black text-white rounded"
          >
            Xác nhận đặt lại mật khẩu
          </Button>

          {/* Additional Links */}
          <div className="mt-4 text-center">
            <span>
              Bạn đã nhớ tài khoản?{" "}
              <a href="/login" className="text-blue-500">
                Đăng nhập ngay
              </a>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordFeature;
