import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import {
    CCard,
    CCardBody,
    CCardHeader,
    CFormInput,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem
} from "@coreui/react"

export default function Category() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [categories, setCategories] = useState([])
    const [parentCategory, setParentCategory] = useState("")
    const token = localStorage.getItem("token")
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        const res = await axios.get(
            `${BASE_URL}/category/list`)
        setCategories(res.data)
    }

    const submit = async () => {

        if (!name) return alert("Enter category name")
        if (!parentCategory) return alert("Select category")

        const payload = {
            name,
            parentCategory: parentCategory === "MAIN" ? "" : parentCategory
        }

        try {
            await axios.post(
                // "http://localhost:5000/category/add",
                `${BASE_URL}/category/add`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

            alert("Category added successfully")
            setName("")
            setParentCategory("")
            fetchCategories()
            navigate("/Category")


        } catch (err) {
            return alert("No Permission")
            // console.log(err)
        }
    }

    const renderDropdown = (parent = "", level = 0) => {
        return categories
            .filter(cat => (cat.parentCategory || "") === parent)
            .flatMap(cat => ([
                <CDropdownItem
                    key={cat._id}
                    style={{
                        paddingLeft: `${20 + level * 20}px`,
                        borderLeft: `${"4px solid #5856d6" + level * 20}px`,
                    }}
                    onClick={() => setParentCategory(cat._id)}
                >
                    {cat.name}
                </CDropdownItem>,
                ...renderDropdown(cat._id, level + 1)
            ]))
    }

    return (
        <>
            {/* ADD */}
            <CCard className="mb-4" style={{ position: "sticky", top: "120px", zIndex: "9" }}>
                <CCardHeader>Add Category</CCardHeader>

                <CCardBody style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                    <CFormInput
                        placeholder="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <CDropdown>
                        <CDropdownToggle color="secondary">
                            {
                                parentCategory === "MAIN"
                                    ? "Main Category"
                                    : categories.find(c => c._id === parentCategory)?.name || "Select Category"
                            }
                        </CDropdownToggle>

                        <CDropdownMenu style={{ maxHeight: "300px", overflowY: "auto", width: "100%" }}>
                            <CDropdownItem onClick={() => setParentCategory("MAIN")}>
                                Main Category
                            </CDropdownItem>
                            {renderDropdown("")}
                        </CDropdownMenu>
                    </CDropdown>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <CButton color="primary" style={{ width: "180px" }} onClick={submit}>
                            Add Category
                        </CButton>
                        <CButton color="secondary" style={{ width: "180px" }} onClick={() => navigate("/Category")}>
                            Cancel
                        </CButton>
                    </div>

                </CCardBody>
            </CCard>
        </>
    )
}