import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Layout, Button, Dropdown, Avatar, Badge, Space, Menu, Typography, Drawer } from 'antd';
import type { MenuProps } from 'antd';
import {
  Home,
  User,
  LogOut,
  Bell,
  FileText,
  Heart,
  Menu as MenuIcon,
  ChevronDown,
  X,
} from 'lucide-react';

// Import Store & Types
import { useAuthStore } from '@/store/auth-store';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const ClientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lấy state từ authStore
  const { user, logout } = useAuthStore();

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  // Menu Dropdown cho User
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'my-profile',
      label: <Link to="/my-profile">Thông tin cá nhân</Link>,
      icon: <User size={16} />,
    },
    {
      key: 'my-article',
      label: <Link to="/my-article">Tin đăng của tôi</Link>,
      icon: <FileText size={16} />,
    },
    {
      key: 'my-save-articles',
      label: <Link to="/my-save-articles">Tin đã lưu</Link>,
      icon: <Heart size={16} />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogOut size={16} />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Menu điều hướng chính (Navbar)
  const navItems = [
    { label: 'Trang chủ', key: '/', icon: <Home size={18} /> },
    // { label: 'Cho thuê phòng trọ', key: '/category/phong-tro' },
    // { label: 'Nhà nguyên căn', key: '/category/nha-nguyen-can' },
    { label: 'Articles', key: '/articles' },
  ];

  // Xử lý click menu item trên mobile
  const handleMobileMenuClick = (key: string) => {
    navigate(key);
    setMobileMenuOpen(false);
  };

  return (
    <Layout className="min-h-screen">
      {/* --- HEADER --- */}
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '0 16px',
          height: '64px',
        }}
        className="md:px-6!"
      >
        {/* 1. Logo Section */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
            <Home size={20} className="text-white" />
          </div>
          <span className="text-lg md:text-xl font-bold text-gray-800 tracking-tight hidden sm:block">
            Nhà Trọ 24h
          </span>
        </Link>

        {/* 2. Navigation Menu (Desktop) */}
        <div className="flex-1 hidden md:block mx-4">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={navItems.map((item) => ({
              key: item.key,
              label: <Link to={item.key}>{item.label}</Link>,
            }))}
            style={{ borderBottom: 'none', lineHeight: '64px' }}
          />
        </div>

        {/* 3. User Actions Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Nút Đăng tin (Desktop & Tablet >= md) */}
          <Button
            type="primary"
            className="bg-orange-500 hover:bg-orange-600 border-none font-medium hidden! md:flex! items-center "
            icon={<FileText size={16} />}
            onClick={() => navigate('/post-new')}
            size="middle"
          >
            <span className="hidden lg:inline">Đăng tin mới</span>
            <span className="lg:hidden">Đăng tin</span>
          </Button>

          {user ? (
            // === Đã đăng nhập ===
            <>
              {/* Desktop View (>= md) */}
              <Space size="middle" className="hidden! md:flex!">
                {/* Notification */}
                <Badge count={5} size="small" offset={[-2, 2]}>
                  <Button
                    type="text"
                    shape="circle"
                    className=""
                    icon={<Bell size={20} className="text-gray-600 " />}
                  />
                </Badge>

                {/* User Dropdown */}
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full transition-colors pl-2 pr-3 border border-transparent hover:border-gray-200">
                    <Avatar
                      src={user.avatar}
                      icon={<User size={16} />}
                      className="bg-orange-100 text-orange-600"
                      size="default"
                    />
                    <div className="hidden lg:flex flex-col items-start leading-none gap-0.5">
                      <Text strong className="text-sm text-gray-700">
                        {user.fullName}
                      </Text>
                      <Text type="secondary" className="text-[10px]">
                        Thành viên
                      </Text>
                    </div>
                    <ChevronDown size={14} className="text-gray-400 hidden lg:block" />
                  </div>
                </Dropdown>
              </Space>

              {/* Mobile View (< md) - Only Icons */}
              <Space size="small" className="flex md:hidden!">
                {/* Nút Đăng tin (Mobile - Icon only) */}
                <Button
                  type="primary"
                  shape="circle"
                  className="bg-orange-500 hover:bg-orange-600 border-none"
                  icon={<FileText size={18} />}
                  onClick={() => navigate('/post-new')}
                />
                {/* User Avatar Icon */}
                <Avatar
                  src={user.avatar}
                  icon={<User size={16} />}
                  className="bg-orange-100 text-orange-600 cursor-pointer"
                  size="default"
                  onClick={() => setMobileMenuOpen(true)}
                />
              </Space>
            </>
          ) : (
            // === Chưa đăng nhập ===
            <>
              {/* Desktop View (>= md) */}
              <Space size="small" className="hidden md:flex">
                <Button type="text" onClick={() => navigate('/login')} size="middle">
                  Đăng nhập
                </Button>
                <Button onClick={() => navigate('/register')} size="middle">
                  Đăng ký
                </Button>
              </Space>

              {/* Mobile View (< md) - Only Icons */}
              <Space size="small" className="flex md:hidden!">
                {/* Nút Đăng tin (Mobile - Icon only) */}
                <Button
                  type="primary"
                  shape="circle"
                  className="bg-orange-500 hover:bg-orange-600 border-none"
                  icon={<FileText size={18} />}
                  onClick={() => navigate('/post-new')}
                />

                {/* User Icon for Login */}
                <Button
                  type="text"
                  shape="circle"
                  icon={<User size={20} className="text-gray-600" />}
                  onClick={() => setMobileMenuOpen(true)}
                />
              </Space>
            </>
          )}

          {/* Mobile Menu Button (Hamburger) */}
          <Button
            type="text"
            icon={<MenuIcon size={24} className="h-fit!" />}
            className="md:hidden! flex! "
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>
      </Header>

      {/* --- MOBILE DRAWER MENU --- */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Home size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">Nhà Trọ 24h</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        closeIcon={<X size={20} />}
        styles={{
          body: { padding: 0 },
        }}
      >
        {/* User Info Section (if logged in) */}
        {user && (
          <div className="p-4 bg-orange-50 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.avatar}
                icon={<User size={20} />}
                className="bg-orange-100 text-orange-600"
                size={48}
              />
              <div className="flex flex-col">
                <Text strong className="text-base text-gray-800">
                  {user.fullName}
                </Text>
                <Text type="secondary" className="text-xs">
                  Thành viên
                </Text>
              </div>
            </div>

            {/* Notification on mobile */}
            <div className="mt-3 pt-3 border-t border-orange-100">
              <Button type="text" icon={<Bell size={18} />} className="w-full justify-start">
                <Badge count={5} size="small" offset={[10, 0]}>
                  <span className="ml-2">Thông báo</span>
                </Badge>
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={navItems.map((item) => ({
            key: item.key,
            label: item.label,
            icon: item.icon,
            onClick: () => handleMobileMenuClick(item.key),
          }))}
          style={{ borderRight: 'none' }}
          className="py-2"
        />

        {/* User Menu Items (if logged in) */}
        {user && (
          <div className="border-t border-gray-200 mt-2">
            <Menu
              mode="vertical"
              items={[
                {
                  key: 'profile',
                  label: 'Thông tin cá nhân',
                  icon: <User size={16} />,
                  onClick: () => handleMobileMenuClick('/profile'),
                },
                {
                  key: 'my-article',
                  label: 'Tin đăng của tôi',
                  icon: <FileText size={16} />,
                  onClick: () => handleMobileMenuClick('/my-article'),
                },
                {
                  key: 'saved',
                  label: 'Tin đã lưu',
                  icon: <Heart size={16} />,
                  onClick: () => handleMobileMenuClick('/saved-posts'),
                },
                {
                  type: 'divider',
                },
                {
                  key: 'logout',
                  label: 'Đăng xuất',
                  icon: <LogOut size={16} />,
                  danger: true,
                  onClick: handleLogout,
                },
              ]}
              style={{ borderRight: 'none' }}
            />
          </div>
        )}

        {/* Auth Buttons (if not logged in) */}
        {!user && (
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button
              type="primary"
              block
              size="large"
              className="bg-orange-500 hover:bg-orange-600 border-none"
              onClick={() => {
                navigate('/register');
                setMobileMenuOpen(false);
              }}
            >
              Đăng ký
            </Button>
            <Button
              block
              size="large"
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
            >
              Đăng nhập
            </Button>
          </div>
        )}
      </Drawer>

      {/* --- MAIN CONTENT --- */}
      <Content className="site-layout" style={{ background: '#f0f2f5' }}>
        <div className="w-full max-w-[1440px] mx-auto min-h-[calc(100vh-64px-70px)] px-4 md:px-6">
          <Outlet />
        </div>
      </Content>

      {/* --- FOOTER --- */}
      <Footer style={{ textAlign: 'center', background: '#fff', padding: '24px 16px' }}>
        <div className="text-sm md:text-base">
          Nhà Trọ 24h ©{new Date().getFullYear()} Created by Minh Phùng
        </div>
      </Footer>
    </Layout>
  );
};

export default ClientLayout;
