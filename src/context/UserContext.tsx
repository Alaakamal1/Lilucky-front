"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { User } from "../interfaces";
const UserContext = createContext<{ user: User | null; setUser: (user: User | null) => void } | null>(null);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
const token = sessionStorage.getItem("token");
    if (!token) return;
    apiClient
      .get(Endpoints.account, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null));
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
