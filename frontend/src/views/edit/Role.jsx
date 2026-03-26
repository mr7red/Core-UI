import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import {
    CTable, CTableHead, CTableRow, CTableHeaderCell,
    CTableBody, CTableDataCell, CButton
} from "@coreui/react"

export default function RoleEdit() {

    const { id } = useParams()
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const [form, setForm] = useState({
        name: "",
        permissions: {}
    })

    useEffect(() => {
        fetchRole()
    }, [])

    const fetchRole = async () => {
        try {
            const res = await axios.get("http://localhost:5000/role/roles", {
                headers: { Authorization: `Bearer ${token}` }
            })

            const role = res.data.find(r => r._id === id)
            if (role) setForm(role)

        } catch (err) {
            console.log(err)
        }
    }

    const handlePermission = (e) => {
        setForm({
            ...form,
            permissions: {
                ...form.permissions,
                [e.target.name]: e.target.checked
            }
        })
    }

    const handleSubmit = async () => {
        try {
            await axios.put(
                `http://localhost:5000/role/update/${id}`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            alert("Updated Successfully")
            navigate("/Role-list")

        } catch (err) {
            console.log(err)
        }
    }

    const renderRow = (title, prefix, index) => (
        <CTableRow>
            <CTableDataCell className="text-center"><b>{index + 1}</b></CTableDataCell>

            <CTableDataCell><b>{title}</b></CTableDataCell>

            {["add", "edit", "delete", "view"].map(action => (
                <CTableDataCell className="text-center" key={action}>
                    <input
                        type="checkbox"
                        name={`${prefix}_${action}`}
                        checked={form.permissions?.[`${prefix}_${action}`] || false}
                        onChange={handlePermission}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                </CTableDataCell>
            ))}
        </CTableRow>
    )

    return (
        <>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <h4>Edit Role - {form.name}</h4>
            </div>

            {/* Table */}
            <CTable hover responsive bordered>

                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary text-center">S.no</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">Role</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">Add</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">Edit</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">Delete</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">View</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>

                <CTableBody className="align-middle">

                    {renderRow("User", "user", 0)}
                    {renderRow("Category", "category", 1)}
                    {renderRow("Customer", "customer", 2)}
                    {renderRow("Product", "product", 3)}

                </CTableBody>

            </CTable>

            <div style={{display:"flex",gap:"10px"}}>
                <CButton color="primary"
                    onClick={handleSubmit}>
                    Update
                </CButton>

                <CButton color="secondary"
                    onClick={() => navigate("/Role-list")}>
                    Cancel
                </CButton>
            </div>

        </>
    )
}