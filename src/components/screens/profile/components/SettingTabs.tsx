"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation"; // Sử dụng `next/navigation` thay vì `next/router
import { Button, Col, Form, Input, message, Modal, Row, Upload } from 'antd';
import { useAuth } from '@/context/auth/useAuth';

const SettingsTab = () => {
  const router = useRouter();
  const { onLogout, changeLanguage, user, localStrings } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  
  const handleOk = () => {
    setShowLogout(false);
    onLogout();
  }

  const handleLanguageChange = () => {
    setShowLanguage(false);
  }

  const handleLogout = () => {
    setShowLogout(true);
  };

  const showLanguageOptions = () => {
    setShowLanguage(true);
  };

  const handleProfileEdit = () => {
    router.push('/updateProfile');
  }

  return (
    <div className="flex flex-col space-y-4 p-5 justify-center items-center mt-4">
      <Button
        className="w-80 text-brandPrimary border-none"
        onClick={handleProfileEdit}
      >
        {localStrings.Public.EditProfile}
      </Button>

      <Button
        className="w-80 text-brandPrimary border-none"
        onClick={() => router.push('/changePassword')}
      >
        {localStrings.Public.ChangePassword}
      </Button>
      <Button
        className="w-80 text-brandPrimary border-none"
        onClick={showLanguageOptions}
      >
        {localStrings.Public.Language}
      </Button>
      {/* //modal language  */}
      <Modal centered title={localStrings.Public.Language} open={showLanguage} onCancel={handleLanguageChange}
       footer={[
        <Button key="cancel" onClick={handleLanguageChange}>
          {localStrings.Public.Cancel}
        </Button>,
      ]}
      >
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
      </Modal>

      <Button
        className="w-80 text-brandPrimary border-none"
        onClick={handleLogout}
      >
        {localStrings.Public.LogOut}
      </Button>
      {/* //modal logout  */}
      <Modal centered title={localStrings.Public.Confirm} open={showLogout} onOk={handleOk} onCancel={()=> setShowLogout(false)}  okText={localStrings.Public.Confirm} cancelText={localStrings.Public.Cancel}>
        <div>
          <text>{localStrings.Public.LogoutConfirm}</text>
        </div>
      </Modal>

    </div>
  );
};

export default SettingsTab;

