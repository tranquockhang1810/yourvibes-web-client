"use client"
import React from 'react';
import { useRouter } from "next/navigation"; // Sử dụng `next/navigation` thay vì `next/router
import { Button, Modal } from 'antd';
import { useAuth } from '@/context/auth/useAuth';
import useColor from '@/hooks/useColor';
import { on } from 'events';
import UpdateProfileScreen from '../../updateProfile/view/UpdateProfile';

const SettingsTab = () => {
  const router = useRouter();
  const { brandPrimary } = useColor();
  const { onLogout, changeLanguage, localStrings } = useAuth();

  const handleLogout = () => {
    Modal.confirm({
      centered: true,
      title: localStrings.Public.Confirm,
      content: localStrings.Public.LogoutConfirm,
      okText: localStrings.Public.LogOut,
      cancelText: localStrings.Public.Cancel,
      onOk: onLogout,
    });
  };

  const showLanguageOptions = () => {
    Modal.confirm({
      centered: true,
      title: localStrings.Public.Language,
      content: (
        <div className="space-y-2">
          <Button
            className="w-full"
            type="default"
            onClick={() => changeLanguage()}
          >
            {localStrings.Public.English}
          </Button>
          <Button
            className="w-full"
            type="default"
            onClick={() => changeLanguage()}
          >
            {localStrings.Public.Vietnamese}
          </Button>
        </div>
      ),
      okButtonProps: { style: { display: 'none' } },
      cancelText: localStrings.Public.Cancel,
    });
  };

  const handleProfileEdit = () => {
    Modal.confirm({
      centered: true,
      title: localStrings.UpdateProfile.UpdateProfile,
      content: (<UpdateProfileScreen />),
      okText: localStrings.Public.Save,
      cancelText: localStrings.Public.Cancel,
      onOk: () => { },
    });
  }

  return (
    <div className="flex flex-col space-y-4 p-5">
      <Button
        className="w-full text-brandPrimary border-none"
        onClick={handleProfileEdit}
      >
        {localStrings.Public.EditProfile}
      </Button>
      <Button
        className="w-full text-brandPrimary border-none"
        onClick={() => router.push('/changePassword')}
      >
        {localStrings.Public.ChangePassword}
      </Button>
      <Button
        className="w-full text-brandPrimary border-none"
        onClick={showLanguageOptions}
      >
        {localStrings.Public.Language}
      </Button>
      <Button
        className="w-full text-brandPrimary border-none"
        onClick={handleLogout}
      >
        {localStrings.Public.LogOut}
      </Button>

    </div>
  );
};

export default SettingsTab;


