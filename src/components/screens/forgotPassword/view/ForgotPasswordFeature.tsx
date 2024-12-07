"use client";
import React from "react";
import { Button, Checkbox, DatePicker, Form, Input, message } from "antd";
import { AuthenRepo } from "@/api/features/authenticate/AuthenRepo";
import { useAuth } from "@/context/auth/useAuth";
const ForgotPasswordFeature: React.FC = () => {
  const [form] = Form.useForm();
  const repo = new AuthenRepo(); // Khởi tạo AuthenRepo
const { language, localStrings } = useAuth();
  const onRequestOTP = async () => {
    try {
      const email = form.getFieldValue("email");
      const phone = form.getFieldValue("phone");
      if (!email) {
        message.error(localStrings.Form.RequiredMessages.EmailRequiredMessage);
        return;
      }
      if (!phone) {
        message.error(localStrings.Form.RequiredMessages.PhoneRequiredMessage);
      }
      await repo.verifyOTP({ email });
      message.success(localStrings.SignUp.OTPSuccess);
    } catch (error) {
      message.error(localStrings.SignUp.OTPFailed);
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
          {localStrings.ForgotPassword.ConfirmPassword}
        </h1>

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={onForgotPassword}>
          {/* Phone Number */}
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: localStrings.Form.RequiredMessages.PhoneRequiredMessage },
            ]}
          >
            <Input placeholder= {localStrings.Form.Label.Phone} className="w-full" />
          </Form.Item>

          {/* Email and OTP */}
          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="email"
              className="col-span-2"
              rules={[{ required: true, message: localStrings.Form.RequiredMessages.EmailRequiredMessage }]}
            >
              <Input placeholder="Email" className="w-full" />
            </Form.Item>
            <Button
              block
              type="default"
              className="bg-black text-white rounded"
              onClick={onRequestOTP}
            >
              {localStrings.ForgotPassword.SendOTP}
            </Button>
          </div>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: localStrings.Form.RequiredMessages.PasswordRequiredMessage }]}
          >
            <Input.Password placeholder= {localStrings.ForgotPassword.NewPassword} className="w-full" />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: localStrings.Form.RequiredMessages.ConfirmPasswordRequiredMessage },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    localStrings.Form.TypeMessage.ConfirmPasswordTypeMessage
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder= {localStrings.ForgotPassword.ConfirmPassword}
              className="w-full"
            />
          </Form.Item>

          {/* Confirm OTP */}
          <Form.Item
            name="otp"
            rules={[{ required: true, message: localStrings.Form.RequiredMessages.OTPRequiredMessage }]}
          >
            <Input placeholder= {localStrings.ForgotPassword.OTP} className="w-full" />
          </Form.Item>

          {/* Submit Button */}
          <Button
            type="default"
            block
            size="large"
            htmlType="submit"
            className="mt-4 font-bold bg-black text-white rounded"
          >
          {localStrings.ForgotPassword.ConformChangePassword}
          </Button>

          {/* Additional Links */}
          <div className="mt-4 text-center">
            <span>
              {localStrings.ForgotPassword.AlreadyAccount}{" "}
              <a href="/login" className="text-blue-500">
                {localStrings.SignUp.LoginNow}
              </a>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordFeature;
