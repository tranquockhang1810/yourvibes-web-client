import { AuthenRepo } from "@/api/features/authenticate/AuthenRepo";
import { LoginRequestModel } from "@/api/features/authenticate/model/LoginModel";
import { useState } from "react";
import { useAuth } from "@/context/auth/useAuth";

const LoginViewModel = (repo: AuthenRepo, onLogin: (user: any) => void) => {
  const [loading, setLoading] = useState(false);
  const { localStrings } = useAuth();

  const login = async (data: LoginRequestModel) => {
    try {
      setLoading(true);
      const res = await repo.login(data);
      if (res?.data) {
        onLogin(res.data); // Gọi callback onLogin khi login thành công
      } else {
        console.error(res?.error?.message || "Login failed");
      }
    } catch (error: any) {
      console.error(error.message || "Error during login");
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
  };
};

export default LoginViewModel;
