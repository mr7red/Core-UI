import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import {
    CCard, CCardBody, CCardHeader,
    CFormInput, CFormTextarea,
    CButton, CRow, CCol
} from "@coreui/react"

export default function BlogAdd() {

    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const [form, setForm] = useState({
        title: "",
        content: "",
        startDate: "",
        endDate: ""
    })

    const [image, setImage] = useState(null)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        Object.keys(form).forEach(key => {
            formData.append(key, form[key])
        })

        if (image) {
            formData.append("image", image)
        }

        await axios.post("http://localhost:5000/blog/add", formData, {
            headers: { Authorization: `Bearer ${token}` }
        })

        alert("Blog Added")
        navigate("/blog-list")
    }

    return (
        <CCard>
            <CCardHeader><h4>Add Blog</h4></CCardHeader>
            <CCardBody>

                <form onSubmit={handleSubmit}>

                    <CFormInput label="Title" name="title" onChange={handleChange} className="mb-3" />

                    <CFormTextarea label="Content" name="content" onChange={handleChange} className="mb-3" />

                    <CRow>
                        <CCol md={6}>
                            <CFormInput type="date" label="Start Date" name="startDate" onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="date" label="End Date" name="endDate" onChange={handleChange} />
                        </CCol>
                    </CRow>

                    <CFormInput type="file" className="mt-3" onChange={(e) => setImage(e.target.files[0])} />

                    <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "Start",marginTop:"15px" }}>

                        <CButton color="primary" type="submit">
                            Add Blog
                        </CButton>

                        <CButton
                            type="button"
                            color="secondary"
                            onClick={() => navigate("/Blog")}
                        >
                            Cancel
                        </CButton>
                    </div>


                </form>

            </CCardBody>
        </CCard>
    )
}