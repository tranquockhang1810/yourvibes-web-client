"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation"; // Sử dụng `next/navigation` thay vì `next/router
import { Button, Col, Form, Input, Modal, Row, Upload } from 'antd';
import { useAuth } from '@/context/auth/useAuth';
import useColor from '@/hooks/useColor';
import { UploadOutlined, CameraOutlined, CloseOutlined } from '@ant-design/icons';
import { on } from 'events';
import UpdateProfileScreen from '../../updateProfile/view/UpdateProfile';
import dayjs from 'dayjs';
import { defaultProfileRepo } from '@/api/features/profile/ProfileRepository';

const SettingsTab = () => {
  const router = useRouter();
  const { brandPrimary } = useColor();
  const { onLogout, changeLanguage, user, localStrings } = useAuth();
  const [updatedForm] = Form.useForm();
  const [newAvatar, setNewAvatar] = useState({ url: "", name: "", type: "" });
  const [newCapwall, setNewCapwall] = useState({ url: "", name: "", type: "" });
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  useEffect(() => {
    updatedForm.setFieldsValue({
      name: user?.name,
      family_name: user?.family_name,
      email: user?.email,
      birthday: dayjs(user?.birthday).format('DD/MM/YYYY'),
      phone_number: user?.phone_number,
      biography: user?.biography,
    });
  }, [user]);

//   const handleImageChange = (file, type) => {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       if (type === 'avatar') setNewAvatar({ url: reader.result, name: file.name, type: file.type });
//       else setNewCapwall({ url: reader.result, name: file.name, type: file.type });
//     };
//     reader.readAsDataURL(file);
//     return false; // prevent auto upload
//   };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = updatedForm.getFieldsValue();
      const updatedProfileData = {
        ...values,
        avatar_url: newAvatar?.url ? newAvatar : undefined,
        capwall_url: newCapwall?.url ? newCapwall : undefined,
        birthday: dayjs(values.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      };
      await defaultProfileRepo.updateProfile(updatedProfileData);
    //   Toast.success(localStrings.UpdateProfile.Success);
      router.push('/profile'); // Navigate to profile page after successful update
    } catch (error) {
    //   Toast.error(localStrings.UpdateProfile.Failure);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    setShowLogout(false);
    onLogout();
  }

  const handleLanguageChange = () => {
    setShowLanguage(false);
  }

  const UpdateProfile = () => {
    setShowUpdateProfile(false);
    // hàm update profile
  }

  const handleLogout = () => {
    setShowLogout(true);
  };

  const showLanguageOptions = () => {
    setShowLanguage(true);
  };

  const handleProfileEdit = () => {
    setShowUpdateProfile(true);
  }

  return (
    <div className="flex flex-col space-y-4 p-5 justify-center items-center mt-4">
      <Button
        className="w-80 text-brandPrimary border-none"
        onClick={handleProfileEdit}
      >
        {localStrings.Public.EditProfile}
      </Button>
       
      <Modal centered width={1000} title={localStrings.UpdateProfile.UpdateProfile} open={showUpdateProfile} onCancel={() => setShowUpdateProfile(false)}
      footer={[
        <Button key="cancel" onClick={UpdateProfile}>
          {localStrings.Public.Save}
        </Button>,
      ]}
      >
      <div className="flex flex-col p-4">
        {/* Cover Image */}
        <div className="relative">
          <img src={newCapwall?.url || user?.capwall_url || "/image/yourvibes_black.png"} alt="cover" className="w-full h-48 object-cover rounded-md" />
          <div className="absolute top-4 left-4">
            <Upload showUploadList={false} >
              {/* beforeUpload={(file) => handleImageChange(file, 'capwall')} */}
              <Button icon={<CameraOutlined />} />
            </Upload>
          </div>
          {newCapwall?.url && (
            <div className="absolute top-4 right-4">
              <Button icon={<CloseOutlined />} onClick={() => setNewCapwall({ url: '', name: '', type: '' })} />
            </div>
          )}
        </div>
  
        {/* Profile Image */}
        <div className="flex mb-6 mt-[-60px]">
          <div className="relative">
            <img src={newAvatar?.url || user?.avatar_url || 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'} alt="avatar" className="w-32 h-32 rounded-full object-cover" />
            <div className="absolute top-0 left-0">
              <Upload showUploadList={false}>
                  {/* beforeUpload={(file) => handleImageChange(file, 'avatar')}> */}
                <Button icon={<CameraOutlined />} />
              </Upload>
            </div>
            {newAvatar?.url && (
              <div className="absolute top-0 right-0">
                <Button icon={<CloseOutlined />} onClick={() => setNewAvatar({ url: '', name: '', type: '' })} />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center ml-4">
            <text className="text-2xl font-bold">{user?.name || "user name"}</text>
          </div>
        </div>
  
        {/* Form */}
        <Form form={updatedForm} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="family_name" label={localStrings.Form.Label.FamilyName} rules={[{ required: true }]}>
                <Input placeholder={localStrings.Form.Label.FamilyName} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label={localStrings.Form.Label.Name} rules={[{ required: true }]}>
                <Input placeholder={localStrings.Form.Label.Name} />
              </Form.Item>
            </Col>
          </Row>
  
          <Form.Item name="phone_number" label={localStrings.Form.Label.Phone} rules={[{ required: true }]}>
            <Input placeholder={localStrings.Form.Label.Phone} />
          </Form.Item>
  
          {/* Birthday Picker */}
          <div className="mb-6">
            {/* <MyDateTimePicker
              value={dayjs(updatedForm.getFieldValue('birthday')).toDate()}
              onSubmit={(date) => {
                updatedForm.setFieldValue('birthday', dayjs(date).format('DD/MM/YYYY'));
              }}
              show={showPicker}
              onCancel={() => setShowPicker(false)}
            /> */}
          </div>
  
          <Form.Item name="email" label={localStrings.Form.Label.Email} rules={[{ required: true, type: 'email' }]}>
            <Input placeholder={localStrings.Form.Label.Email}/>
          </Form.Item>
  
          <Form.Item name="biography" label={localStrings.Form.Label.Biography}>
            <Input.TextArea placeholder={localStrings.Form.Label.Biography} />
          </Form.Item>
        </Form>
      </div>
      </Modal>

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


