import { useContext, useState, createContext } from "react";

const AuthContext = createContext({ isLoggedIn: false });

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      setIsLoggedIn(true);
      setError(null);
    } catch (error) {
      console.log(error.code, error.message);
      setError(error.message);
    }
    setIsLoading(false);
  };

  const register = async (email, password, additionalData) => {
    setIsLoading(true);
    try {
      setIsLoggedIn(true);
      setError(null);
    } catch (error) {
      console.log(error.code, error.message);
      setError(error.message);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      setError(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error.code, error.message);
      setError(error.message);
    }
    setIsLoading(false);
  };

  const dispatchAPI = async (type, options) => {
    switch (type) {
      case "LOGIN":
        return await login(options.email, options.password);
      case "REGISTER":
        return await register(
          options.email,
          options.password,
          options.additionalData
        );
      case "LOGOUT":
        return await logout();
      default:
        throw new Error("Invalid dispatchAPI type");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        isLoading,
        setIsLoggedIn,
        dispatchAPI,
        logout,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Context must be used within a context provider");
  return context;
};
