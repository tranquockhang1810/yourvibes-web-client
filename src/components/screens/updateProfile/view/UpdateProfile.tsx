"use client"
import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Row, Col, Space, Upload, message } from 'antd';

import { UploadOutlined, CameraOutlined, CloseOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation"; // Sử dụng `next/navigation` thay vì `next/router
import { useAuth } from '@/context/auth/useAuth';
import dayjs from 'dayjs';
import { defaultProfileRepo } from '@/api/features/profile/ProfileRepository';

const UpdateProfileScreen = () => {
  const { user, localStrings } = useAuth();
  const [updatedForm] = Form.useForm();
  const [newAvatar, setNewAvatar] = useState({ url: "", name: "", type: "" });
  const [newCapwall, setNewCapwall] = useState({ url: "", name: "", type: "" });
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  return (
    <div className="flex flex-col p-4 w-20 h-50">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{localStrings.UpdateProfile.UpdateProfile}</h2>
      </div>

      {/* Cover Image */}
      <div className="relative mb-6">
        <img src={newCapwall?.url || user?.capwall_url} alt="cover" className="w-full h-48 object-cover rounded-md" />
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
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img src={newAvatar?.url || user?.avatar_url} alt="avatar" className="w-32 h-32 rounded-full object-cover" />
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
          <Input placeholder={localStrings.Form.Label.Email} disabled />
        </Form.Item>

        <Form.Item name="biography" label={localStrings.Form.Label.Biography}>
          <Input.TextArea placeholder={localStrings.Form.Label.Biography} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateProfileScreen;
