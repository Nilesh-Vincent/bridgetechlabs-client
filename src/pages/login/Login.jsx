import React, { useContext, useState, useEffect } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const context = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (context.isLoggedIn) {
      navigate("/");
    }
  }, [context.isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setErrors({});

    let isValid = true;
    if (!formData.email || !validateEmail(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
      isValid = false;
    }

    if (!formData.password || formData.password.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters long.",
      }));
      isValid = false;
    }

    if (isValid) {
      context.onLogin(formData.email, formData.password);
    }

    setFormData({
      ...formData,
      password: "",
      email: "",
    });
  };

  console.log(context);

  return (
    <div className={styles["login-container"]}>
      <h2>Log In</h2>
      {context.error && (
        <div className={styles["error-message-backend"]}>
          {context.error.response.data.message}
        </div>
      )}
      <form onSubmit={handleLogin}>
        <div className={styles["form-group"]}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <div className={styles["error-message"]}>{errors.email}</div>
          )}
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <div className={styles["error-message"]}>{errors.password}</div>
          )}
        </div>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={context.isLoading}
        >
          {context.isLoading ? "Loading..." : "Log In"}
        </button>
      </form>
      <p className={styles["signup-link"]}>
        Don't have an account? <Link to="/signup">Sign up here</Link>.
      </p>
    </div>
  );
}

export default Login;
