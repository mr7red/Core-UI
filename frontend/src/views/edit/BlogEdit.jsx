import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import {
  CCard, CCardBody, CCardHeader,
  CFormInput, CFormTextarea,
  CButton, CRow, CCol
} from "@coreui/react"

export default function BlogEdit() {

  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [form, setForm] = useState({
    title: "",
    content: "",
    startDate: "",
    endDate: ""
  })

  const [image, setImage] = useState(null)

  useEffect(() => {
    fetchSingleBlog()
  }, [])

  const fetchSingleBlog = async () => {
    const res = await axios.get("http://localhost:5000/blog/list")

    const blog = res.data.find(b => b._id === id)

    if (blog) {
      setForm({
        title: blog.title || "",
        content: blog.content || "",
        startDate: blog.startDate?.slice(0, 10) || "",
        endDate: blog.endDate?.slice(0, 10) || ""
      })
    }
  }

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

    await axios.put(
      `http://localhost:5000/blog/update/${id}`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    alert("Blog Updated")
    navigate("/Blog")
  }

  return (
    <CCard>
      <CCardHeader>
        <h4>Edit Blog</h4>
      </CCardHeader>

      <CCardBody>

        <form onSubmit={handleSubmit}>

          <CFormInput
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mb-3"
          />

          <CFormTextarea
            label="Content"
            name="content"
            value={form.content}
            onChange={handleChange}
            className="mb-3"
          />

          <CRow>
            <CCol md={6}>
              <CFormInput
                type="date"
                label="Start Date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="date"
                label="End Date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </CCol>
          </CRow>

          <CFormInput
            type="file"
            className="mt-3"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>

            <CButton color="primary" type="submit">
              Update Blog
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