import { useEffect, useState } from "react"
import axios from "axios"
import { CNavGroup, CNavItem } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilFilter } from "@coreui/icons"
export default function CategorySidebar() {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const [categories, setCategories] = useState([])

    useEffect(() => {

        axios.get(`${BASE_URL}/category/list`)
            .then(res => {
                setCategories(res.data)
            })

    }, [])

    const parents = categories.filter(cat => !cat.parentCategory)

    const getChildren = (id) => {
        return categories.filter(cat => cat.parentCategory === id)
    }

    return (

        <CNavGroup
            toggler={
                <>
                    <CIcon icon={cilFilter} className="nav-icon" />
                    Categories
                </>
            }
        >

            {parents.map(parent => {

                const children = getChildren(parent._id)

                if (children.length > 0) {

                    return (

                        <CNavGroup key={parent._id} style={{ position: "relative" }} toggler={parent.name}>

                            {children.map(child => (
                                <CNavItem
                                    key={child._id}
                                    to={`/category/${child._id}`}
                                    style={{ paddingLeft: "80px", color: "#ffffffa1" }}
                                >
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    {child.name}
                                </CNavItem>
                            ))}

                        </CNavGroup>

                    )

                } else {

                    return (

                        <CNavItem
                            key={parent._id}
                            to={`/category/${parent._id}`}
                        >
                            {parent.name}
                        </CNavItem>

                    )

                }

            })}

        </CNavGroup>

    )

}