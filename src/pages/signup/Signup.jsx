import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import styles from "./Signup.module.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

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

  const handleSignup = (e) => {
    e.preventDefault();

    setErrors({});

    let isValid = true;
    if (!formData.name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Please enter your name.",
      }));
      isValid = false;
    }

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

    if (formData.password !== formData.passwordConfirm) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordConfirm: "Passwords do not match.",
      }));
      isValid = false;
    }

    if (isValid) {
      console.log("Signup Data:", formData);
      const { name, email, password, passwordConfirm } = formData;
      context.onSignup(name, email, password, passwordConfirm);
    }

    setFormData({
      ...formData,
      password: "",
      passwordConfirm: "",
    });
  };

  console.log(context);

  return (
    <div className={styles["signup-container"]}>
      <h2>Sign Up</h2>
      {context.error && (
        <div className={styles["error-message-backend"]}>
          {context.error.response.data.message}
        </div>
      )}
      <form onSubmit={handleSignup}>
        <div className={styles["form-group"]}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && (
            <div className={styles["error-message"]}>{errors.name}</div>
          )}
        </div>
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
        <div className={styles["form-group"]}>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleInputChange}
          />
          {errors.passwordConfirm && (
            <div className={styles["error-message"]}>
              {errors.passwordConfirm}
            </div>
          )}
        </div>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={context.isLoading}
        >
          {context.isLoading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <p className={styles["login-link"]}>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}

export default Signup;
