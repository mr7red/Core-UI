import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
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
  cilLockLocked,
} from "@coreui/icons"


const SetPassword = () => {
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const role = localStorage.getItem("role")
  const BASE_URL = import.meta.env.VITE_BACKEND_URL

  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/set-password`, {
        email: localStorage.getItem("email"),
        password
      })

      alert("Password set successfully")
      if (role === "admin") {
        navigate("/admin-dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      alert("Error setting password")
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center justify-content-center ">
      <CCard style={{ width: "450px", padding: "20px" }}>
        <CCardBody>
          <h2>Set Password</h2>
          <p className="text-body-secondary">
            Enter your registered email
          </p>

          <CInputGroup className="mb-2">

            <CInputGroupText>
              <CIcon icon={cilLockLocked} />
            </CInputGroupText>

            <CFormInput
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
            />

          </CInputGroup>

          <CButton color="primary" className="mt-3 px-4"
           onClick={handleSubmit}>
            Submit
            </CButton>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default SetPassword