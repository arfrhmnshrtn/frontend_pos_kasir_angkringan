import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { UsersPage } from '../pages/users/UsersPage';
import { ChangePinPage } from '../pages/profile/ChangePinPage';
import { PosPage } from '../pages/pos/PosPage';
import { Unauthorized401 } from '../pages/errors/Unauthorized401';
import { Forbidden403 } from '../pages/errors/Forbidden403';
import { NotFound404 } from '../pages/errors/NotFound404';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes under MainLayout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <RoleRoute allowedRoles={['OWNER', 'KASIR', 'ADMIN']}>
              <DashboardPage />
            </RoleRoute>
          }
        />

        <Route
          path="/pos"
          element={
            <RoleRoute allowedRoles={['KASIR', 'OWNER', 'ADMIN']}>
              <PosPage />
            </RoleRoute>
          }
        />

        <Route
          path="/users"
          element={
            <RoleRoute allowedRoles={['OWNER', 'ADMIN']} requiredPermission={['cashier.read', 'user.read', 'users.read']}>
              <UsersPage />
            </RoleRoute>
          }
        />

        <Route path="/profile/change-pin" element={<ChangePinPage />} />
      </Route>

      {/* Error Pages */}
      <Route path="/401" element={<Unauthorized401 />} />
      <Route path="/403" element={<Forbidden403 />} />
      <Route path="/404" element={<NotFound404 />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};
