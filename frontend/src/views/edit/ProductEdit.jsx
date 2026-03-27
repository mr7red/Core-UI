import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"

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

export default function ProductEdit() {

    const navigate = useNavigate()
    const token = localStorage.getItem("token")
const BASE_URL = import.meta.env.VITE_BACKEND_URL

    // ✅ query param method (breadcrumb safe)
    const query = new URLSearchParams(useLocation().search)
    const id = query.get("id")

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

    // 🔹 Fetch on load
    useEffect(() => {
        fetchCategories()

        if (id) {
            fetchProduct()
        } else {
            alert("Invalid Product ID")
            navigate("/Product-list")
        }
    }, [id])

    // 🔹 Categories
    const fetchCategories = async () => {
        try {
            const res = await axios.get(
                // "http://localhost:5000/category/list"
                `${BASE_URL}/category/list`
            )
            setCategories(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    // 🔹 Product fetch
    const fetchProduct = async () => {
        try {
            const res = await axios.get(
                // "http://localhost:5000/product/list")
                `${BASE_URL}/product/list`)

            const product = res.data.find(p => p._id === id)

            if (!product) {
                alert("Product not found")
                navigate("/Product-list")
                return
            }

            setForm({
                name: product.name || "",
                title: product.title || "",
                description: product.description || "",
                price: product.price || "",
                category: product.category?._id || "",
                status: product.status || "Active"
            })

            if (product.image) {
                setPreview(
                    `http://localhost:5000/uploads/${product.image}`)
                    // `${BASE_URL}/uploads/${product.image}`)
            }

        } catch (err) {
            console.log(err)
        }
    }

    // 🔹 Input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // 🔹 Image change
    const handleImage = (e) => {
        const file = e.target.files[0]
        setImage(file)

        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    // 🔹 Submit update
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
                `${BASE_URL}/product/edit/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert("Product updated successfully")
            navigate("/Product-list")

        } catch (err) {
            console.log(err)
            alert("Update failed")
        }
    }

    return (
        <CCard>

            <CCardHeader>
                <h4>Edit Product</h4>
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
                            />
                        </CCol>

                        <CCol md={4}>
                            <CFormSelect
                                label="Category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="mb-3"
                            >
                                <option value="">Select Category</option>

                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
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

                    <CRow>
                        <CCol md={10}>
                            <CFormInput
                                type="file"
                                label="Product Image"
                                onChange={handleImage}
                                className="mb-3"
                            />
                        </CCol>

                        <CCol md={2}>
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

                    <div style={{ display: "flex", gap: "10px" }}>

                        <CButton type="submit" color="primary">
                            Update Product
                        </CButton>

                        <CButton
                            type="button"
                            color="secondary"
                            onClick={() => navigate("/Product-list")}
                        >
                            Cancel
                        </CButton>

                    </div>

                </form>

            </CCardBody>
        </CCard>
    )
}