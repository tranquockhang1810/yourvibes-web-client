"use client"
import ProfileFeature from '@/components/screens/profile/views/ProfileFeature';
import React, { Suspense } from 'react';

const ProfilePage = () => {
  return (
    <Suspense>
      <ProfileFeature />
    </Suspense>
  );
};

export default ProfilePage;