import React from 'react';
import { Layout, Menu, Button, theme, Typography, MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Folder,
  Users,
  LogOut,
  TagIcon,
  MessageCircleIcon,
} from 'lucide-react';

// Import Hook Auth
import { useAuthActions } from '@/hooks/useAuth';

const { Sider } = Layout;
const { Text } = Typography;

// Định nghĩa kiểu dữ liệu cho item menu Antd
type MenuItem = Required<MenuProps>['items'][number];

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useAuthActions();
  const { token } = theme.useToken();

  const menuItems: MenuItem[] = [
    {
      key: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
    },
    {
      key: '/admin/articles',
      icon: <FileText size={20} />,
      label: 'Bài viết',
    },
    {
      key: '/admin/categories',
      icon: <Folder size={20} />,
      label: 'Danh mục',
    },
    {
      key: '/admin/users',
      icon: <Users size={20} />,
      label: 'Người dùng',
    },
    {
      key: '/admin/tags',
      icon: <TagIcon size={20} />,
      label: 'Tags',
    },
    {
      key: '/admin/comments',
      icon: <MessageCircleIcon size={20} />,
      label: 'Comments',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sider
      width={250}
      theme="light"
      className="border-r border-gray-200 h-screen fixed left-0 top-0 bottom-0 z-50 shadow-sm flex flex-col"
      // style={{ position: 'fixed', left: 0, top: 0, bottom: 0 }} // Nếu className fixed ko ăn
    >
      {/* --- HEADER (LOGO) --- */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md mr-3 font-bold text-white"
          style={{ backgroundColor: token.colorPrimary }}
        >
          A
        </div>
        <Text strong style={{ fontSize: 16 }}>
          Admin System
        </Text>
      </div>

      {/* --- CONTENT (MENU) --- */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2">
          <Text type="secondary" className="text-xs uppercase font-semibold">
            Menu chính
          </Text>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </div>

      {/* --- FOOTER (LOGOUT) --- */}
      <div className="p-4 border-t border-gray-100 shrink-0 bg-gray-50">
        <Button
          type="text"
          danger
          block
          icon={<LogOut size={18} />}
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
        >
          Đăng xuất
        </Button>
      </div>
    </Sider>
  );
};

export default AppSidebar;
