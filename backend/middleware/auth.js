const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const SuperAdmin = require("../models/SuperAdmin");
const Manager = require("../models/Manager");
const Employee = require("../models/Employee");
const User = require("../models/User");
const Role = require("../models/Role")


module.exports = async function (req, res, next) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    let user = null
    let roleName = null

    user = await Admin.findById(decoded.id)
    if (user) roleName = "Admin"

    if (!user) {
      user = await SuperAdmin.findById(decoded.id)
      if (user) roleName = "Superadmin"
    }

    if (!user) {
      user = await Manager.findById(decoded.id)
      if (user) roleName = "Manager"
    }

    if (!user) {
      user = await Employee.findById(decoded.id)
      if (user) roleName = "Employee"
    }

    if (!user) {
      user = await User.findById(decoded.id)
      if (user) roleName = "User"
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    // 🔥 GET ROLE FROM DB USING NAME
    const role = await Role.findOne({ name: roleName })

    req.user = user
    req.roleName = roleName
    req.role = role   // 🔥 IMPORTANT

    next()

  } catch (err) {
    res.status(401).json({ message: "Token invalid" })
  }
}