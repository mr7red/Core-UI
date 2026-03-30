import { useState, useEffect } from "react"
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CForm,
    CFormInput,
    CFormLabel,
    CButton
} from "@coreui/react"

import CIcon from "@coreui/icons-react"
import { cilEnvelopeOpen, cilUser, cilHeart } from "@coreui/icons"

import axios from "axios"
import avatar8 from "../../../assets/images/avatars/8.png"

export default function ProfilePage() {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const token = localStorage.getItem("token")

    const [data, setData] = useState({
        name: "",
        email: "",
        role: "",
        profile: "",
        banner: "",
        createdAt: ""
    })

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {

        axios.get(`${BASE_URL}/api/create/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setData(res.data)
                setName(res.data.name)
                setEmail(res.data.email)
            })
            .catch(err => console.log(err))

    }, [])

    const handleProfileUpload = async (e) => {

    const file = e.target.files[0]

    const formData = new FormData()

    formData.append("profile", file)
    formData.append("name", name)
    formData.append("email", email)

    await axios.put(
        `${BASE_URL}/api/create/profile/update`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        }
    )

    window.location.reload()
}

    const handleBannerUpload = async (e) => {

        const file = e.target.files[0]

        const formData = new FormData()
        formData.append("banner", file)

        await axios.put(
            `${BASE_URL}/api/create/profile/update`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        )

        window.location.reload()
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        await axios.put(
            `${BASE_URL}/api/create/profile/update`,
            { name, email },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        alert("Profile Updated")

    }

    const formatDate = (date) => {

        const d = new Date(date)

        const day = d.getDate()

        const month = d.toLocaleString("en-US", { month: "short" })

        const year = d.getFullYear()

        return `${day} ${month} ${year}`

    }

    return (

        <CContainer fluid className="p-0">

            {/* Banner */}

            <input
                type="file"
                hidden
                id="bannerUpload"
                onChange={handleBannerUpload}
            />

            <div
                onClick={() => document.getElementById("bannerUpload").click()}
                style={{
                    borderRadius: "50px",
                    marginTop: "2px",
                    width: "100%",
                    height: "250px",
                    backgroundImage: data.banner?.url
                        ? `url(${data.banner.url})`
                        : "none",
                    backgroundColor: "black",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer"
                }}
            ></div>


            <CContainer className="mt-4 mb-4">

                <CRow>

                    {/* LEFT SIDE PROFILE */}

                    <CCol md={4} style={{ marginTop: "70px" }}>

                        <CCard className="text-center">

                            <CCardBody style={{ display: "flex", zIndex: 99, flexDirection: "column", alignItems: "center" }}>

                                <input
                                    type="file"
                                    hidden
                                    id="profileUpload"
                                    onChange={handleProfileUpload}
                                />

                                <div
                                    onClick={() => document.getElementById("profileUpload").click()}
                                    style={{
                                        marginTop: "-80px",
                                        // marginLeft: "33%",
                                        width: "120px",
                                        height: "120px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        backgroundColor: "#212631",
                                        border: "1px solid #ffffff30",
                                        cursor: "pointer",
                                        zIndex: 9
                                    }}
                                >

                                    <img
                                        src={
                                            data.profile?.url
                                                ? data.profile.url
                                                : avatar8
                                        }
                                        alt="profile"
                                        style={{
                                            width: "95%",
                                            height: "95%",
                                            borderRadius: "50%",
                                            margin: "5px",
                                            objectFit: "cover",
                                            backgroundColor: "white"
                                        }}
                                    />

                                </div>

                                <h4 className="mt-3">{data.name}</h4>
                                <p className="text-muted m-1">
                                    <CIcon icon={cilEnvelopeOpen} style={{ marginRight: "6px" }} />
                                    {data.email}
                                </p>
                                <p className="text-muted m-1">
                                    <CIcon icon={cilUser} style={{ marginRight: "6px" }} />
                                    Role : {data.role}</p>
                                <p className="m-2 bg-primary text-white" style={{ fontSize: "12px", padding: "2px 15px", borderRadius: "10px" }}>
                                    <CIcon icon={cilHeart} style={{ marginRight: "6px", width: "15px", height: "15px", color: "white" }} />
                                    Joined : {data.createdAt ? formatDate(data.createdAt) : ""}
                                </p>
                            </CCardBody>

                        </CCard>

                    </CCol>


                    {/* RIGHT SIDE FORM */}

                    <CCol md={8}>

                        <CCard>

                            <CCardBody>

                                <h4 className="mb-4">Edit Profile</h4>

                                <CForm onSubmit={handleSubmit}>

                                    <div className="mb-3">

                                        <CFormLabel>Name</CFormLabel>

                                        <CFormInput
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <CFormLabel>Email</CFormLabel>

                                        <CFormInput
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />

                                    </div>

                                    <CButton type="submit" color="primary">
                                        Update Profile
                                    </CButton>

                                </CForm>

                            </CCardBody>

                        </CCard>

                    </CCol>

                </CRow>

            </CContainer>

        </CContainer>

    )
}