import { useContext, useState, createContext, useEffect } from "react";
import { SERVER_URL } from "@env";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({ isLoggedIn: false });

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [SERVER_URL_, setSERVER_URL] = useState(SERVER_URL);

  const login = async (email, password) => {
    console.log("login", SERVER_URL_);
    setIsLoading(true);
    try {
      const response = await axios.post(`${SERVER_URL_}/login`, {
        email,
        password,
      });
      await AsyncStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setIsLoggedIn(true);
      setError(null);
      const me = await axios.get(`${SERVER_URL_}/me`, {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
        },
      });
      setUser(me.data);
      console.log("me", me);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.warn("Error Message:", error.response.data.message);
        console.warn("Status Code:", error.response.status);
        setError(error.response.data.message);
        return {
          message: error.response.data.message,
          status: error.response.status,
        };
      } else {
        console.warn("Error:", error);
        setError("An unexpected error occurred");
      }
    }
    setIsLoading(false);
  };

  const register = async (email, password, fullName) => {
    try {
      console.warn(`${SERVER_URL_}/register`);
      console.warn(email, password, fullName);
      const response = await axios.post(`${SERVER_URL_}/register`, {
        email,
        password,
        name: fullName,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.warn("Error Message:", error.response.data.message);
        console.warn("Status Code:", error.response.status);
        setError(error.response.data.message);
        return {
          message: error.response.data.message,
          status: error.response.status,
        };
      } else {
        console.warn("Error:", error);
        setError("An unexpected error occurred");
      }
    }
  };

  const attemptLogin = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      // throw new Error("test");
      const response = await axios.get(`${SERVER_URL_}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setToken(token);
      setIsLoggedIn(true);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.warn("Error Message:", error.response);
        console.warn("Status Code:", error.response.status);
        setError(error.response.data.message);
        return {
          message: error.response.data.message,
          status: error.response.status,
        };
      } else {
        console.warn("Error:", error);
        setError("An unexpected error occurred");
      }
    }
  };

  const post = async (url, options) => {
    try {
      const response = await axios.post(`${SERVER_URL_}${url}`, options, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.warn("Error Message:", error.response.data.message);
        console.warn("Status Code:", error.response.status);
        setError(error.response.data.message);
        if (error.response.status === 401) {
          setIsLoggedIn(false);
        }
        return {
          message: error.response.data.message,
          status: error.response.status,
        };
      } else {
        console.warn("Error:", error);
        setError("An unexpected error occurred");
      }
    }
  };

  const get = async (url, options) => {
    try {
      const response = await axios.get(`${SERVER_URL_}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.warn("Error Message:", error.response.data.message);
        console.warn("Status Code:", error.response.status);
        setError(error.response.data.message);
        if (error.response.status === 401) {
          setIsLoggedIn(false);
        }
        return {
          message: error.response.data.message,
          status: error.response.status,
        };
      } else {
        console.warn("Error:", error);
        setError("An unexpected error occurred");
      }
    }
  };

  const put = async (url, options) => {
    try {
      const response = await axios.put(`${SERVER_URL_}${url}`, options, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.warn("Error Message:", error.response.data.message);
        console.warn("Status Code:", error.response.status);
        setError(error.response.data.message);
        if (error.response.status === 401) {
          setIsLoggedIn(false);
        }
        return {
          message: error.response.data.message,
          status: error.response.status,
        };
      } else {
        console.warn("Error:", error);
        setError("An unexpected error occurred");
      }
    }
  };

  const delete_ = async (url, options) => {
    try {
      const response = await axios.delete(`${SERVER_URL_}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.warn("Error Message:", error.response.data.message);
        console.warn("Status Code:", error.response.status);
        setError(error.response.data.message);
        if (error.response.status === 401) {
          setIsLoggedIn(false);
        }
        return {
          message: error.response.data.message,
          status: error.response.status,
        };
      } else {
        console.warn("Error:", error);
        setError("An unexpected error occurred");
      }
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setError(null);
      setIsLoggedIn(false);
      setToken(null);
      AsyncStorage.removeItem("token");
    } catch (error) {
      console.log(error.code, error.message);
      setError(error.message);
    }
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
        return get(url);
      case "PUT":
        return put(url, options);
      case "DELETE":
        return delete_(url);
      default:
        throw new Error("Invalid dispatchAPI type");
    }
  };

  useEffect(() => {
    setSERVER_URL(SERVER_URL);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        attemptLogin,
        isLoggedIn,
        isLoading,
        token,
        dispatchAPI,
        error,
        setError,
        SERVER_URL: SERVER_URL_,
        setSERVER_URL,
        resetServerUrl: () => setSERVER_URL(SERVER_URL),
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
