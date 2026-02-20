import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function AdminRoute({ children }) {
  const { loggedIn } = useAdminAuth();
  const location = useLocation();

  if (!loggedIn) {
    return <Navigate to="/admin-login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
