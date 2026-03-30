import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CCard,
  CCardBody
} from "@coreui/react";

import CIcon from "@coreui/icons-react"
import {
  cilUser,
} from "@coreui/icons"


const ForgotPassword = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      alert("OTP sent to your email");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Error sending OTP");
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center justify-content-center ">
      <CCard style={{ width: "450px", padding: "20px" }}>
        <CCardBody>
          <h2>Forgot Password</h2>
          <p className="text-body-secondary">
            Enter your registered email
          </p>

          <CInputGroup className="mb-2">

            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>

            <CFormInput
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </CInputGroup>

          <CButton color="primary" className="mt-3 px-4" onClick={sendOtp}>
            Send OTP
          </CButton>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ForgotPassword;