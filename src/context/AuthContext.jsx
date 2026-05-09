// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { getUser, saveSession, clearSession } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());

  const signIn = (data) => {
    saveSession(data);
    setUser(data);
  };

  const signOut = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
