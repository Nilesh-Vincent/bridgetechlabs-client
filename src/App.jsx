import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/ui/header/Header";
import Customers from "./pages/customers/Customers";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import SingleCustomer from "./pages/single-customer/SingleCustomer";
import { Toaster } from "react-hot-toast";
import Upload from "./pages/upload-loan-customer/Upload";

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <section style={{ width: "100%" }}>
          <Routes>
            <Route path="/" element={<Customers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/singlecustomer/:id" element={<SingleCustomer />} />
            <Route path="/upload/" element={<Upload />} />
          </Routes>
        </section>
      </Router>
      <Toaster />
    </>
  );
};

export default App;
