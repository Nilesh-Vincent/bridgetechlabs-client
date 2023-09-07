import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import BaseURL from "../../utils/BaseURL";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Customers.module.css";
import AuthContext from "../../store/auth-context";
import ClipLoader from "react-spinners/ClipLoader";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!context.isLoggedIn) {
      navigate("/login");
    }
  }, [context.isLoggedIn, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "/customers";
        const queryParams = {
          fields:
            "customerName,loanAmount,remainingAmount,loanDuration,bankFile",
        };

        const response = await axiosInstance.get(url, { params: queryParams });
        setCustomers(response.data.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.customers}>
      <div className={styles.headings}>
        <h1>Customers</h1>

        <button>
          <Link to="/upload"> Add New Loan & Customer</Link>
        </button>
      </div>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <ClipLoader
            color="black"
            loading={isLoading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          {customers.length === 0 ? (
            <h2 style={{ marginTop: "100px" }}>
              No customers found. <Link to="/upload">Add a new customer</Link>
            </h2>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Customer Name</th>
                    <th>Loan Amount</th>
                    <th>Remaining Amount</th>
                    <th>Loan Duration</th>
                    <th>Actions</th>
                    <th>More Details</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id} className={styles.tableRow}>
                      <td>{customer._id}</td>
                      <td>{customer.customerName}</td>
                      <td>${customer.loanAmount}.00</td>
                      <td>${customer.remainingAmount}.00</td>
                      <td>{customer.loanDuration}</td>
                      <td>
                        <Link
                          to={`${BaseURL}/bankfiles/${customer.bankFile}`}
                          target="_blank"
                          className={styles.viewBankLink}
                        >
                          View Bank File
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`singlecustomer/${customer._id}`}
                          className={styles.viewBankLink}
                        >
                          View More
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Customer;
