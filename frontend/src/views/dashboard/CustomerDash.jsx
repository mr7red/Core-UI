import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { decryptData } from "../../decrypt/decrypt"

import {
    CTable, CTableHead, CTableRow, CTableHeaderCell,
    CTableBody, CTableDataCell, CAvatar, CButton, CFormInput
} from "@coreui/react"

import CIcon from '@coreui/icons-react'
import { cilPeople } from '@coreui/icons'

export default function CustomerTable() {
    const [search, setSearch] = useState("")
    const [data, setData] = useState([])
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/create/user", {
                headers: { Authorization: `Bearer ${token}` }
            })

            const decrypted = decryptData(res.data.encryptedData, res.data.iv)
            setData(decrypted.data)

        } catch (err) {
            console.log(err)
        }
    }

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure delete?")) return

        try {

            await axios.delete(
                `http://localhost:5000/api/create/delete/user/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            alert("Customer Deleted")
            setData(data.filter(item => item._id !== id))

        } catch (err) {
            console.log(err)
        }
    }

    const formatDate = (date) => {
        const d = new Date(date)
        return `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`
    }

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px"
                }}
            >
                <h4>Customers</h4>

                <div style={{ display: "flex", gap: "10px" }}>

                    <CFormInput
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "300px" }}
                    />

                    <CButton color="primary" onClick={() => navigate("/Customer-Add")}>
                        + Add Customer
                    </CButton>

                </div>
            </div>

            <CTable hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary text-center">S.no</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center"><CIcon icon={cilPeople} /></CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">City</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>

                <CTableBody className="align-middle">
                    {data
                        .filter((item) =>
                            item.name.toLowerCase().includes(search.toLowerCase()) ||
                            item.city.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((item, index) => (
                            <CTableRow key={item._id}>
                                <CTableDataCell className="text-center">{index + 1}</CTableDataCell>

                                <CTableDataCell className="text-center">
                                    <CAvatar style={{ width: "40px", height: "40px" }}
                                        src={
                                            item.profile
                                                ? item.profile.startsWith("http")
                                                    ? item.profile
                                                    : `http://localhost:5000/uploads/${item.profile}`
                                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                        }
                                    />
                                </CTableDataCell>

                                <CTableDataCell>
                                    <div>{item.name}</div>
                                    <small>Joined: {formatDate(item.createdAt)}</small>
                                </CTableDataCell>

                                <CTableDataCell>{item.city}</CTableDataCell>

                                <CTableDataCell className="text-center">
                                    <CButton
                                        size="sm"
                                        color="primary"
                                        onClick={() => navigate(`/customer-edit/${item._id}`)}
                                    >
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </CButton>

                                    <CButton
                                        size="sm"
                                        color="danger"
                                        onClick={() => handleDelete(item._id)}
                                        style={{ marginLeft: "5px" }}
                                    >
                                        <i class="fa-regular fa-trash-can" style={{ color: "white" }}></i>
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                </CTableBody>
            </CTable>
        </>
    )
}