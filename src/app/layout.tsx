import { PostProvider } from "@/context/post/usePostContext";
import { AuthProvider } from "../context/auth/useAuth";
import { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import LoginPage from "./login/page";
import "./globals.css";

export const metadata: Metadata = {
  title: "YourVibes",
  description: "...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <AntdRegistry>
        <AuthProvider>
          <PostProvider>
            <body>{children}</body>
          </PostProvider>
        </AuthProvider>
      </AntdRegistry>
    </html>
  );
}