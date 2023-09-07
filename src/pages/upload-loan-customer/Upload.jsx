import React, { useContext, useEffect, useState } from "react";
import styles from "./Upload.module.css";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import AuthContext from "../../store/auth-context";
import { useNavigate } from "react-router-dom";

function Upload() {
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    duration: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!context.isLoggedIn) {
      navigate("/login");
    }
  }, [context.isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseFloat(value) : value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file: file,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = "Amount must be a valid positive number.";
      isValid = false;
    }

    if (
      !formData.duration.trim() ||
      isNaN(formData.duration) ||
      formData.duration <= 0
    ) {
      newErrors.duration = "Duration must be a valid positive number.";
      isValid = false;
    }

    if (!formData.file) {
      newErrors.file = "File is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      const formDataToUpload = new FormData();
      formDataToUpload.append("name", formData.name);
      formDataToUpload.append("amount", formData.amount);
      formDataToUpload.append("duration", formData.duration);
      formDataToUpload.append("file", formData.file);

      try {
        const response = await axiosInstance.post(
          "customers/upload",
          formDataToUpload
        );

        if (response.status === 200) {
          console.log("Response Data:", response.data);
          toast.success("Successfully Uploaded");
          window.location.href = "/";
        } else {
          console.error(
            "Error Response:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something Went Very Wrong ");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles["upload-form-container"]}>
      <h2>Upload Customer and Loan information </h2>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
          />
          {errors.amount && (
            <div className={styles["error-message"]}>{errors.amount}</div>
          )}
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="duration">Duration</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
          />
          {errors.duration && (
            <div className={styles["error-message"]}>{errors.duration}</div>
          )}
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="file">Upload File</label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".pdf, .csv, .txt"
            onChange={handleFileChange}
          />
          {errors.file && (
            <div className={styles["error-message"]}>{errors.file}</div>
          )}
        </div>
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default Upload;
