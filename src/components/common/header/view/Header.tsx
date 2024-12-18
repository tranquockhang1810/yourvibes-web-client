"use client"; // Đảm bảo rằng đây là một client-side component

import React, { useState } from "react";
import { Layout, Menu, Input } from "antd";
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

const { Header } = Layout;

const MyHeader = () => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { localStrings } = useAuth();
  const router = useRouter(); // Khởi tạo useRouter từ next/navigation

  const content = {
    nav: [
      {
        link: "/home",
        content: "Home",
        icon: FaHome,
      },
      {
        link: "/profile",
        content: "Profile",
        icon: FaUser,
      },
      {
        link: "/notifications",
        content: "Notifications",
        icon: FaBell,
      },
      {
        link: "/settings",
        content: "Settings",
        icon: FaCog,
      },
    ],
  };

  const { nav } = content;

  const handleMenuClick = () => {
    setVisible(!visible);
  };

  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value);
    console.log("Search query:", e.target.value);
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
          backgroundColor: "white",
          padding: "0 20px",
          borderBottom: "1px solid #dcdcdc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src="/image/yourvibes_black.png"
            alt="YourVibes"
            style={{ height: "40px" }}
            onClick={() => router.push("/home")}
          />

          <Input
            placeholder={localStrings.Search.Search}
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: "300px",
              borderRadius: "8px",
            }}
          />
        </div>

        <MenuOutlined
          type="menu"
          style={{
            fontSize: "24px",
            color: "black",
            cursor: "pointer",
          }}
          onClick={handleMenuClick}
        />
      </Header>

      {visible && (
        <Menu
          mode="inline"
          style={{
            position: "absolute",
            top: "64px",
            right: "20px",
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
                {createElement(item.icon)}
              </div>
            </Menu.Item>
          ))}
        </Menu>
      )}
    </Layout>
  );
};

export default MyHeader;