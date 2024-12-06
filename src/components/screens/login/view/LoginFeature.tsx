"use client";
import React from "react";
import { Form, Input, Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const LoginPage = () => {
  const onFinish = (values: any) => {
    console.log("Submitted:", values);
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
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          {/* Password input */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          {/* Link quên mật khẩu */}
          <div className="mb-4 text-center text-xs">
            <a href="#" className="text-blue-500">
              Tôi không còn nhớ mật khẩu
            </a>
          </div>

          {/* Nút đăng nhập */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-black text-white"
            >
              Đăng nhập ngay
            </Button>
          </Form.Item>

          {/* Đăng ký */}
          <div className="text-center">
            <span>
              Bạn chưa có tài khoản?{" "}
              <a href="/register" className="text-blue-500">
                Đăng ký ngay
              </a>
            </span>
          </div>

          {/* Hoặc */}
          <div className="mt-4 text-center text-sm">Hoặc</div>

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