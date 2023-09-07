import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./SingleCustomer.module.css";
import { toast } from "react-hot-toast";
import AuthContext from "../../store/auth-context";
import ClipLoader from "react-spinners/ClipLoader";

const SingleCustomer = () => {
  const [customer, setCustomer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paidAmountUpdated, setPaidAmountUpdated] = useState(false);
  const { id } = useParams();

  //http://localhost:8022/api/v1/customers/${id}

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
        setIsLoading(true);
        toast.success("Success");

        const response = await axiosInstance.get(`/customers/${id}`);
        setCustomer(response.data.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, paidAmountUpdated]);

  const markAsPaidHandler = async (installmentNumber, installmentAmount) => {
    try {
      const response = await axiosInstance.put(
        `/customers/${id}/repayments/${installmentNumber}/pay`,
        {
          paidAmount: installmentAmount,
        }
      );
      console.log(response);

      toast.success("Successfully Updated The Payment Status");
      setPaidAmountUpdated(!paidAmountUpdated);
    } catch (error) {
      console.error("Error marking as paid:", error);
      toast.error("Successfully Updated The Payment Status");
    }
  };

  console.log(customer);

  return (
    <div>
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
      ) : customer ? (
        <div className={styles.customer}>
          <h2>Customer Details</h2>
          <p className={styles.customerDetail}>
            <b>Loan ID:</b> {customer._id}
          </p>
          <p className={styles.customerDetail}>
            <b>Name:</b> {customer.customerName}
          </p>
          <p className={styles.customerDetail}>
            <b>Loan Amount:</b> ${customer.loanAmount}.00
          </p>
          <p className={styles.customerDetail}>
            <b>Remaining Amount:</b> ${customer.remainingAmount}.00
          </p>
          <p className={styles.customerDetail}>
            <b>Loan Duration:</b> {customer.loanDuration} months
          </p>

          <h2>Repayment Schedule</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Installment Number</th>
                <th>Due Date</th>
                <th>Installment Amount</th>
                <th>Remaining Balance</th>
                <th>Paid</th>
                <th>Edit Paid Status</th>
              </tr>
            </thead>
            <tbody>
              {customer.repaymentSchedule.map((repayment) => (
                <tr key={repayment._id}>
                  <td>{repayment.installmentNumber}</td>
                  <td>{new Date(repayment.dueDate).toLocaleDateString()}</td>
                  <td>${repayment.installmentAmount}.00</td>
                  <td>${repayment.remainingBalance}.00</td>
                  <td>{repayment.isPaid ? "Paid" : "Not Paid"}</td>
                  {repayment.isPaid ? (
                    <p className={styles.repaymentScheduleStatus}>
                      Already Paid
                    </p>
                  ) : (
                    <button
                      onClick={() =>
                        markAsPaidHandler(
                          repayment.installmentNumber,
                          repayment.installmentAmount
                        )
                      }
                    >
                      Mark as paid
                    </button>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Customer & Loan Details Not Found</p>
      )}
    </div>
  );
};

export default SingleCustomer;
