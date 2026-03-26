import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import {
    CCard,
    CCardBody,
    CCardHeader,
    CFormInput,
    CButton,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem
} from "@coreui/react"

export default function CategoryEdit() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [categories, setCategories] = useState([])
    const [parentCategory, setParentCategory] = useState("")

    useEffect(() => {
        fetchCategories()
        fetchSingleCategory()
    }, [])

    // 🔥 All categories (dropdown ku)
    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:5000/category/list")
            setCategories(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    // 🔥 Current category data (edit fill)
    const fetchSingleCategory = async () => {
        try {
            const res = await axios.get("http://localhost:5000/category/list")

            const current = res.data.find(c => c._id === id)

            if (current) {
                setName(current.name)
                setParentCategory(current.parentCategory || "MAIN")
            }

        } catch (err) {
            console.log(err)
        }
    }

    // 🔥 Update
    const handleUpdate = async () => {

        if (!name) return alert("Enter category name")

        const payload = {
            name,
            parentCategory: parentCategory === "MAIN" ? "" : parentCategory
        }

        try {
            await axios.put(`http://localhost:5000/category/edit/${id}`, payload)

            alert("Updated Successfully")
            navigate("/Category")

        } catch (err) {
            // console.log(err)
            alert("No Permission")
        }
    }

    // 🔥 Dropdown recursive
    const renderDropdown = (parent = "", level = 0) => {
        return categories
            .filter(cat => (cat.parentCategory || "") === parent)
            .flatMap(cat => ([
                <CDropdownItem
                    key={cat._id}
                    style={{ paddingLeft: `${20 + level * 20}px` }}
                    onClick={() => setParentCategory(cat._id)}
                >
                    {cat.name}
                </CDropdownItem>,
                ...renderDropdown(cat._id, level + 1)
            ]))
    }

    return (
        <>

            <CCard className="mb-4">
                <CCardHeader>
                    Edit Category
                </CCardHeader>

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

                        <CDropdownMenu style={{ maxHeight: "300px", overflowY: "auto",width:"100%" }}>
                            <CDropdownItem onClick={() => setParentCategory("MAIN")}>
                                Main Category
                            </CDropdownItem>

                            {renderDropdown("")}
                        </CDropdownMenu>
                    </CDropdown>

                    <div style={{ display: "flex", gap: "10px" }}>

                        <CButton color="primary" onClick={handleUpdate}>
                            Update
                        </CButton>

                        <CButton
                            color="secondary"
                            onClick={() => navigate("/Category")}
                        >
                            Cancel
                        </CButton>

                    </div>

                </CCardBody>
            </CCard>

        </>
    )
}