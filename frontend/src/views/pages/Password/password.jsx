import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const SetPassword = () => {
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
const role = localStorage.getItem("role")

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/set-password", {
        email: localStorage.getItem("email"),
        password
      })

      alert("Password set successfully")
      if (role === "admin") {
  navigate("/admin-dashboard")
} else {
  navigate("/dashboard")
}
    } catch (err) {
      alert("Error setting password")
    }
  }

  return (
    <div>
      <h2>Set Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default SetPassword