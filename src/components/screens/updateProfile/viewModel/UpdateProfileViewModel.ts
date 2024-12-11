import { UpdateProfileRequestModel } from '@/api/features/profile/model/UpdateProfileModel';
import { ProfileRepo } from '@/api/features/profile/ProfileRepository';
import { useAuth } from '@/context/auth/useAuth';
import { useState } from 'react'

const UpdateProfileViewModel = (repo: ProfileRepo) => {
  const [loading, setLoading] = useState(false);
  const { localStrings, onUpdateProfile } = useAuth();

  const updateProfile = async (data: UpdateProfileRequestModel) => {
    try {
      setLoading(true);
      const res = await repo.updateProfile(data);
      if (!res?.error) {
        onUpdateProfile(res?.data);
        // Toast.success(localStrings.UpdateProfile.UpdateSuccess);  // Using toast from react-toastify
      } else {
        // Toast.error(`${localStrings.UpdateProfile.UpdateFailed}: ${res?.error?.message}`);
      }
    } catch (error: any) {
      console.error(error);
    //   Toast.error(`${localStrings.UpdateProfile.UpdateFailed}: ${error?.error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateProfile,
  };
};

export default UpdateProfileViewModel;
