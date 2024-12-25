"use client";
import { useAuth } from '@/context/auth/useAuth';
import LoginPage from './login/page';
import Homepage from './(webRouter)/home/page';
import MyHeader from '@/components/common/header/view/Header'; 
import Layout from './(webRouter)/layout';
import { useRouter } from 'next/navigation';

const Page = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();  // Khởi tạo useRouter

  // Nếu đã đăng nhập, điều hướng đến trang chính
  if (isAuthenticated) {
    router.push('/home');  // Điều hướng đến URL /home
  }

  return (
    <div className='w-full'>
     <LoginPage />
    </div>
  );
};

export default Page;
