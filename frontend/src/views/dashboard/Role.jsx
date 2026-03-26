import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import {
    CCard, CCardBody, CCardHeader,
    CTable, CTableHead, CTableRow, CTableHeaderCell,
    CTableBody, CTableDataCell, CButton
} from "@coreui/react"

export default function RoleList() {

    const [roles, setRoles] = useState([])
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        try {
            const res = await axios.get("http://localhost:5000/role/roles", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setRoles(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete role?")) return

        try {
            await axios.delete(`http://localhost:5000/role/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setRoles(roles.filter(r => r._id !== id))
        } catch (err) {
            console.log(err)
        }
    }

    const isLimitReached = roles.length >= 5

    const badge = (label, value) => (
        <span
            style={{
                padding: "2px 10px",
                borderRadius: "8px",
                fontSize: "12px",
                marginRight: "12px",
                marginBottom: "4px",
                display: "inline-block",
                backgroundColor: value ? "#5856d651" : "#e126393d",
                color: "white",
                fontWeight: "500"
            }}
        >
            {label}
            {value ? (
                <i className="fa-solid fa-check" style={{ color: "white", marginLeft: "5px" }}></i>
            ) : (
                <i className="fa-solid fa-xmark" style={{ color: "white", marginLeft: "5px" }}></i>
            )}
        </span>
    )

    return (
        <CCard>

            <CCardHeader style={{ display: "flex", justifyContent: "space-between" }}>
                <h4>Roles</h4>

                <CButton
                    color="primary"
                    disabled={isLimitReached}
                    onClick={() => navigate("/Role-Add")}
                >
                    + Add Role
                </CButton>
            </CCardHeader>

            <CCardBody>

                <CTable bordered responsive className="text-center align-middle">

                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell className="bg-body-tertiary">S.No</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Role</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Permissions</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>

                    <CTableBody>

                        {roles.map((r, index) => (
                            <CTableRow key={r._id}>

                                <CTableDataCell>{index + 1}</CTableDataCell>

                                <CTableDataCell>{r.name}</CTableDataCell>

                                <CTableDataCell className="text-start">

                                    {/* USER */}
                                    <div style={{ marginBottom: "10px" }}>
                                        <b>User : </b>
                                        {badge("Add", r.permissions.user_add)}
                                        {badge("Edit", r.permissions.user_edit)}
                                        {badge("Delete", r.permissions.user_delete)}
                                        {badge("View", r.permissions.user_view)}
                                    </div>

                                    {/* CATEGORY */}
                                    <div style={{ marginBottom: "10px" }}>
                                        <b>Category : </b>
                                        {badge("Add", r.permissions.category_add)}
                                        {badge("Edit", r.permissions.category_edit)}
                                        {badge("Delete", r.permissions.category_delete)}
                                        {badge("View", r.permissions.category_view)}
                                    </div>

                                    {/* CUSTOMER */}
                                    <div style={{ marginBottom: "10px" }}>
                                        <b>Customer : </b>
                                        {badge("Add", r.permissions.customer_add)}
                                        {badge("Edit", r.permissions.customer_edit)}
                                        {badge("Delete", r.permissions.customer_delete)}
                                        {badge("View", r.permissions.customer_view)}
                                    </div>

                                    {/* PRODUCT */}
                                    <div>
                                        <b>Product : </b>
                                        {badge("Add", r.permissions.product_add)}
                                        {badge("Edit", r.permissions.product_edit)}
                                        {badge("Delete", r.permissions.product_delete)}
                                        {badge("View", r.permissions.product_view)}
                                    </div>

                                </CTableDataCell>

                                <CTableDataCell>

                                    <CButton
                                        size="sm"
                                        color="primary"
                                        onClick={() => navigate(`/Role-Edit/${r._id}`)}
                                    >
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </CButton>

                                    <CButton
                                        size="sm"
                                        color="danger"
                                        style={{ marginLeft: "5px" }}
                                        onClick={() => handleDelete(r._id)}
                                    >
                                        <i className="fa-regular fa-trash-can" style={{ color: "white" }}></i>
                                    </CButton>

                                </CTableDataCell>

                            </CTableRow>
                        ))}

                    </CTableBody>

                </CTable>

            </CCardBody>

        </CCard>
    )
}