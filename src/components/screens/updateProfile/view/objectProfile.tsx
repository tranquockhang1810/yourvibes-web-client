import { useState } from 'react';
import { Button, Typography, Row, Col, Radio, Space } from 'antd';
import { CloseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import UpdateProfileViewModel from '../viewModel/UpdateProfileViewModel';
import { useAuth } from '@/context/auth/useAuth';
import { defaultProfileRepo } from '@/api/features/profile/ProfileRepository';
import { Privacy } from '@/api/baseApiResponseModel/baseApiResponseModel';

const ObjectProfile = () => {
  const { user, localStrings } = useAuth();
  const [selectedOption, setSelectedOption] = useState(user?.privacy);
  const { loading, updateProfile } = UpdateProfileViewModel(defaultProfileRepo);
  const router = useRouter();

  const handleSelect = (option: Privacy) => {
    setSelectedOption(option);
  };

  const handleSavePrivacy = () => {
    updateProfile({ privacy: selectedOption });
    router.back();
  };

  const options = [
    { label: localStrings.Public.Public, icon: 'globe', description: localStrings.ObjectPostPrivacy.PublicDescription, value: Privacy.PUBLIC },
    { label: localStrings.Public.Friend, icon: 'people', description: localStrings.ObjectPostPrivacy.FriendDescription, value: Privacy.FRIEND_ONLY },
    { label: localStrings.Public.Private, icon: 'lock-closed', description: localStrings.ObjectPostPrivacy.PrivateDescription, value: Privacy.PRIVATE },
  ];

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <button onClick={() => router.back()} className="text-blue-600">
          <CloseOutlined />
        </button>
        <Typography.Title level={3}>{localStrings.ObjectProfile.ProfilePrivacy}</Typography.Title>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <Typography.Text strong className="text-lg">
          {localStrings.ObjectProfile.Contents.WhoCanSee}
        </Typography.Text>
        <p className="mt-2">
          {localStrings.ObjectPostPrivacy.Contents.DefaultPrivacy1}
          <span className="font-semibold">{localStrings.Public.Public}</span>
          {localStrings.ObjectProfile.Contents.DefaultPrivacy2}
        </p>

        <Typography.Text strong className="text-lg mt-4">
          {localStrings.ObjectPostPrivacy.ChoosePrivacy}
        </Typography.Text>

        <div className="mt-4">
          {options.map((option) => (
            <Row key={option.label} align="middle" className="my-2">
              <Col span={1}>
                <Radio
                  checked={selectedOption === option.value}
                  onChange={() => handleSelect(option.value)}
                  className="mr-4"
                />
              </Col>
              <Col span={1}>
                <CheckCircleOutlined
                  className={`text-lg ${selectedOption === option.value ? 'text-blue-600' : 'text-gray-400'}`}
                />
              </Col>
              <Col span={22}>
                <div className="flex flex-col">
                  <Typography.Text>{option.label}</Typography.Text>
                  <Typography.Text className="text-gray-500 text-sm">{option.description}</Typography.Text>
                </div>
              </Col>
            </Row>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4">
        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleSavePrivacy}
          className="rounded-full"
        >
          {localStrings.Public.Save}
        </Button>
      </div>
    </div>
  );
};

export default ObjectProfile;
