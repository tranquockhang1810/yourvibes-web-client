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
      content: "Đang đăng nhập, vui lòng đợi...",
      key: "login",
    });

    await login(values);

    if (!loading) {
      message.destroy("login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-5">
      <div className="flex-1 flex items-center justify-center">
        <img
          src="/image/yourvibes_black.png"
          alt="YourVibes"
          className="text-4xl font-cursive text-black"
        />
      </div>

      <div className="flex-1 max-w-md p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
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

          <div className="mb-4 text-center text-xs">
            <a href="/forgotPassword" className="text-blue-500">
              {localStrings.Login.ForgotPasswordText}
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-black text-white"
              loading={loading}
            >
              {localStrings.Login.LoginButton}
            </Button>
          </Form.Item>

          <div className="text-center">
            <span>
              {localStrings.Login.DontHaveAccout}{" "}
              <a href="/register" className="text-blue-500">
                {localStrings.Login.SignUpNow}
              </a>
            </span>
          </div>

          <div className="mt-4 text-center text-sm">{localStrings.Login.Or}</div>

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