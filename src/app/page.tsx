"use client";
import { Spin } from "antd";
import { useAuth } from "@/context/auth/useAuth";
import LoginPage from "./login/page";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.push("/home");
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
    {isLoading ? (
      <Spin tip="Loading..." />
    ) : (
      <LoginPage />
    )}
  </div>
  );
};

export default Page;