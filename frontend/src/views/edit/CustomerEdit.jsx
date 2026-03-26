import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import {
    CCard, CCardBody, CCardHeader,
    CFormInput, CButton, CFormLabel
} from "@coreui/react"

import { decryptData } from "../../decrypt/decrypt"
export default function CustomerEdit() {

    const { id } = useParams()
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const [form, setForm] = useState({
        name: "",
        email: "",
        city: ""
    })

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {

            const res = await axios.get(
                "http://localhost:5000/api/create/user",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            const decrypted = decryptData(res.data.encryptedData, res.data.iv)

            const users = decrypted.data

            const user = users.find(item => item._id === id)

            if (!user) {
                alert("User not found")
                return
            }

            setForm({
                name: user.name || "",
                email: user.email || "",
                city: user.city || ""
            })

        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        try {

            await axios.put(
                `http://localhost:5000/api/create/update/user/${id}`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            alert("Customer Updated")
            navigate("/customer-list")

        } catch (err) {
            console.log(err)
        }
    }
    return (
        <CCard>
            <CCardHeader>Edit Customer</CCardHeader>

            <CCardBody>

                {/* Name */}
                <CFormLabel>Name</CFormLabel>
                <CFormInput
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mb-3"
                />

                {/* Email */}
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mb-3"
                />

                {/* City */}
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