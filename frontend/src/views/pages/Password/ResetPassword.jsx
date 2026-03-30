import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
  cilLockLocked
} from "@coreui/icons"

const ResetPassword = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 👉 Step Control
  const [otpVerified, setOtpVerified] = useState(false);

  // ================= OTP VERIFY =================
  const verifyOtp = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        email,
        otp,
      });

      alert("OTP Verified ✅");
      setOtpVerified(true);
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid OTP");
    }
  };

  // ================= RESET PASSWORD =================
  const resetPassword = async () => {
    try {
      if (password !== confirmPassword) {
        return alert("Passwords do not match");
      }

      await axios.post(`${BASE_URL}/api/auth/reset-password`, {
        email,
        password,
      });

      alert("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Error resetting password");
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center justify-content-center ">
      <CCard style={{ width: "450px", height: "fitContent", padding: "20px" }}>
        <CCardBody>

          <h2>Reset Password</h2>

          {!otpVerified && (
            <>
              <p className="text-body-secondary">
                Enter OTP
              </p>

              <CInputGroup className="mb-2">

                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>


                <CFormInput
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </CInputGroup>

              <CButton color="primary" className="mt-3 px-4" onClick={verifyOtp}>
                Verify OTP
              </CButton>
            </>
          )}

          {otpVerified && (
            <>
              <p className="text-body-secondary">
                Create New Password
              </p>

              <CInputGroup className="mb-3">

                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>

                <CFormInput
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              </CInputGroup>

              <CInputGroup className="mb-3">

                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>

                <CFormInput
                  type="password"
                  placeholder="Confirm Password"
                  className="mt-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </CInputGroup>


              <CButton color="primary" className="mt-3 px-4" onClick={resetPassword}>
                Reset Password
              </CButton>
            </>
           )} 

        </CCardBody>
      </CCard>
    </div>
  );
};

export default ResetPassword;