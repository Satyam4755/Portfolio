import { createContext, useContext, useMemo, useState } from 'react';
import { isAdminLoggedIn, loginAdmin, logoutAdmin } from '../services';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());

  const value = useMemo(
    () => ({
      loggedIn,
      async login(password) {
        await loginAdmin(password);
        setLoggedIn(true);
      },
      logout() {
        logoutAdmin();
        setLoggedIn(false);
      }
    }),
    [loggedIn]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}
