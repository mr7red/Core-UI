// import React, { useState, useEffect } from "react"
// import axios from "axios"

// import {
//     CCard,
//     CCardBody,
//     CCardHeader,
//     CFormInput,
//     CButton,
//     CTable,
//     CTableHead,
//     CTableRow,
//     CTableHeaderCell,
//     CTableBody,
//     CTableDataCell,
//     CDropdown,
//     CDropdownToggle,
//     CDropdownMenu,
//     CDropdownItem
// } from "@coreui/react"

// export default function Category() {

//     const [name, setName] = useState("")
//     const [categories, setCategories] = useState([])
//     const [parentCategory, setParentCategory] = useState("")
//     const [editMode, setEditMode] = useState(false)
//     const [editId, setEditId] = useState(null)

//     useEffect(() => {
//         fetchCategories()
//     }, [])

//     const fetchCategories = async () => {
//         const res = await axios.get("http://localhost:5000/category/list")
//         setCategories(res.data)
//     }

//     const getRowColor = (index) => {
//         return index % 2 === 0 ? "#f8f9fa" : "#eef5ff"
//     }

//     const submit = async () => {

//         if (!name) return alert("Enter category name")
//         if (!parentCategory) return alert("Select category")

//         const payload = {
//             name,
//             parentCategory: parentCategory === "MAIN" ? "" : parentCategory
//         }

//         try {
//             if (editMode) {
//                 await axios.put(`http://localhost:5000/category/edit/${editId}`, payload)
//                 alert("Updated")
//             } else {
//                 await axios.post("http://localhost:5000/category/add", payload)
//                 alert("Added")
//             }

//             setName("")
//             setParentCategory("")
//             setEditMode(false)
//             fetchCategories()

//         } catch (err) {
//             console.log(err)
//         }
//     }

//     const handleEdit = (cat) => {
//         setName(cat.name)
//         setParentCategory(cat.parentCategory || "MAIN")
//         setEditId(cat._id)
//         setEditMode(true)
//     }

//     const handleDelete = async (id) => {
//         if (!window.confirm("Delete?")) return
//         await axios.delete(`http://localhost:5000/category/delete/${id}`)
//         fetchCategories()
//     }

//     // 🔥 Recursive table render (clean)
//     const renderRows = (parentId, level = 0, rowColor) => {

//         return categories
//             .filter(cat => (cat.parentCategory || "") === parentId)
//             .map(cat => (
//                 <React.Fragment key={cat._id}>

//                     <CTableRow style={{ backgroundColor: rowColor }}>
//                         <CTableDataCell></CTableDataCell>
//                         <CTableDataCell></CTableDataCell>

//                         <CTableDataCell
//                             style={{
//                                 paddingLeft: `${40 + level * 30}px`,
//                                 display: "flex",
//                                 justifyContent: "space-between"
//                             }}
//                         >
//                             {cat.name}

//                             <span>
//                                 <CButton
//                                     size="sm"
//                                     color="primary"
//                                     onClick={() => handleEdit(cat)}
//                                     style={{ marginRight: "5px" }}
//                                 >
//                                     <i className="fa-regular fa-pen-to-square"></i>
//                                 </CButton>

//                                 <CButton
//                                     size="sm"
//                                     color="danger"
//                                     onClick={() => handleDelete(cat._id)}
//                                 >
//                                     <i class="fa-regular fa-trash-can" style={{ color: "white" }}></i>
//                                 </CButton>
//                             </span>
//                         </CTableDataCell>

//                     </CTableRow>

//                     {renderRows(cat._id, level + 1, rowColor)}

//                 </React.Fragment>
//             ))
//     }

//     // dropdown recursive
//     const renderDropdown = (parent = "", level = 0) => {
//         return categories
//             .filter(cat => (cat.parentCategory || "") === parent)
//             .flatMap(cat => ([
//                 <CDropdownItem
//                     key={cat._id}
//                     style={{ paddingLeft: `${20 + level * 20}px` }}
//                     onClick={() => setParentCategory(cat._id)}
//                 >
//                     {cat.name}
//                 </CDropdownItem>,
//                 ...renderDropdown(cat._id, level + 1)
//             ]))
//     }

//     return (
//         <>
//             {/* ADD */}
//             <CCard className="mb-4" style={{ position: "sticky", top: 130, zIndex: 9 }}>
//                 <CCardHeader>Add Category</CCardHeader>

//                 <CCardBody style={{ display: "flex", gap: "20px" }}>

//                     <CFormInput
//                         placeholder="Category Name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                     />

//                     <CDropdown>
//                         <CDropdownToggle color="secondary">
//                             {
//                                 parentCategory === "MAIN"
//                                     ? "Main Category"
//                                     : categories.find(c => c._id === parentCategory)?.name || "Select Category"
//                             }
//                         </CDropdownToggle>

//                         <CDropdownMenu style={{ maxHeight: "300px", overflowY: "auto" }}>
//                             <CDropdownItem onClick={() => setParentCategory("MAIN")}>
//                                 Main Category
//                             </CDropdownItem>
//                             {renderDropdown("")}
//                         </CDropdownMenu>
//                     </CDropdown>

//                     <CButton color="primary" onClick={submit}>
//                         {editMode ? "Update" : "Add"}
//                     </CButton>

//                 </CCardBody>
//             </CCard>

//             {/* TABLE */}
//             <CCard>
//                 <CCardHeader>Category List</CCardHeader>

//                 <CCardBody>
//                     <CTable bordered hover responsive>

//                         <CTableHead>
//                             <CTableRow>
//                                 <CTableHeaderCell>S.No</CTableHeaderCell>
//                                 <CTableHeaderCell>Category</CTableHeaderCell>
//                                 <CTableHeaderCell>Sub Category</CTableHeaderCell>
//                             </CTableRow>
//                         </CTableHead>

//                         <CTableBody>

//                             {categories
//                                 .filter(cat => !cat.parentCategory)
//                                 .map((parent, index) => {

//                                     const rowColor = getRowColor(index)

//                                     return (
//                                         <React.Fragment key={parent._id}>

//                                             {/* PARENT */}
//                                             <CTableRow style={{ backgroundColor: rowColor }}>

//                                                 <CTableDataCell>{index + 1}</CTableDataCell>

//                                                 <CTableDataCell
//                                                     style={{
//                                                         display: "flex",
//                                                         justifyContent: "space-between"
//                                                     }}
//                                                 >
//                                                     <b>{parent.name}</b>

//                                                     <span>
//                                                         <CButton
//                                                             size="sm"
//                                                             color="primary"
//                                                             style={{ marginRight: "5px" }}
//                                                             onClick={() => handleEdit(parent)}
//                                                         >
//                                                             <i className="fa-regular fa-pen-to-square"></i>

//                                                         </CButton>

//                                                         <CButton
//                                                             size="sm"
//                                                             color="danger"
//                                                             onClick={() => handleDelete(parent._id)}
//                                                         >
//                                                             <i class="fa-regular fa-trash-can" style={{ color: "white" }}></i>

//                                                         </CButton>
//                                                     </span>
//                                                 </CTableDataCell>

//                                                 <CTableDataCell></CTableDataCell>

//                                             </CTableRow>

//                                             {/* CHILD + SUB (recursive) */}
//                                             {renderRows(parent._id, 0, rowColor)}

//                                         </React.Fragment>
//                                     )
//                                 })}

//                         </CTableBody>

//                     </CTable>
//                 </CCardBody>
//             </CCard>
//         </>
//     )
// }







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

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        const res = await axios.get("http://localhost:5000/category/list")
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
            await axios.post("http://localhost:5000/category/add",
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
                    style={{ paddingLeft: `${20 + level * 20}px`,
                  borderLeft: `${"4px solid #5856d6" + level * 20}px`,}}
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