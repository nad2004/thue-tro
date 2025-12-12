import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './router/ProtectedRoute';
import PublicRoute from './router/PublicRoute';
import AdminRoute from './router/AdminRoute';

import AdminLayout from './components/admin-layout';
import ClientLayout from './components/client-layout';
import Login from './page/login';
import Register from './page/register';

import HomePage from './page/client/home';
import ArticlesPage from './page/client/article';
import DetailPage from './page/client/detail';
import PostArticlePage from './page/client/post-new';
import MyArticlesPage from './page/client/my-article';
import MySaveArticlesPage from './page/client/my-save-articles';
import MyProfile from './page/client/my-profile';

import DashboardPage from './page/admin/dashboard';
import AdminArticles from './page/admin/articles';
import AdminCategories from './page/admin/categories';
import AdminTagsPage from './page/admin/tags';
import AdminCommentsPage from './page/admin/comments';
import AdminUsersPage from './page/admin/users';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/post-new" element={<PostArticlePage />} />
            <Route path="/my-article" element={<MyArticlesPage />} />
            <Route path="/my-save-articles" element={<MySaveArticlesPage />} />
            <Route path="/my-profile" element={<MyProfile />} />
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="tags" element={<AdminTagsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="comments" element={<AdminCommentsPage />} />
            </Route>
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
