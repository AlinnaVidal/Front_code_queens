import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children}){
    const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

    useEffect(() => {
        localStorage.setItem("token", token);
    }, [token])


  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);


    return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
        </AuthContext.Provider>
  );
}

export default AuthProvider;
