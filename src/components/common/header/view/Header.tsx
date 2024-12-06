"use client";
import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { createElement } from "react"; // Để sử dụng các icon động
import { FaHome, FaSearch, FaShoppingCart, FaBell, FaCog, FaUserCog } from "react-icons/fa"; // Example icons from react-icons

const { Header } = Layout;

const MyHeader = () => {
  const [visible, setVisible] = useState(false);

  // Định nghĩa nội dung menu trực tiếp trong component
  const content = {
    nav: [
      {
        link: "#home",
        icon: FaHome, // Home icon
      },
      {
        link: "#search",
        icon: FaSearch, // Search icon
      },
      {
        link: "#avatar",
        icon: FaUserCog, // Cart icon
      },
      {
        link: "#notifications",
        icon: FaBell, // Notification icon
      },
      {
        link: "#settings",
        icon: FaCog, // Settings icon
      },
    ],
  };

  const { nav } = content; // Lấy danh sách các mục menu từ content

  const handleMenuClick = () => {
    setVisible(!visible);
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
        <img
          src="/image/yourvibes_black.png"
          alt="YourVibes"
          style={{ height: "40px" }}
        />
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
            >
              {/* Render icon dynamically using createElement */}
              <div
                style={{
                  marginRight: "10px",
                  fontSize: "20px",
                  color: "#1890ff", // Add color to the icons
                }}
              >
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
