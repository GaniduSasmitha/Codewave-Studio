import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRole?: 'customer' | 'admin';
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('user_role');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'customer') {
      return <Navigate to="/portal" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
