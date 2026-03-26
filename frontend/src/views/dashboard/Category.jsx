import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import {
    CCard, CCardBody, CCardHeader,
    CButton,
    CTable, CTableHead, CTableRow, CTableHeaderCell,
    CTableBody, CTableDataCell
} from "@coreui/react"

export default function Category() {

    const navigate = useNavigate()

    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        const res = await axios.get("http://localhost:5000/category/list")
        setCategories(res.data)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete?")) return
        await axios.delete(`http://localhost:5000/category/delete/${id}`)
        fetchCategories()
    }

    const renderRows = (parentId) => {
        return categories
            .filter(child => (child.parentCategory || "") === parentId)
            .map(child => {

                const subCategories = categories.filter(
                    sub => sub.parentCategory === child._id
                )

                return (
                    <React.Fragment key={child._id}>

                        <CTableRow>
                            <CTableDataCell colSpan={2}
                                style={{ display: "flex",
                                justifyContent: "space-between",
                                }}>
                                {child.name}

                                <span style={{display:"flex",gap:"10px"}}>
                                    <CButton
                                        size="sm"
                                        color="primary"
                                        onClick={() => navigate(`/Category-Edit/${child._id}`)}
                                    >
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </CButton>

                                    <CButton
                                        size="sm"
                                        color="danger"
                                        onClick={() => handleDelete(child._id)}
                                    >
                                        <i className="fa-regular fa-trash-can" style={{ color: "white" }}></i>
                                    </CButton>
                                </span>
                            </CTableDataCell>
                        </CTableRow>

                        {subCategories.map(sub => (
                            <CTableRow key={sub._id}>
                                <CTableDataCell colSpan={2}
                                    style={{
                                        paddingLeft: "40px",
                                        paddingRight: "40px",
                                        display: "flex",
                                        borderLeft:"4px solid #5856d6",
                                        borderRight:"4px solid #5856d6",
                                        justifyContent: "space-between"
                                    }}>
                                    {sub.name}

                                    <span style={{display:"flex",gap:"10px"}}>
                                        <CButton
                                            size="sm"
                                            color="primary"
                                            onClick={() => navigate(`/Category-Edit/${sub._id}`)}
                                        >
                                            <i className="fa-regular fa-pen-to-square"></i>
                                        </CButton>

                                        <CButton
                                            size="sm"
                                            color="danger"
                                            onClick={() => handleDelete(sub._id)}
                                        >
                                            <i className="fa-regular fa-trash-can" style={{ color: "white" }}></i>
                                        </CButton>
                                    </span>
                                </CTableDataCell>
                            </CTableRow>
                        ))}

                    </React.Fragment>
                )
            })
    }

    return (
        <>
            <div style={{display:"flex",justifyContent:"space-between", marginBottom: "15px" }}>
                <h4>Category</h4>
                <CButton color="primary" onClick={() => navigate("/Category-Add")}>
                    Add Category
                </CButton>
            </div>

            <CCard>
                <CCardHeader>Category List</CCardHeader>
                <CCardBody>

                    {categories
                        .filter(cat => !cat.parentCategory)
                        .map((parent, index) => (

                            <div key={parent._id} style={{ marginBottom: "20px" }}>

                                <CTable bordered>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell className="bg-body-tertiary text-center"
                                                style={{ display: "flex", justifyContent: "space-between" }}
                                            >
                                                {index + 1}. {parent.name}

                                                <span style={{display:"flex",gap:"10px"}}>
                                                    <CButton
                                                        size="sm"
                                                        color="primary"
                                                        onClick={() => navigate(`/Category-Edit/${parent._id}`)}
                                                    >
                                                        <i className="fa-regular fa-pen-to-square"></i>
                                                    </CButton>

                                                    <CButton
                                                        size="sm"
                                                        color="danger"
                                                        onClick={() => handleDelete(parent._id)}
                                                    >
                                                        <i className="fa-regular fa-trash-can" style={{ color: "white" }}></i>
                                                    </CButton>
                                                </span>
                                            </CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>

                                    <CTableBody>
                                        {renderRows(parent._id)}
                                    </CTableBody>
                                </CTable>

                            </div>
                        ))}

                </CCardBody>
            </CCard>
        </>
    )
}