import React from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AdminSidebar"; 

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 1. Sidebar */}
      <AppSidebar />
      
      {/* 2. Content Area */}
      {/* marginLeft: 250px để chừa chỗ cho Sidebar cố định */}
      <Layout style={{ marginLeft: 250, transition: 'all 0.2s' }}>
        <Content style={{ margin: "24px 16px", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              minHeight: "100%", 
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;