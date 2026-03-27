import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import {
    CCard, CCardBody, CCardHeader,
    CFormInput, CButton, CRow, CCol, CFormLabel
} from "@coreui/react"

export default function UserAdd() {

    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const emptyForm = {
        name: "",
        email: "",
        password: "",
        role: "employee",
        department: "",
        managerId: "",
        employeeId: "",
        employeeRole: "",
        city: ""
    }

    const [form, setForm] = useState(emptyForm)

    // 🔄 Role change reset
    const handleRoleChange = (role) => {
        setForm({
            ...emptyForm,
            role
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.name || !form.email || !form.password) {
            alert("Fill required fields")
            return
        }

        try {

            let payload = {
                name: form.name,
                email: form.email,
                password: form.password
            }

            // 🎯 Role based payload
            if (form.role === "manager") {
                payload.department = form.department
                payload.managerId = form.managerId
            }

            if (form.role === "employee") {
                payload.employeeId = form.employeeId
                payload.employeeRole = form.employeeRole
            }

            if (form.role === "user") {
                payload.city = form.city
            }

            await axios.post(
                `${BASE_URL}/api/create/list/${form.role}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            alert("User Created Successfully")
            navigate("/User-list")

        } catch (err) {
            console.log(err)
            alert(err.response?.data?.message || "Error creating user")
        }
    }

    return (
        <CCard>
            <CCardHeader>
                <h4>Add User</h4>
            </CCardHeader>

            <CCardBody>

                <form onSubmit={handleSubmit}>

                    <CRow>
                        <CCol md={6}><CFormInput
                            label="Name"
                            className="mb-3"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        /></CCol>
                        <CCol md={6}>
                            {/* Role */}
                            <CFormLabel>Role</CFormLabel>
                            <select
                                className="form-control mb-3"
                                value={form.role}
                                onChange={(e) => handleRoleChange(e.target.value)}
                            >
                                <option value="superadmin">Super Admin</option>
                                <option value="manager">Manager</option>
                                <option value="employee">Employee</option>
                                <option value="user">User</option>
                            </select>
                        </CCol>
                    </CRow>

                    {/* Email */}
                    <CFormInput
                        label="Email"
                        className="mb-3"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />



                    {/* Manager Fields */}
                    {form.role === "manager" && (
                        <CRow>
                            <CCol md={6}>
                                <CFormInput
                                    label="Department"
                                    placeholder="Department"
                                    className="mb-3"
                                    value={form.department}
                                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormInput
                                    label="Manager ID"
                                    placeholder="Manager ID"
                                    className="mb-3"
                                    value={form.managerId}
                                    onChange={(e) => setForm({ ...form, managerId: e.target.value })}
                                />
                            </CCol>
                        </CRow>
                    )}

                    {/* Employee Fields */}
                    {form.role === "employee" && (
                        <CRow>
                            <CCol md={6}>
                                <CFormInput
                                    label="Employee ID"
                                    placeholder="Employee ID"
                                    className="mb-3"
                                    value={form.employeeId}
                                    onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormInput
                                    label="Employee Role"
                                    placeholder="Employee Role"
                                    className="mb-3"
                                    value={form.employeeRole}
                                    onChange={(e) => setForm({ ...form, employeeRole: e.target.value })}
                                />
                            </CCol>
                        </CRow>
                    )}

                    {/* User Fields */}
                    {form.role === "user" && (

                        <CFormInput
                            label="City"
                            placeholder="City"
                            className="mb-3"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                    )}

                    {/* Password */}
                    <CFormInput
                        type="password"
                        label="Password"
                        className="mb-3"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: "10px" }}>

                        <CButton color="primary" type="submit">
                            Create User
                        </CButton>

                        <CButton color="secondary" onClick={() => navigate("/User-list")}>
                            Cancel
                        </CButton>

                    </div>

                </form>

            </CCardBody>
        </CCard>
    )
}