import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // if user is not empty, try to fetch info about user
    if (!user) {
      const { data } = axios.get("/profile").then(({ data }) => {
        // .then is alternative to await since useEffect doesn't support await
        setUser(data);
        setReady(true);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
