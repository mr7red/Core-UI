import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CButton,
  CFormLabel
} from "@coreui/react"

export default function CustomerEdit() {

  const { id } = useParams()
  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  const BASE_URL = import.meta.env.VITE_BACKEND_URL

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    role: "user"
  })

  useEffect(() => {
    fetchUser()
  }, [id])

  // ✅ FETCH SINGLE USER
  const fetchUser = async () => {
    try {

      const res = await axios.get(
        `${BASE_URL}/api/create/edit/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const user = res.data

      setForm({
        name: user.name || "",
        email: user.email || "",
        city: user.city || "",
      })

    } catch (err) {
      console.log(err)
      alert("User fetch failed")
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ✅ UPDATE USER
  const handleSubmit = async () => {
    try {

      await axios.put(
        `${BASE_URL}/api/create/edit/user/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert("Customer Updated Successfully")
      navigate("/customer-list")

    } catch (err) {
      console.log(err)
      alert("Update failed")
    }
  }

  return (
    <CCard>
      <CCardHeader>Edit Customer</CCardHeader>

      <CCardBody>

        <CFormLabel>Name</CFormLabel>
        <CFormInput
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mb-3"
        />

        <CFormLabel>Email</CFormLabel>
        <CFormInput
          name="email"
          value={form.email}
          onChange={handleChange}
          className="mb-3"
        />

        <CFormLabel>City</CFormLabel>
        <CFormInput
          name="city"
          value={form.city}
          onChange={handleChange}
          className="mb-3"
        />

        <CButton color="primary" onClick={handleSubmit}>
          Update
        </CButton>

        <CButton
          color="secondary"
          onClick={() => navigate("/customer-list")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </CButton>

      </CCardBody>
    </CCard>
  )
}