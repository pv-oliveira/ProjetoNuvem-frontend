import { createContext, SetStateAction, useState } from "react";

// Criação de Context para armazenamento de usuario, para que possa ser acessado de toda a aplicação
export const UserContext = createContext();

// Provedor pelo qual acesso é possivel
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // armazena token no local storage
  const setToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  // pega token do local storage
  const getToken = () => {
    const data = localStorage.getItem("authToken");
    return data;
  };

  const value = { currentUser, setCurrentUser, setToken, getToken };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
