"use client";
import React from "react";
import { Form, Input, Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/useAuth";
import LoginViewModel from "../viewModel/loginViewModel";
import { AuthenRepo } from "@/api/features/authenticate/AuthenRepo";
import "antd/dist/reset.css";

const LoginPage = () => {
  const router = useRouter(); // Sử dụng useRouter trong component React
  const { login, loading } = LoginViewModel(new AuthenRepo(), (user) => {
    console.log("Logged in user:", user);
    router.push("/home"); // Điều hướng sau khi đăng nhập thành công
  });

  const { localStrings } = useAuth();

  const onFinish = (values: any) => {
    login(values); // Gọi hàm login với dữ liệu từ form
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-5">
      {/* Logo bên trái */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src="/image/yourvibes_black.png"
          alt="YourVibes"
          className="text-4xl font-cursive text-black"
        />
      </div>

      {/* Form đăng nhập bên phải */}
      <div className="flex-1 max-w-md p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          {/* Email input */}
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: localStrings.Form.RequiredMessages.EmailRequiredMessage,
              },
              {
                type: "email",
                message: localStrings.Form.TypeMessage.EmailTypeMessage,
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          {/* Password input */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: localStrings.Form.RequiredMessages.PasswordRequiredMessage,
              },
            ]}
          >
            <Input.Password placeholder={localStrings.Form.Label.Password} />
          </Form.Item>

          {/* Link quên mật khẩu */}
          <div className="mb-4 text-center text-xs">
            <a href="/forgotPassword" className="text-blue-500">
              {localStrings.Login.ForgotPasswordText}
            </a>
          </div>

          {/* Nút đăng nhập */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-black text-white"
              loading={loading} // Hiển thị trạng thái loading khi đang đăng nhập
            >
              {localStrings.Login.LoginButton}
            </Button>
          </Form.Item>

          {/* Đăng ký */}
          <div className="text-center">
            <span>
              {localStrings.Login.DontHaveAccout}{" "}
              <a href="/register" className="text-blue-500">
                {localStrings.Login.SignUpNow}
              </a>
            </span>
          </div>

          {/* Hoặc */}
          <div className="mt-4 text-center text-sm">{localStrings.Login.Or}</div>

          {/* Nút Google */}
          <div className="mt-4 text-center">
            <Button
              type="default"
              icon={<GoogleOutlined />}
              className="w-full flex items-center justify-center"
              onClick={() => console.log("Google login")}
            >
              Google
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;