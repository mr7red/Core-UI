import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { GoogleLogin } from "@react-oauth/google"
import FacebookLogin from '@greatsumini/react-facebook-login'

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
import { cilLockLocked, cilUser } from "@coreui/icons"

const Login = () => {
const BASE_URL = import.meta.env.VITE_BACKEND_URL

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const login = async () => {

    try {

      const res = await axios.post(
        // "http://localhost:5000/api/auth/login",
        `${BASE_URL}/api/auth/login`,
        { email, password }
      )

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("name", res.data.name)
      localStorage.setItem("id", res.data.id)
      localStorage.setItem("email", res.data.email)

      alert("Login SuccessFully")

      navigate("/dashboard")

    } catch (err) {
      console.log("ERROR:", err.response?.data)
      alert(err.response?.data?.msg || "Login Failed")
    }

  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">

      <CContainer>

        <CRow className="justify-content-center">

          <CCol md={8}>

            <CCardGroup>

              <CCard className="p-4">

                <CCardBody>

                  <CForm>

                    <h1>Login</h1>

                    <p className="text-body-secondary">
                      Sign In to your account
                    </p>

                    <CInputGroup className="mb-3">

                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>

                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />

                    </CInputGroup>

                    <CInputGroup className="mb-4">

                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>

                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                      />

                    </CInputGroup>

                    <CRow>

                      <CCol xs={6}>

                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={login}
                        >
                          Login
                        </CButton>

                      </CCol>

                      <CCol xs={6} className="text-right">

                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>

                      </CCol>

                    </CRow>

                  </CForm>

                </CCardBody>

              </CCard>

              <CCard
                className="text-white bg-primary py-5"
                style={{ width: "44%" }}
              >

                <CCardBody className="text-center"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>

                  <div>

                    <h2>Sign up</h2>

                    <p>
                      Don't have an account? Register here
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <Link to="/register">

                        <CButton
                          color="primary"
                          // className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Register Now!
                        </CButton>

                      </Link>

                      <div style={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                        textAlign: "center",
                     height:"20px",
                     }}>


                        <p style={{
                          padding: "0px", margin: "0px"
                        }}>OR</p>

                      </div>

                      <GoogleLogin
                        onSuccess={async (res) => {
                          try {
                            const result = await axios.post(
                              "http://localhost:5000/api/auth/google",
                              { token: res.credential }
                            )

                            localStorage.setItem("token", result.data.token)
                            localStorage.setItem("role", result.data.role)
                            localStorage.setItem("name", result.data.name)
                            localStorage.setItem("id", result.data.id)
                            localStorage.setItem("email", result.data.email)
                            localStorage.setItem("profile", result.data.profile)

                            if (!result.data.hasPassword) {
                              navigate("/set-password")
                            } else {
                              navigate("/dashboard")
                            }

                          } catch (err) {
                            console.log(err)
                          }
                        }}
                        onError={() => console.log("Google Login Failed")}
                      />


                      {/* <FacebookLogin
                        appId="1646780423021157"
                        scope="public_profile,email"
                        onSuccess={async (response) => {
                          try {
                            const res = await axios.post(
                              "http://localhost:5000/api/auth/facebook",
                              { accessToken: response.accessToken }
                            )

                            localStorage.setItem("token", res.data.token)
                            localStorage.setItem("name", res.data.name)
                            localStorage.setItem("email", res.data.email)
                            localStorage.setItem("role", res.data.role)
                            localStorage.setItem("profile", res.data.profile)

                            navigate("/dashboard")

                          } catch (err) {
                            console.log(err)
                          }
                        }}
                        onFail={(err) => console.log(err)}
                      /> */}

                      <CButton
                        color="dark"
                        onClick={() => {
                          window.location.href = "http://localhost:5000/api/auth/github";
                        }}
                      >
                        Sign in with GitHub
                      </CButton>

                    </div>

                  </div>

                </CCardBody>

              </CCard>

            </CCardGroup>

          </CCol>

        </CRow>

      </CContainer>

    </div>
  )
}

export default Login