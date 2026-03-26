import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams, useLocation } from "react-router-dom"

import {
    CCard, CCardBody, CCardHeader,
    CFormInput, CButton, CRow, CCol, CFormLabel
} from "@coreui/react"

export default function UserEdit() {

    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()
    const user = JSON.parse(localStorage.getItem("user"))
    const loggedUserRole = user?.role?.name || user?.role
    const token = localStorage.getItem("token")

    const role = new URLSearchParams(location.search).get("role")

    const [form, setForm] = useState({
        name: "",
        email: "",
        role: role,
        department: "",
        managerId: "",
        employeeId: "",
        employeeRole: "",
        city: ""
    })

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {

            const res = await axios.get(
                `http://localhost:5000/api/create/get/${role}/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            const data = res.data

            setForm({
                name: data.name || "",
                email: data.email || "",
                role: role,
                department: data.department || "",
                managerId: data.managerId || "",
                employeeId: data.employeeId || "",
                employeeRole: data.employeeRole || "",
                city: data.city || ""
            })

        } catch (err) {
            console.log(err)
        }
    }


    const handleRoleChange = (newRole) => {
        setForm({
            name: form.name,
            email: form.email,
            role: newRole,
            department: "",
            managerId: "",
            employeeId: "",
            employeeRole: "",
            city: ""
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            let payload = {
                name: form.name,
                email: form.email
            }

            if (role === "manager") {
                payload.department = form.department
                payload.managerId = form.managerId
            }

            if (role === "employee") {
                payload.employeeId = form.employeeId
                payload.employeeRole = form.employeeRole
            }

            if (role === "user") {
                payload.city = form.city
            }

            await axios.put(
                `http://localhost:5000/api/create/edit/${role}/${id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            alert("User Updated ")
            navigate("/User-list")

        } catch (err) {
            console.log(err)
            alert("Update failed")
        }
    }

    const isAdmin =
        loggedUserRole === "admin" ||
        loggedUserRole === "superadmin"

    return (
        <CCard>
            <CCardHeader>
                <h4>Edit User</h4>
            </CCardHeader>

            <CCardBody>

                <form onSubmit={handleSubmit}>

                    <CRow>
                        <CCol md={6}>
                            <CFormInput
                                label="Name"
                                className="mb-3"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </CCol>

                        <CCol md={6}>
                            <CFormLabel>Role</CFormLabel>

                            {isAdmin ? (
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
                            ) : (
                                <input
                                    className="form-control mb-3"
                                    value={form.role}
                                    disabled
                                />
                            )}
                        </CCol>
                    </CRow>

                    <CFormInput
                        label="Email"
                        className="mb-3"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />

                    {form.role === "manager" && (
                        <CRow>
                            <CCol md={6}>
                                <CFormInput
                                    label="Department"
                                    className="mb-3"
                                    value={form.department}
                                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormInput
                                    label="Manager ID"
                                    className="mb-3"
                                    value={form.managerId}
                                    onChange={(e) => setForm({ ...form, managerId: e.target.value })}
                                />
                            </CCol>
                        </CRow>
                    )}

                    {form.role === "employee" && (
                        <CRow>
                            <CCol md={6}>
                                <CFormInput
                                    label="Employee ID"
                                    className="mb-3"
                                    value={form.employeeId}
                                    onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormInput
                                    label="Employee Role"
                                    className="mb-3"
                                    value={form.employeeRole}
                                    onChange={(e) => setForm({ ...form, employeeRole: e.target.value })}
                                />
                            </CCol>
                        </CRow>
                    )}

                    {/* User */}
                    {form.role === "user" && (
                        <CFormInput
                            label="City"
                            className="mb-3"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                    )}

                    <div style={{ display: "flex", gap: "10px" }}>
                        <CButton color="primary" type="submit">
                            Update User
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