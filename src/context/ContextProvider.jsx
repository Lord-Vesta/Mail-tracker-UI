import React, { createContext, useEffect, useState } from "react";
import { getGmailAccounts } from "../utils/api.utils";

export const userContext = createContext();

const ContextProvider = ({ children }) => {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("dashboard");
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const res = await getGmailAccounts();
      const formatted = res.data.map((acc) => ({
        id: acc.userId, // Use actual ID or fallback to generated one
        email: acc.email,
        gmailAccountId: acc._id,
        connectedAt: new Date(acc.createdAt),
        isPrimary: acc.isPrimary,
      }));
      setAccounts(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <userContext.Provider
      value={{
        screen,
        setScreen,
        user,
        setUser,
        active,
        setActive,
        accounts,
        fetchAccounts,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default ContextProvider;
