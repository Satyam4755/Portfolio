import { Navigate, Route, Routes } from 'react-router-dom';
import { ADMIN_SLUG } from './config';
import PublicLayout from './components/PublicLayout';
import AdminRoute from './components/AdminRoute';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />} />

      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route
        path={`/${ADMIN_SLUG}`}
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
