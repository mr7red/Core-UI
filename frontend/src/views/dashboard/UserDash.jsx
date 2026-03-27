import { useEffect, useState } from "react"
import axios from "axios"
import { decryptData } from "../../decrypt/decrypt"

import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CFormInput
} from "@coreui/react"

import { useNavigate } from "react-router-dom"

import CIcon from '@coreui/icons-react'
import { cilUserPlus, cilNoteAdd } from '@coreui/icons'

export default function UserTable() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const loginRole = localStorage.getItem("role")

    const [users, setUsers] = useState([])
    const [search, setSearch] = useState("")
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {

        try {
            const superAdminRes = await axios.get(
                // "http://localhost:5000/api/create/list/superadmin",
                `${BASE_URL}/api/create/list/superadmin`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            const managerRes = await axios.get(
                // "http://localhost:5000/api/create/list/manager"
                `${BASE_URL}/api/create/list/manager`
                ,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            const employeeRes = await axios.get(
                // "http://localhost:5000/api/create/list/employee",
                `${BASE_URL}/api/create/list/employee`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            const superAdminData = decryptData(
                superAdminRes.data.encryptedData,
                superAdminRes.data.iv
            )

            const managerData = decryptData(
                managerRes.data.encryptedData,
                managerRes.data.iv
            )

            const employeeData = decryptData(
                employeeRes.data.encryptedData,
                employeeRes.data.iv
            )

            const superAdmins = superAdminData.map(item => ({
                _id: item._id,
                name: item.name,
                email: item.email,
                role: "superadmin"
            }))

            const managers = managerData.map(item => ({
                _id: item._id,
                name: item.name,
                email: item.email,
                role: "manager"
            }))

            const employees = employeeData.map(item => ({
                _id: item._id,
                name: item.name,
                email: item.email,
                role: "employee"
            }))

            setUsers([...superAdmins, ...managers, ...employees])

        } catch (err) {
            console.log(err)
        }

    }

    const handleDelete = async (id, role) => {

        if (!window.confirm("Delete user?")) return

        try {

            await axios.delete(
                // `http://localhost:5000/api/create/delete/${role}/${id}`,
                `${BASE_URL}/api/create/delete/${role}/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            alert("User Deleted")

            fetchUsers()

        } catch (err) {
            console.log(err)
        }

    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>

                <h4>Users</h4>

                <div style={{ display: "flex", gap: "10px" }}>

                    <CFormInput
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "300px" }}
                    />

                    {(loginRole === "admin" || loginRole === "superadmin") && (

                        <CButton
                            color="primary"
                            onClick={() => navigate("/User-Add")}>
                            <CIcon icon={cilUserPlus} className="me-1" />
                            Add User
                        </CButton>

                    )}

                </div>

            </div>

            <CTable hover responsive>

                <CTableHead className="text-nowrap">

                    <CTableRow >
                        <CTableHeaderCell className="bg-body-tertiary text-center">S.No</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Name</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Email</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Role</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">Action</CTableHeaderCell>
                    </CTableRow>

                </CTableHead>

                <CTableBody>

                    {filteredUsers.map((user, index) => (

                        <CTableRow key={user._id}>

                            <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                            <CTableDataCell>{user.name}</CTableDataCell>
                            <CTableDataCell>{user.email}</CTableDataCell>
                            <CTableDataCell>{user.role}</CTableDataCell>

                            <CTableDataCell className="text-center">

                                <CButton
                                    size="sm"
                                    color="primary"
                                    onClick={() => navigate(`/User-Edit/${user._id}?role=${user.role}`)}
                                    style={{ marginRight: "5px" }}
                                >
                                    {/* <CIcon icon={cilNoteAdd} size="sm"/> */}
                                    <i className="fa-regular fa-pen-to-square"></i>
                                </CButton>

                                <CButton
                                    size="sm"
                                    color="danger"
                                    onClick={() => handleDelete(user._id, user.role)}
                                >
                                    <i className="fa-regular fa-trash-can" style={{ color: "white" }}></i>
                                </CButton>

                            </CTableDataCell>

                        </CTableRow>

                    ))}

                </CTableBody>

            </CTable>

        </>
    )
}