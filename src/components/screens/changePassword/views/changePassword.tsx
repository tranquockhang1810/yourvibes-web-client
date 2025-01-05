import { useAuth } from '@/context/auth/useAuth'
import React, { useState } from 'react'
import ChangPassword from '../viewModel/changePasswordViewModel';
import { defaultProfileRepo } from '@/api/features/profile/ProfileRepository';
import useColor from '@/hooks/useColor';
import { Button, Form, Input, message } from 'antd';
import { log } from 'console';
import ChangePasswordViewModel from '../viewModel/changePasswordViewModel';

const ChangePassword = () => {
    const {localStrings} = useAuth();
    const {loading, changePassword, setShowChangePassword} = ChangePasswordViewModel(defaultProfileRepo);
    const onFinish = async (values: any) => {
        if(values.oldPassword === values.newPassword) {
            message.error(localStrings.Form.TypeMessage.PleaseOldPasswordDifferentNewPassword);
            return;
        }
        if(values.newPassword !== values.confirmPassword) {
            message.error(localStrings.Form.TypeMessage.ConfirmPasswordTypeMessage);
            return;
        }
        await changePassword({ old_password: values.oldPassword, new_password: values.newPassword });
        setShowChangePassword(false);
    }

  return (
    <div>
    <Form
      name="changePassword"
      layout="vertical"
      className="w-full"
        onFinish={onFinish}
    >
      {/* Mật Khẩu cũ */}
      <Form.Item
        name="oldPassword"
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

      {/* Mật khẩu mới */}
        <Form.Item
            name="newPassword"
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
        
        {/* Xác nhận mật khẩu */}
        <Form.Item
            name="confirmPassword"
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

      {/* Nút Đăng nhập */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
          loading={loading}
        >
          {localStrings.ChangePassword.ConformChangePassword}
        </Button>
      </Form.Item>
    </Form>
  </div>
  )
}

export default ChangePassword