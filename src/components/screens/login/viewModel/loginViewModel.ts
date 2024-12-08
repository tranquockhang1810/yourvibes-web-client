import { AuthenRepo } from "@/api/features/authenticate/AuthenRepo"
import { LoginRequestModel } from "@/api/features/authenticate/model/LoginModel" 
import { useEffect, useState } from "react";
// import Toast from "react-native-toast-message";
// import * as Google from 'expo-auth-session/providers/google';
import ENV from "../../../../../env-config";
import { useAuth } from "@/context/auth/useAuth";

const LoginViewModel = (repo: AuthenRepo, onLogin: (user: any) => void) => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { localStrings } = useAuth();
  // const [request, response, promtAsync] = Google.useAuthRequest({
  //   webClientId: ENV.WEB_CLIENT_ID!,
  //   androidClientId: ENV.ANDROID_CLIENT_ID!,
  //   iosClientId: ENV.IOS_CLIENT_ID!,
  // })

  const login = async (data: LoginRequestModel) => {
    try {
      setLoading(true);
      const res = await repo.login(data);
      if (res?.data) {
        onLogin(res.data);
      } else {
        // Toast.show({
        //   type: 'error',
        //   text1: localStrings.Login.LoginFailed,
        //   text2: res?.error?.message
        // })
      }
    } catch (error: any) {
      console.error(error);
      // Toast.show({
      //   type: 'error',
      //   text1: localStrings.Login.LoginFailed,
      //   text2: error?.message
      // })
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // if (response?.type === "success") {
    //   console.log("handleGoogleLogin: ", response);
    //   const token = response?.authentication?.accessToken;
    //   if (token) {
    //     getGoogleUserInfo(token);
    //   } else {
    //     Toast.show({
    //       type: 'error',
    //       text1: localStrings.Login.LoginFailed
    //     })
    //   }
    // } else {
    //   Toast.show({
    //     type: 'error',
    //     text1: localStrings.Login.LoginFailed
    //   })
    // }
  }

  const getGoogleUserInfo = async (token: string) => {
    if (!token) return;
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      console.log("google data: ", data);

    } catch (error) {
      console.error(error);
    }
  }

  // useEffect(() => {
  //   if (response)
  //     handleGoogleLogin();
  // }, [response]);

  return {
    login,
    googleLoading,
    setGoogleLoading,
    loading,
    // promtAsync
  }
}

export default LoginViewModel