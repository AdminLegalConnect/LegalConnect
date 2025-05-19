import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const userData = JSON.parse(atob(token.split(".")[1]));
    setUser({ ...userData, token }); // <- ici on ajoute le token à l'objet user
  }
}, []);


  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
