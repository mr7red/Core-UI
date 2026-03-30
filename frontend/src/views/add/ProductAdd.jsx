import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import {
    CCard,
    CCardBody,
    CCardHeader,
    CFormInput,
    CFormTextarea,
    CButton,
    CFormSelect,
    CRow,
    CCol,
    CImage
} from "@coreui/react"

export default function ProductAdd() {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const [categories, setCategories] = useState([])
    const [preview, setPreview] = useState(null)

    const [form, setForm] = useState({
        name: "",
        title: "",
        description: "",
        price: "",
        category: "",
        status: "Active"
    })

    const [image, setImage] = useState(null)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await axios.get(
                // "http://localhost:5000/category/list")
                `${BASE_URL}/category/list`)
            setCategories(res.data)
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

        if (!form.name || !form.price || !form.category) {
            return alert("Please fill all required fields")
        }

        const formData = new FormData()

        Object.keys(form).forEach(key => {
            formData.append(key, form[key])
        })

        if (image) {
            formData.append("image", image)
        }

        try {
            await axios.post(
                // "http://localhost:5000/product/add",
                `${BASE_URL}/product/add`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            alert("Product added successfully")
            navigate("/product-list")

        } catch (err) {
            console.log(err)
            alert("Failed to add product ")
        }
    }

    return (
        <CCard style={{ margin: "0 auto" }}>

            <CCardHeader>
                <h4>Add New Product</h4>
            </CCardHeader>

            <CCardBody>

                <form onSubmit={handleSubmit}>

                    <CRow>
                        <CCol md={6}>
                            <CFormInput
                                label="Product Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="mb-3"
                                required
                            />
                        </CCol>

                        <CCol md={6}>
                            <CFormInput
                                label="Title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="mb-3"
                            />
                        </CCol>
                    </CRow>

                    <CFormTextarea
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        className="mb-3"
                    />

                    <CRow>
                        <CCol md={4}>
                            <CFormInput
                                type="number"
                                label="Price"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="mb-3"
                                required
                            />
                        </CCol>

                        <CCol md={4}>
                            <CFormSelect
                                label="Category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="mb-3"
                                required
                            >
                                <option value="">Select Category</option>

                                {categories
                                    .filter(cat => cat.parentCategory) // only sub categories
                                    .map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))
                                }

                            </CFormSelect>
                        </CCol>

                        <CCol md={4}>
                            <CFormSelect
                                label="Status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="mb-3"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="align-middle">

                        <CCol md={10}>
                            <CFormInput
                                type="file"
                                label="Product Image"
                                onChange={handleImage}
                                className="mb-3"
                            />
                        </CCol>

                        <CCol md={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {preview && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <CImage src={preview} width={100} height={90} style={{ objectFit: "cover" }} rounded />
                                </div>
                            )}
                        </CCol>


                        <CCol md={12} style={{ display: "flex", alignItems: "center", justifyContent: "Start", marginTop: "15px" }}>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>

                                <CButton type="submit" color="primary">
                                    Add Product
                                </CButton>

                                <CButton
                                    type="button"
                                    color="secondary"
                                    onClick={() => navigate("/product-list")}
                                >
                                    Cancel
                                </CButton>

                            </div>
                        </CCol>

                    </CRow>

                </form>

            </CCardBody>
        </CCard>
    )
}