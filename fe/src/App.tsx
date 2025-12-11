import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. Route Guards ---
// ProtectedRoute: Chỉ cho phép user đã login (và có thể check role Admin/Landlord)
import ProtectedRoute from './router/ProtectedRoute';
import PublicRoute from './router/PublicRoute';

// --- 2. Layouts ---
// import CustomerLayout from "./components/admin-layout/CustomerLayout";
import AdminLayout from './components/admin-layout';
import ClientLayout from './components/client-layout';
// --- 3. Pages ---
import Login from './page/login';
import Register from './page/register';

// // Customer Pages (Ví dụ)
import HomePage from './page/client/home';
import DetailPage from './page/client/detail';
import PostArticlePage from './page/client/post-new';
import MyArticlesPage from './page/client/my-article';
// import RoomDetail from "./page/room-detail";

// Admin/Landlord Pages (Các trang hiện có của bạn)
import DashboardPage from './page/admin/dashboard';
import Articles from './page/admin/articles'; // Nên đổi thành PropertiesPage
import Categories from './page/admin/categories'; // Nên đổi thành RoomTypesPage
import TagsPage from './page/admin/tags'; // Nên đổi thành AmenitiesPage
import CommentsPage from './page/admin/comments'; // Nên đổi thành ReviewsPage
import UsersPage from './page/admin/users'; // Nên đổi thành BookingsPage (Quản lý khách đặt)

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/post-new" element={<PostArticlePage />} />
          <Route path="/my-article" element={<MyArticlesPage />} />
        </Route>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="articles" element={<Articles />} />
            <Route path="categories" element={<Categories />} />
            <Route path="tags" element={<TagsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="comments" element={<CommentsPage />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center h-screen bg-gray-100">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-800">404</h2>
                <p className="text-gray-500">Page Not Found</p>
                <a href="/" className="text-blue-600 hover:underline mt-4 block">
                  Go back Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
