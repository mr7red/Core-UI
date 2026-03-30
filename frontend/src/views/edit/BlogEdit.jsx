import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CImage
} from "@coreui/react"

export default function BlogEdit() {

  const { id } = useParams()
  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  const BASE_URL = import.meta.env.VITE_BACKEND_URL

  const [preview, setPreview] = useState(null)
  const [image, setImage] = useState(null)

  const [form, setForm] = useState({
    title: "",
    content: "",
    startDate: "",
    endDate: ""
  })


  useEffect(() => {
    fetchSingleBlog()
  }, [])

  const fetchSingleBlog = async () => {
    try {

      const res = await axios.get(`${BASE_URL}/blog/list`)

      const blog = res.data.find(b => b._id === id)

      if (!blog) {
        alert("Blog not found")
        navigate("/blog-list")
        return
      }

      setForm({
        title: blog.title || "",
        content: blog.content || "",
        startDate: blog.startDate?.slice(0, 10) || "",
        endDate: blog.endDate?.slice(0, 10) || ""
      })

      if (blog.image?.url) {
        setPreview(blog.image.url)
      }

    } catch (err) {
      console.log(err)
    }
  }


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }


  const handleImage = (e) => {

    const file = e.target.files[0]
    setImage(file)

    if (file) {
      setPreview(URL.createObjectURL(file))
    }
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

    try {

      await axios.put(
        `${BASE_URL}/blog/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )

      alert("Blog Updated Successfully")

      navigate("/Blog")

    } catch (err) {
      console.log(err)
      alert("Update Failed")
    }
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


          <CRow className="align-middle mt-3">

            <CCol md={10}>
              <CFormInput
                type="file"
                label="Blog Image"
                onChange={handleImage}
              />
            </CCol>

            <CCol
              md={2}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {preview && (
                <CImage
                  src={preview}
                  width={100}
                  height={90}
                  style={{ objectFit: "cover" }}
                  rounded
                />
              )}
            </CCol>

          </CRow>


          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px"
            }}
          >

            <CButton color="primary" type="submit">
              Update Blog
            </CButton>

            <CButton
              type="button"
              color="secondary"
              onClick={() => navigate("/blog-list")}
            >
              Cancel
            </CButton>

          </div>

        </form>

      </CCardBody>
    </CCard>
  )
}