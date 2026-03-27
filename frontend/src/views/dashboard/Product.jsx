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
  CBadge
} from "@coreui/react"

export default function ProductList() {
    const token = localStorage.getItem("token")

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const BASE_URL = import.meta.env.VITE_BACKEND_URL
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const res = await axios.get(
      // "http://localhost:5000/product/list"
      `${BASE_URL}/product/list`,
      { headers: { Authorization: `Bearer ${token}` } }

    )
    setProducts(res.data)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return

    const token = localStorage.getItem("token")

    await axios.delete(
      // `http://localhost:5000/product/delete/${id}`,
      `${BASE_URL}/product/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    fetchProducts()
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* 🔝 TOP BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>

        <h4>Products</h4>

        <div style={{ display: "flex", gap: "10px" }}>

          <CFormInput
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "300px" }}
          />

          <CButton color="primary" onClick={() => navigate("/Product-list/Product-add")}>
            + Add Product
          </CButton>

        </div>
      </div>

      <CTable hover responsive bordered>

        <CTableHead className="text-nowrap">
          <CTableRow>
            <CTableHeaderCell className="bg-body-tertiary text-center">S.No</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">Image</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">Name</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">Title</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center" style={{ width: "300px" }}>Description</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">Price</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">Status</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">Category</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody className="text-center align-middle">

          {filtered.map((item, index) => (

            <CTableRow key={item._id}>

              <CTableDataCell>{index + 1}</CTableDataCell>

              <CTableDataCell>
                <img
                  src={`${BASE_URL}/uploads/${item.image}`}
                  width="60" height="50px"
                  style={{ borderRadius: "5px", objectFit: "cover" }}
                />
              </CTableDataCell>

              <CTableDataCell>{item.name}</CTableDataCell>

              <CTableDataCell>{item.title}</CTableDataCell>

              {/* 🔥 2 LINE DESCRIPTION */}
              <CTableDataCell style={{
                maxWidth: "300px",
                height: "80px",
                fontSize: "13px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical"
              }}>
                <span style={{ height: "20px", overflow: "hidden" }}>{item.description}</span>
              </CTableDataCell>

              <CTableDataCell>₹{item.price}</CTableDataCell>

              <CTableDataCell>
                <CBadge color={item.status === "Active" ? "success" : "secondary"}>
                  {item.status}
                </CBadge>
              </CTableDataCell>

              {/* 🔥 CATEGORY (breadcrumb feel) */}
              <CTableDataCell>
                {item.category?.name || "—"}
              </CTableDataCell>

              <CTableDataCell className="text-center">

                <CButton
                  size="sm"
                  color="primary"
                  onClick={() => navigate(`/Product-Edit?id=${item._id}`)}
                  style={{ marginRight: "5px" }}
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </CButton>

                <CButton
                  size="sm"
                  color="danger"
                  onClick={() => handleDelete(item._id)}
                >
                  <i className="fa-regular fa-trash-can" style={{ color: "white" }}></i>
                </CButton>

              </CTableDataCell>

            </CTableRow>

          ))}

        </CTableBody>

      </CTable>
    </>
  )
}