import { UpdateProfileRequestModel } from '@/api/features/profile/model/UpdateProfileModel';
import { defaultProfileRepo, ProfileRepo } from '@/api/features/profile/ProfileRepository';
import { useAuth } from '@/context/auth/useAuth';
import { message } from 'antd';
import { useState } from 'react'



const UpdateProfileViewModel = (repo: ProfileRepo) => {
  const [loading, setLoading] = useState(false);
  const { localStrings, onUpdateProfile } = useAuth();

  //update Profile
const updateProfile = async (data: UpdateProfileRequestModel) => {
  try {
    setLoading(true);
    const response = await defaultProfileRepo.updateProfile(data);
    
    if (!response?.error) {
      onUpdateProfile(response?.data);
      message.success(localStrings.UpdateProfile.UpdateSuccess);
    } else {
      message.error(localStrings.UpdateProfile.UpdateFailed);
    }
  } catch (error: any) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  return {
    loading,
    updateProfile,
  };
};

export default UpdateProfileViewModel;
