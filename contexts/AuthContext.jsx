import { useContext, useState, createContext } from "react";
import { SERVER_URL } from "@env";
import axios from "axios";

const AuthContext = createContext({ isLoggedIn: false });

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      console.warn(`${SERVER_URL}/login`);

      const response = await axios.post(`${SERVER_URL}/login`, {
        email,
        password,
      });
      setToken(response.data.token);
      setIsLoggedIn(true);
      setError(null);
      return JSON.stringify(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("Error Message:", error.response.data.message);
        console.log("Status Code:", error.response.status);
        setError(error.response.data.message);
        return {
          message: error.response.data.message,
          status: error.response.status,
        };
      } else {
        console.log("Error:", error);
        setError("An unexpected error occurred");
      }
    }
    setIsLoading(false);
  };

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    try {
      console.warn(`${SERVER_URL}/register`);
      console.warn(email, password, fullName);
      const response = await axios.post(`${SERVER_URL}/register`, {
        email,
        password,
        name: fullName,
      });
      return JSON.stringify(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("Error Message:", error.response.data.message);
        console.log("Status Code:", error.response.status);
        setError(error.response.data.message);
        return {
          message: error.response.data.message,
          status: error.response.status,
        };
      } else {
        console.log("Error:", error);
        setError("An unexpected error occurred");
      }
    }
    setIsLoading(false);
  };

  const post = async () => {
    try {
    } catch {}
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

  const dispatchAPI = async (type, url, options) => {
    switch (type) {
      case "LOGIN":
        return await login(options.email, options.password);
      case "REGISTER":
        return await register(
          options.email,
          options.password,
          options.fullName
        );
      case "LOGOUT":
        return await logout();
      case "POST":
        return post(url, options);
      case "GET":
        return get(url, options);
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
        dispatchAPI,
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
