"use client";
import React from "react";
import { Form, Input, Button, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import LoginViewModel from "../viewModel/loginViewModel";
import { AuthenRepo } from "@/api/features/authenticate/AuthenRepo";
import "antd/dist/reset.css";
import { useAuth } from "@/context/auth/useAuth";

const LoginPage = () => {
  const { localStrings } = useAuth();
  const { login, loading } = LoginViewModel(new AuthenRepo());

  const onFinish = async (values: any) => {
    message.loading({
      content: `${localStrings.Public.LoginLoading}`,
      key: "login",
    });

    await login(values);

    if (!loading) {
      message.destroy("login");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full bg-gray-100 px-4 md:px-8 lg:px-16">
      {/* Logo (Hiển thị trên mobile) */}
      <div className="flex md:hidden justify-center mt-12 mb-6">
        <img
          src="/image/yourvibes_black.png"
          alt="YourVibes"
          className="w-52 md:w-120" // Đặt chiều rộng ảnh ở kích thước 32 trên mobile và 64 trên desktop
        />
      </div>

      {/* Cột hình ảnh và Form Login (Cả 2 cột đều nhau) */}
      <div className="flex flex-1 w-full">
        {/* Cột Hình ảnh */}
        <div className="hidden md:flex flex-1 items-center justify-center mt-12">
          <img
            src="/image/yourvibes_black.png"
            alt="YourVibes"
            className="text-4xl font-cursive text-black"
          />
        </div>

        {/* Cột Form Login */}
        <div
          className="flex-1 w-full max-w-md p-6 md:p-8 border border-gray-300 rounded-lg shadow-lg bg-white mt-24 md:mt-0"
          style={{
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            className="w-full"
          >
            {/* Trường Email */}
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message:
                    localStrings.Form.RequiredMessages.EmailRequiredMessage,
                },
                {
                  type: "email",
                  message: localStrings.Form.TypeMessage.EmailTypeMessage,
                },
              ]}
            >
              <Input
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>

            {/* Trường Password */}
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message:
                    localStrings.Form.RequiredMessages.PasswordRequiredMessage,
                },
              ]}
            >
              <Input.Password
                placeholder={localStrings.Form.Label.Password}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>

            {/* Quên mật khẩu */}
            <div className="mb-4 text-center text-xs">
              <a
                href="/forgotPassword"
                className="text-blue-500 hover:underline"
              >
                {localStrings.Login.ForgotPasswordText}
              </a>
            </div>

            {/* Nút Đăng nhập */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                loading={loading}
              >
                {localStrings.Login.LoginButton}
              </Button>
            </Form.Item>

            {/* Đăng ký */}
            <div className="text-center text-sm">
              <span>
                {localStrings.Login.DontHaveAccout}{" "}
                <a href="/register" className="text-blue-500 hover:underline">
                  {localStrings.Login.SignUpNow}
                </a>
              </span>
            </div>

            {/* Hoặc đăng nhập với */}
            <div className="mt-4 text-center text-sm font-semibold">
              {localStrings.Login.Or}
            </div>

            <div className="mt-4 text-center">
              <Button
                type="default"
                icon={<GoogleOutlined />}
                className="w-full flex items-center justify-center border py-2 rounded-md hover:bg-gray-100"
                onClick={() => console.log("Google login")}
              >
                Google
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
