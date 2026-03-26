import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import {
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem
} from "@coreui/react"

export default function RoleAdd() {

    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const [roles, setRoles] = useState([])
    const [selectedRole, setSelectedRole] = useState("")
    const [permissions, setPermissions] = useState({})

    const allRoles = ["Superadmin", "Manager", "Employee", "User"]

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        try {
            const res = await axios.get("http://localhost:5000/role/roles", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setRoles(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const availableRoles = allRoles.filter(r =>
        !roles.some(dbRole =>
            dbRole.name.replace(/\s/g, "").toLowerCase() ===
            r.replace(/\s/g, "").toLowerCase()
        )
    )

    const handlePermission = (e) => {
        setPermissions({
            ...permissions,
            [e.target.name]: e.target.checked
        })
    }

    const handleSubmit = async () => {

        if (!selectedRole) return alert("Select role")

        try {
            await axios.post(
                "http://localhost:5000/role/add",
                {
                    name: selectedRole,
                    permissions
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            alert("Role Added")
            navigate("/Role-list")

        } catch (err) {
            console.log(err)
        }
    }

    const renderRow = (title, prefix, index) => (
        <tr key={prefix}>
            <td className="text-center"><b>{index + 1}</b></td>
            <td><b>{title}</b></td>

            {["add", "edit", "delete", "view"].map(action => (
                <td className="text-center" key={action}>
                    <input
                        type="checkbox"
                        name={`${prefix}_${action}`}
                        onChange={handlePermission}
                    />
                </td>
            ))}
        </tr>
    )

    return (
        <CCard>

            <CCardHeader>Add Role</CCardHeader>

            <CCardBody>

                <CDropdown style={{ marginBottom: "20px" }}>
                    <CDropdownToggle
                        color="secondary"
                        disabled={availableRoles.length === 0}
                    >
                        {availableRoles.length === 0
                            ? "All Roles Already Created"
                            : selectedRole || "Select Role"}
                    </CDropdownToggle>

                    <CDropdownMenu>
                        {availableRoles.length === 0 ? (
                            <CDropdownItem disabled>
                                All roles already created
                            </CDropdownItem>
                        ) : (
                            availableRoles.map(role => (
                                <CDropdownItem
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                >
                                    {role}
                                </CDropdownItem>
                            ))
                        )}
                    </CDropdownMenu>
                </CDropdown>

                <table className="table table-bordered text-center align-middle">

                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Module</th>
                            <th>Add</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>View</th>
                        </tr>
                    </thead>

                    <tbody>
                        {renderRow("User", "user", 0)}
                        {renderRow("Category", "category", 1)}
                        {renderRow("Customer", "customer", 2)}
                        {renderRow("Product", "product", 3)}
                    </tbody>

                </table>

                <div style={{ display: "flex", gap: "10px" }}>
                    <CButton color="primary" onClick={handleSubmit}>
                        Save
                    </CButton>

                    <CButton
                        color="secondary"
                        onClick={() => navigate("/Role-list")}
                    >
                        Cancel
                    </CButton>
                </div>

            </CCardBody>

        </CCard>
    )
}