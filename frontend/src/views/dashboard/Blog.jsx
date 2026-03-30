import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CFormInput,
    CImage
} from "@coreui/react"

export default function BlogList() {

    const navigate = useNavigate()

    const [blogs, setBlogs] = useState([])
    const [search, setSearch] = useState("")
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        fetchBlog()
    }, [])

    const fetchBlog = async () => {
        const res = await axios.get(
            `${BASE_URL}/blog/list`)
        setBlogs(res.data)
    }

    const filteredBlog = blogs
        ? blogs.filter(item =>
            item.title?.toLowerCase().includes(search.toLowerCase()) ||
            item.content?.toLowerCase().includes(search.toLowerCase())
        )
        : []


    const token = localStorage.getItem("token")

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure delete?")) return;

        await axios.delete(
            // `http://localhost:5000/blog/delete/${id}`
            `${BASE_URL}/blog/delete/${id}`
            , {
                headers: { Authorization: `Bearer ${token}` }
            });

        fetchBlog();
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>

                <h4>Blog</h4>

                <div style={{ display: "flex", gap: "10px" }}>

                    <CFormInput
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <CButton style={{ width: "200px" }} color="primary" onClick={() => navigate("/Blog-Add")}>
                        + Add Blog
                    </CButton>

                </div>
            </div>

            <CTable bordered>

                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary text-center">S.No</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">Image</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">Title</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">Content</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">Start Date</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">End Date</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>

                <CTableBody>

                    {filteredBlog.length > 0 ? (
                        filteredBlog.map((item, index) => (

                            <CTableRow key={index} className="align-middle text-center">

                                <CTableDataCell>{index + 1}</CTableDataCell>

                                <CTableDataCell>
                                    <CImage
                                        src={item.image?.url}
style={{
    width:"80px",
    height:"50px",
    objectFit:"cover"
}}
/>
                                </CTableDataCell>

                                <CTableDataCell>{item.title}</CTableDataCell>

                                <CTableDataCell>{item.content}</CTableDataCell>

                                <CTableDataCell>
                                    {item.startDate
                                        ? new Date(item.startDate).toLocaleDateString()
                                        : "-"
                                    }
                                </CTableDataCell>

                                <CTableDataCell>
                                    {item.endDate
                                        ? new Date(item.endDate).toLocaleDateString()
                                        : "-"
                                    }
                                </CTableDataCell>

                                <CTableDataCell>
                                    <CButton
                                        size="sm"
                                        color="primary"
                                        onClick={() => navigate(`/Blog-Edit/${item._id}`)}
                                    >
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </CButton>

                                    <CButton
                                        size="sm"
                                        color="danger"
                                        className="ms-2"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        <i className="fa-regular fa-trash-can" style={{ color: "white" }}></i>
                                    </CButton>
                                </CTableDataCell>

                            </CTableRow>

                        ))
                    ) : (
                        <CTableRow>
                            <CTableDataCell colSpan="6" className="text-center">
                                No Data Found
                            </CTableDataCell>
                        </CTableRow>
                    )}

                </CTableBody>

            </CTable>
        </>
    )
}