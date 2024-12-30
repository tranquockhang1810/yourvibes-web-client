"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Space,
  Upload,
  message,
  Typography,
  Radio,
  Modal,
} from "antd";

import {
  UploadOutlined,
  CameraOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/auth/useAuth";
import dayjs from "dayjs";
import { defaultProfileRepo } from "@/api/features/profile/ProfileRepository";
import UpdateProfileViewModel from "../viewModel/UpdateProfileViewModel";
import { useRouter } from "next/navigation";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel";
import useColor from "@/hooks/useColor";
import { FaGlobe, FaLock } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import ModalObjectProfile from "../../profile/components/ModalObjectProfile";
import MydateTimePicker from "@/components/foundation/MydateTimePicker";

const { Text } = Typography;

const UpdateProfileScreen = () => {
  const { user, localStrings, changeLanguage, language } = useAuth();
  const {brandPrimaryTap,lightGray} = useColor();
  const [showObject, setShowObject] = React.useState(false);
  const [updatedForm] = Form.useForm();
  const [newAvatar, setNewAvatar] = useState<{
    url: string;
    name: string;
    type: string;
    file?: File;
  }>({ url: "", name: "", type: "" });
  const [newCapwall, setNewCapwall] = useState<{
    url: string;
    name: string;
    type: string;
    file?: File;
  }>({ url: "", name: "", type: "" });
  const [loading, setLoading] = useState(false);
  const { updateProfile } = UpdateProfileViewModel(defaultProfileRepo);
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  useEffect(() => {
    updatedForm.setFieldsValue({
      name: user?.name,
      family_name: user?.family_name,
      email: user?.email,
      birthday: dayjs(user?.birthday).format("DD/MM/YYYY"),
      phone_number: user?.phone_number,
      biography: user?.biography,
    });
  }, [user]);

  const pickAvatarImage = (file: File) => {
    // Kiểm tra loại tệp (nếu cần)
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      // Nếu không phải ảnh, trả về false để không cho phép tải lên
      return false;
    }

    // Cập nhật trạng thái với thông tin tệp
    setNewAvatar({
      url: URL.createObjectURL(file), // Tạo URL tạm thời từ tệp
      name: file.name, // Tên tệp
      type: file.type,
      file: file, // Loại tệp
    });

    return true; // Trả về true để tệp có thể được tải lên
  };

  const pickCapwallImage = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      return false;
    }

    // Cập nhật trạng thái với thông tin tệp
    setNewCapwall({
      url: URL.createObjectURL(file), // Tạo URL tạm thời từ tệp
      name: file.name,
      type: file.type,
      file: file,
    });

    return true;
  };

  const UpdateProfile = () => {
    setLoading(true);
    setNewAvatar({ url: "", name: "", type: "" });
    setNewCapwall({ url: "", name: "", type: "" });
    // Lấy dữ liệu từ form và chuẩn bị các trường ảnh
    const data = {
      ...updatedForm.getFieldsValue(),
      avatar_url: newAvatar?.file, // Sử dụng tệp avatar thực tế
      capwall_url: newCapwall?.file, // Sử dụng tệp capwall thực tế
    };

    // Gọi hàm updateProfile với dữ liệu đã chuẩn bị
    updateProfile(data);
    router.back();
  };


      const renderPrivacyIcon = () => {
          switch (user?.privacy) {
            case Privacy.PUBLIC:
              return <FaGlobe size={16} color={brandPrimaryTap} />;
            case Privacy.FRIEND_ONLY:
              return <IoMdPeople size={20} color={brandPrimaryTap} />;
            case Privacy.PRIVATE:
              return <FaLock name="lock-closed" size={17} color={brandPrimaryTap} />;
            default:
              return null;
          }
        }

  return (
    <div className="p-2.5">
      <div className="mb-2 flex items-center">
        <Button
          icon={<CloseOutlined />}
          type="text"
          onClick={() => router.back()}
        />
        <Text strong style={{ fontSize: "18px", marginLeft: "10px" }}>
          {localStrings.UpdateProfile.UpdateProfile}
        </Text>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex-1 mr-6">
          {/* Cover Image */}
          <div className="relative mb-6">
            <img
              src={newCapwall?.url || user?.capwall_url}
              alt="cover"
              className="w-full h-72"
            />
            <div className="absolute top-4 left-4">
              <Upload showUploadList={false} beforeUpload={pickCapwallImage}>
                <Button icon={<CameraOutlined />} />
              </Upload>
            </div>
            {newCapwall?.url && (
              <div className="absolute top-4 right-4">
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => setNewCapwall({ url: "", name: "", type: "" })}
                />
              </div>
            )}
          </div>

          {/* Profile Image */}
          <div className="flex  ml-6 mt-[-80px]">
            <div className="relative rounded-full border border-gray-950">
              <img
                src={newAvatar?.url || user?.avatar_url}
                alt="avatar"
                className="w-44 h-44 rounded-full"
              />
              <div className="absolute top-0 left-2.5">
                <Upload showUploadList={false} beforeUpload={pickAvatarImage}>
                  <Button icon={<CameraOutlined />} />
                </Upload>
              </div>
              {newAvatar?.url && (
                <div className="absolute top-0 right-0">
                  <Button
                    icon={<CloseOutlined />}
                    onClick={() =>
                      setNewAvatar({ url: "", name: "", type: "" })
                    }
                  />
                </div>
              )}
            </div>
            <span className="font-bold text-lg ml-6 mt-[60px]">
              {`${user?.family_name} ${user?.name}` ||
                localStrings.Public.Username}
                </span>
          </div>

        </div>

        <div className="flex-initial mr-6 w-1/3">

          {/* Form */}
          <Form form={updatedForm} layout="vertical" onFinish={UpdateProfile}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="family_name"
                  label={localStrings.Form.Label.FamilyName}
                  rules={[{ required: true }]}
                >
                  <Input placeholder={localStrings.Form.Label.FamilyName} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label={localStrings.Form.Label.Name}
                  rules={[{ required: true }]}
                >
                  <Input placeholder={localStrings.Form.Label.Name} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="phone_number"
              label={localStrings.Form.Label.Phone}
              rules={[{ required: true }]}
            >
              <Input placeholder={localStrings.Form.Label.Phone} />
            </Form.Item>


            <Form.Item
              name="birthday"
              label={localStrings.Form.Label.BirthDay}
              rules={[{ required: true }]}
            >
              <Input placeholder={localStrings.Form.Label.BirthDay} />
            </Form.Item>

            <Form.Item
              name="email"
              label={localStrings.Form.Label.Email}
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder={localStrings.Form.Label.Email} disabled />
            </Form.Item>

            <Form.Item
              name="biography"
              label={localStrings.Form.Label.Biography}
            >
              <Input.TextArea placeholder={localStrings.Form.Label.Biography} />
            </Form.Item>
          </Form>
          <div className="flex justify-end">
          <Button
            type="primary"
            onClick={UpdateProfile}
            loading={loading}
          >
            {localStrings.Public.Save}
          </Button>
          </div>
        </div>
        <div className="flex-initial w-52">
          <p>{localStrings.Public.Language}</p>
          <Radio.Group value={language} onChange={changeLanguage}>
            <Space direction="vertical">
            <Radio value="en">{localStrings.Public.English}</Radio>
            <Radio value="vi">{localStrings.Public.Vietnamese}</Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>

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
          <MydateTimePicker 
          value={dayjs(updatedForm.getFieldValue('birthday')).toDate()}
          onSubmit={(date) => {
            updatedForm.setFieldsValue({ birthday: dayjs(date).format('DD/MM/YYYY') });
          }
          }
          show={showPicker}
          onCancel={() => setShowPicker(false)}
          />
            </div>
    </div>
  );
};

export default UpdateProfileScreen;
