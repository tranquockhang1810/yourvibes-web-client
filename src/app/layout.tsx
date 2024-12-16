import { PostProvider } from "@/context/post/usePostContext";
import { AuthProvider} from "../context/auth/useAuth";
import { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import LoginPage from "./login/page";
import "./globals.css";
import { ConfigProvider } from "antd";
import useColor from "@/hooks/useColor";

export const metadata: Metadata = {
  title: "YourVibes",
  description: "...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { brandPrimary } = useColor();
  
  return (
    <html lang="en">
      <AntdRegistry>
        <ConfigProvider theme={{ token: { colorPrimary: brandPrimary} }}>
          <AuthProvider>
            <PostProvider>
              <body>{children}</body>
            </PostProvider>
          </AuthProvider>
        </ConfigProvider>
      </AntdRegistry>
    </html>
  );
}
