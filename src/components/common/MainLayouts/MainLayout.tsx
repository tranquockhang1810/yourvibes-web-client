"use client"; // Đảm bảo rằng đây là một client-side component

import React, { useState } from "react";
import { Layout, Menu, Input, Grid } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { createElement } from "react";
import {
  FaHome,
  FaSearch,
  FaShoppingCart,
  FaBell,
  FaCog,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "@/context/auth/useAuth";
import { useRouter } from "next/navigation"; // Sử dụng `next/navigation` thay vì `next/router`
import SearchScreen from "@/components/screens/search/views/SearchScreen";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import useColor from "@/hooks/useColor";

const { useBreakpoint } = Grid;
const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const { backgroundColor } = useColor();
  const [searchQuery, setSearchQuery] = useState("");
  const { localStrings } = useAuth();
  const router = useRouter();
  const screens = useBreakpoint();

  const content = {
    nav: [
      {
        link: "/home",
        content: "Home",
        icon: FaHome,
      },
      {
        link: "/profile?tab=info",
        content: "Profile",
        icon: FaUser,
      },
      {
        link: "/notifications",
        content: "Notifications",
        icon: FaBell,
      },
      {
        link: "/profile?tab=settings",
        content: "Settings",
        icon: FaCog,
      },
    ],
  };

  const { nav } = content;



  const handleMenuClick = () => {
    setVisible(!visible);
  };

  // Cập nhật lại hàm handleItemClick
  const handleItemClick = (link: string) => {
    router.push(link); // Chuyển trang khi nhấn vào menu item
    setVisible(false); // Đóng menu khi nhấn vào item
  };

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: backgroundColor,
          padding: "0 20px",
          borderBottom: "1px solid #dcdcdc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src="/image/yourvibes_black.png"
            alt="YourVibes"
            style={{ height: "40px" }}
            onClick={() => router.push("/home")}
          />
          <SearchScreen />
        </div>
        <MenuOutlined
          type="menu"
          style={{
            fontSize: "24px",
            color: "black",
            cursor: "pointer",
            alignItems: "center",
            marginBottom: "9px",
            marginLeft: "10px",
          }}
          onClick={handleMenuClick}
        />
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            backgroundColor: backgroundColor,
            display: screens.lg ? "block" : "none",
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            scrollbarWidth: 'thin',
            scrollbarGutter: 'stable',
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            mode="inline"
            className="flex flex-col gap-4 justify-center h-full"
            items={nav.map((item, index) => ({
              key: index.toString(),
              icon: <item.icon style={{ fontSize: "24px",
                color: "black",}} />,
              label:<span style={{fontSize: "18px"}}>{item.content}</span>,
              onClick: () => handleItemClick(item.link),
            }))}
          />
        </Sider>
        <Content style={{ marginInlineStart: screens.lg ? 200 : 0 }}>
          <div>
            {children}
            </div>
        </Content>
      </Layout>
      {visible && (
        <Menu
          mode="inline"
          style={{
            position: "fixed",
            top: "64px",
            right: "15px",
            backgroundColor: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            width: "200px",
            borderRadius: "8px",
            zIndex: 100,
            border: "1px solid #dcdcdc",
            fontFamily: "Arial, sans-serif",
          }}
          onClick={handleMenuClick}
        >
          {nav.map((item, index) => (
            <Menu.Item
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 20px",
                fontSize: "16px",
              }}
              onClick={() => handleItemClick(item.link)} // Gọi handleItemClick
            >
              <div
                style={{
                  display: "flex",
                  marginRight: "10px",
                  fontSize: "20px",
                  color: "#black",
                }}
              >
                {item.content}
              </div>
            </Menu.Item>
          ))}
        </Menu>
      )}
    </Layout>
  );
};

export default MainLayout;