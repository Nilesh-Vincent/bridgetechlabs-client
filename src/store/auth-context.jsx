import React, { useState, useEffect } from "react";
import axios from "axios";
import BaseURL from "../utils/BaseURL";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

const AuthContext = React.createContext({
  isLoggedIn: false,
  isLoading: false,
  error: null,
  onLogout: () => {},
  onLogin: (email, password) => {},
  onSignup: (name, email, password, passwordConfirm) => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInformation === "false") {
      setIsLoggedIn(false);
    }
    if (storedUserLoggedInInformation === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const logoutHandler = () => {
    setIsLoading(true);

    axiosInstance
      .post("/users/logout", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Logout successful!");
        localStorage.setItem("isLoggedIn", "false");
        localStorage.setItem("jwt", "errloggedout");
        setIsLoggedIn(false);
        setError(null);
        setIsLoading(false);
        toast.success("Logout successful!");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        setError(error);
        setIsLoading(false);
        toast.error("Logout unsuccessful!");
      });
  };

  const loginHandler = (email, password) => {
    setIsLoading(true);

    axios
      .post(
        `${BaseURL}/api/v1/users/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Enable sending cookies
        }
      )
      .then((response) => {
        console.log("Login successful!");
        console.log(response.data);
        console.log(response.data.token);

        if (response.data.status === "success") {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("jwt", response.data.token);
          setError(null);
          toast.success("Login successful!");
        } else {
          setIsLoggedIn(false);
          localStorage.setItem("isLoggedIn", "false");
          setError(new Error("Login failed"));
          toast.error("Login failed!");
        }

        setIsLoading(false);
        // Perform any additional actions after successful login
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setError(error);
        setIsLoading(false);
      });
  };

  const signupHandler = (name, email, password, passwordConfirm) => {
    setIsLoading(true);

    axios
      .post(
        `${BaseURL}/api/v1/users/signup`,
        {
          name: name,
          email: email,
          password: password,
          passwordConfirm: passwordConfirm,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);

        if (response.data.status === "success") {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("jwt", response.data.token);
          toast.success("Login successful!");
          setError(null);
        } else {
          setIsLoggedIn(false);
          localStorage.setItem("isLoggedIn", "false");
          setError(new Error("SignUp failed"));
          toast.error("SignUp failed!");
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("SignUp failed:", error);
        setError(error);
        setIsLoading(false);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        isLoading: isLoading,
        error: error,
        onLogout: logoutHandler,
        onLogin: loginHandler,
        onSignup: signupHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
