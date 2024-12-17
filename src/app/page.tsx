"use client";
import { useAuth } from '@/context/auth/useAuth';
import LoginPage from './login/page';
import Homepage from './(webRouter)/home/page';
import MyHeader from '@/components/common/header/view/Header'; 

const Page = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className='w-full'>
      {isAuthenticated ? (
        <>
          <MyHeader />
          <Homepage />
        </>
      ) : (
        <LoginPage />
      )}
    </div>
  );
};

export default Page;