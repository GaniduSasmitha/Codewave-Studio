import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const authState = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('user_role');
    setIsAuthenticated(authState);
    setRole(userRole);
  }, []);

  return { isAuthenticated, role };
}
