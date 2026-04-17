// "use client";
// import { createContext, useContext, useState, useEffect } from "react";
// import { apiClient } from "@/src/utils/apiClient";
// import { Endpoints } from "@/src/utils/endpoints";
// const UserContext = createContext<any>(null);

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
// const token = sessionStorage.getItem("token");
//     if (!token) return;
//     apiClient
//       .get(Endpoints.account, { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => setUser(res.data.data.user))
//       .catch(() => setUser(null));
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);
/////////////////////////////////////////////////////////////////////

"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    apiClient
      .get(Endpoints.account, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => setUser(null));
  }, []);

  // 🔥 هنا تضيفيها
  const refreshUser = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const res = await apiClient.get(Endpoints.account, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (err) {
      console.error("Failed to refresh user", err);
      setUser(null);
    }
  };

  const updateUser = (updatedFields: any) => {
  setUser((prev: any) => {
    if (!prev) return prev;

    return {
      ...prev,
      ...updatedFields,
    };
  });
};

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);