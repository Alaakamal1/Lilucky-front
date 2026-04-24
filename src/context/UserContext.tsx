"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { User } from "../interfaces";

/* ================= TYPES ================= */

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

/* ================= CONTEXT ================= */

const UserContext = createContext<UserContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) return;

    apiClient
      .get(Endpoints.account, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data?.data?.user ?? null);
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
};