"use client";
import React from "react";
import { Button, Checkbox, DatePicker, Form, Input, message } from "antd";
import { AuthenRepo } from "@/api/features/authenticate/AuthenRepo";
import SignUpViewModel from "../viewModel/signUpViewModel";

const SignUpFeature: React.FC = () => {
  const [form] = Form.useForm();
  const repo = new AuthenRepo(); // Khởi tạo AuthenRepo
  const { handleSignUp, verifyOTP, loading, otpLoading } = SignUpViewModel(repo);

  const onSignUp = async (values: any) => {
    try {
      await handleSignUp({
        family_name: values.firstName,
        name: values.lastName,
        email: values.email,
        password: values.password,
        phone_number: values.phone,
        birthday: values.dob.format("DD/MM/YYYY"),
        otp: values.otp,
      });
      message.success("Đăng ký thành công!");
    } catch (error) {
      message.error("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  const onRequestOTP = async () => {
    try {
      const email = form.getFieldValue("email");
      if (!email) {
        message.error("Vui lòng nhập email trước khi yêu cầu OTP!");
        return;
      }
      await verifyOTP({ email });
      message.success("Gửi OTP thành công!");
    } catch (error) {
      message.error("Gửi OTP thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-lg p-8 border border-gray-300 rounded-lg shadow-md bg-white">
        {/* Title */}
        <img
          src="/image/yourvibes_black.png"
          alt="YourVibes"
          className="mx-auto mb-4 w-32 h-auto"
        />

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={onSignUp}>
          {/* First and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
            >
              <Input placeholder="Họ" className="w-full" />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input placeholder="Tên" className="w-full" />
            </Form.Item>
          </div>

          {/* Date of Birth */}
          <Form.Item
            name="dob"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker
              placeholder="Ngày sinh"
              className="w-full"
              format="DD/MM/YYYY"
            />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
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
              loading={otpLoading}
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
            <Input.Password placeholder="Xác nhận mật khẩu" className="w-full" />
          </Form.Item>

          {/* Confirm OTP */}
          <Form.Item
            name="otp"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
          >
            <Input placeholder="Mã OTP" className="w-full" />
          </Form.Item>

          {/* Terms and Conditions */}
          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject("Bạn phải đồng ý với điều khoản!"),
              },
            ]}
          >
            <Checkbox>
              Tôi đồng ý với Điều khoản dịch vụ và chính sách bảo mật
            </Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Button
            type="default"
            block
            size="large"
            htmlType="submit"
            loading={loading}
            className="mt-4 font-bold bg-black text-white rounded"
          >
            Xác nhận đăng ký
          </Button>

          {/* Additional Links */}
          <div className="mt-4 text-center">
            <span>
              Bạn đã có tài khoản?{" "}
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

export default SignUpFeature;