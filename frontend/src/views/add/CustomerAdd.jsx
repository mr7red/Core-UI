import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import {
    CCard, CCardBody, CCardHeader,
    CFormInput, CButton
} from "@coreui/react"

export default function CustomerAdd() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        city: "",
        password: ""
    })

    const token = localStorage.getItem("token")
    const navigate = useNavigate()
const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        try {

            await axios.post(
                // "http://localhost:5000/api/create/list/user",
                `${BASE_URL}/api/create/list/user`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            alert("Customer Added")
            navigate("/Customer-list")

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <CCard>
            <CCardHeader>Add Customer</CCardHeader>
            <CCardBody>

                <CFormInput name="name" placeholder="Name" onChange={handleChange} className="mb-3" />
                <CFormInput name="email" placeholder="Email" onChange={handleChange} className="mb-3" />
                <CFormInput name="city" placeholder="City" onChange={handleChange} className="mb-3" />
                <CFormInput name="password" type="password" placeholder="Password" onChange={handleChange} className="mb-3" />

                <CButton color="primary" onClick={handleSubmit}>Add</CButton>
                <CButton color="secondary" onClick={() => navigate("/customer-list")} style={{ marginLeft: "10px" }}>
                    Cancel
                </CButton>

            </CCardBody>
        </CCard>
    )
}