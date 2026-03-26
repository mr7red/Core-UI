import React, { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react"

import CIcon from "@coreui/icons-react"
import { cilLocationPin, cilLockLocked, cilUser } from "@coreui/icons"

const Register = () => {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    password: "",
    confirmPassword: ""
  })

  const register = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      )

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("name", res.data.name)
      localStorage.setItem("id", res.data.id)

      if (res.data.role === "admin") {
        navigate("/dashboard")
      } else {
        navigate("/dashboard")
      }
      alert("Registered Successfully")
    } catch (err) {

      alert(err.response?.data?.msg || "Register Failed")

    }

  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">

      <CContainer>

        <CRow className="justify-content-center">

          <CCol md={8}>

            <CCardGroup>

              {/* LEFT LOGIN CARD */}

              <CCard
                className="text-white bg-primary py-5"
                style={{ width: "44%" }}
              >

                <CCardBody className="text-center" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>

                  <div>

                    <h2>Login</h2>

                    <p>
                      Already have an account? Login here
                    </p>

                    <Link to="/login">

                      <CButton
                        color="primary"
                        className="mt-3"
                        active
                        tabIndex={-1}
                      >
                        Go to Login
                      </CButton>

                    </Link>

                  </div>

                </CCardBody>

              </CCard>


              {/* RIGHT REGISTER FORM */}

              <CCard className="p-4">

                <CCardBody>

                  <CForm>

                    <h1>Register</h1>

                    <p className="text-body-secondary">
                      Create your account
                    </p>

                    <CInputGroup className="mb-3">

                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>

                      <CFormInput
                        placeholder="Name"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />

                    </CInputGroup>

                    <CInputGroup className="mb-3">

                      <CInputGroupText>@</CInputGroupText>

                      <CFormInput
                        placeholder="Email"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />

                    </CInputGroup>

                    <CInputGroup className="mb-3">

                      <CInputGroupText>
                        <CIcon icon={cilLocationPin} />
                      </CInputGroupText>

                      <CFormInput
                        placeholder="City"
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />

                    </CInputGroup>

                    <CInputGroup className="mb-3">

                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>

                      <CFormInput
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                      />

                    </CInputGroup>

                    <CInputGroup className="mb-4">

                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>

                      <CFormInput
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      />

                    </CInputGroup>

                    <CRow>

                      <CCol xs={6}>

                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={register}
                        >
                          Register
                        </CButton>

                      </CCol>

                    </CRow>

                  </CForm>

                </CCardBody>

              </CCard>

            </CCardGroup>

          </CCol>

        </CRow>

      </CContainer>

    </div>
  )
}

export default Register