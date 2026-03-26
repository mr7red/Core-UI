const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");
const SuperAdmin = require("../models/SuperAdmin");
const Manager = require("../models/Manager");
const Employee = require("../models/Employee");
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const encryptData = require("../utils/crypto")

const upload = require("../middleware/multer");
const auth = require("../middleware/auth");
const acl = require("../middleware/acl");
const permission = require("../middleware/permissionAcl");

router.post("/list/:role", auth, permission("user_add"), async (req, res) => {

  const { role } = req.params;

  try {

    const email = req.body.email;

    const existSuperAdmin = await SuperAdmin.findOne({ email });
    const existManager = await Manager.findOne({ email });
    const existEmployee = await Employee.findOne({ email });
    const existUser = await User.findOne({ email });

    if (existSuperAdmin || existManager || existEmployee || existUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }

    let data;

    if (role === "superadmin") {
      data = await SuperAdmin.create(req.body);
    }
    else if (role === "manager") {
      data = await Manager.create(req.body);
    }
    else if (role === "employee") {
      data = await Employee.create(req.body);
    }
    else if (role === "user") {
      const existing = await User.findOne({ email: req.body.email });

      if (existing) {
        return res.status(400).json({
          message: "Email already exists"
        });
      }

      data = await User.create(req.body);
    }
    else {
      return res.status(400).json({ message: "Invalid Role" });
    }

    res.json({ message: "Created Successfully", data });

  }
  catch (err) {

    return res.status(403).json({
      message: "No Permission"
    });
    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }

});

router.get("/user", auth, permission("user_view"), async (req, res) => {
  try {

    const users = await User.find().select("-password");

    const fields = Object.keys(User.schema.paths)
      .filter(field => field !== "__v" &&
        field !== "password" &&
        field !== "_id" &&
        field !== "role");


    const encrypted = encryptData({ fields, data: users });
    res.json(encrypted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/profile", auth, async (req, res) => {

  try {

    const { id } = req.user;

    const models = {
      admin: Admin,
      superadmin: SuperAdmin,
      manager: Manager,
      employee: Employee,
      user: User
    };

    let user = null;
    let roleName = null;

    // check each model
    for (const key in models) {

      const Model = models[key];

      user = await Model.findById(id)
        .populate("role")
        .select("-password");

      if (user) {
        roleName = key;
        break;
      }

    }

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      name: user.name,
      email: user.email,
      role: roleName,
      profile: user.profile,
      banner: user.banner,
      createdAt: user.createdAt
    });
  }
  catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

router.put("/profile/update", auth, upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "banner", maxCount: 1 }
]),
  async (req, res) => {

    try {

      const { id } = req.user;

      const models = {
        admin: Admin,
        superadmin: SuperAdmin,
        manager: Manager,
        employee: Employee,
        user: User
      };

      let updatedUser = null;

      for (const key in models) {

        const Model = models[key];
        const user = await Model.findById(id);

        if (user) {

          const updateData = {};

          if (req.body.name) {
            updateData.name = req.body.name;
          }

          if (req.body.email) {
            updateData.email = req.body.email;
          }

          if (req.files?.profile) {
            updateData.profile = req.files.profile[0].filename;
          }

          if (req.files?.banner) {
            updateData.banner = req.files.banner[0].filename;
          }

          updatedUser = await Model.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
          );

          break;
        }
      }

      res.json({
        message: "Profile Updated",
        data: updatedUser
      });

    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }

  });

router.put("/edit/:role/:id", auth, permission("user_edit"), async (req, res) => {

  const { role, id } = req.params;
  const { role: newRole } = req.body;

  try {

    let Model;
    let NewModel;

    const models = {
      superadmin: SuperAdmin,
      manager: Manager,
      employee: Employee,
      user: User
    };

    Model = models[role];
    NewModel = models[newRole];

    if (!Model || !NewModel) {
      return res.status(400).json({ message: "Invalid Role" });
    }

    const existing = await Model.findById(id);

    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role !== newRole) {

      const newUser = await NewModel.create({
        name: req.body.name,
        email: req.body.email
      });

      await Model.findByIdAndDelete(id);

      return res.json({
        message: "Role updated and moved",
        data: newUser
      });

    }

    const updated = await Model.findByIdAndUpdate(id, req.body, { new: true });

    res.json({
      message: "Updated successfully",
      data: updated
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

router.delete("/delete/:role/:id", auth, acl("superAdmin", "admin"),
  async (req, res) => {

    const { role, id } = req.params;

    try {

      let data;

      if (role === "superadmin") {
        data = await SuperAdmin.findByIdAndDelete(id);
      }
      else if (role === "manager") {
        data = await Manager.findByIdAndDelete(id);
      }
      else if (role === "employee") {
        data = await Employee.findByIdAndDelete(id);
      }
      else if (role === "user") {
        data = await User.findByIdAndDelete(id);
      }
      else {
        return res.status(400).json({ message: "Invalid Role" });
      }

      res.json({
        message: "User Deleted",
        data
      });

    }
    catch (err) {
      res.status(500).json({
        message: err.message
      });
    }

  }
);

router.get("/list/:role",auth, permission("user_view"), async (req, res) => {

  const { role } = req.params;

  try {

    let data;

    if (role === "superadmin") {
      data = await SuperAdmin.find().select("-password");
    }
    else if (role === "manager") {
      data = await Manager.find().select("-password");
    }
    else if (role === "employee") {
      data = await Employee.find().select("-password");
    }
    else {
      return res.status(400).json({ message: "Invalid Role" });
    }

    const encrypted = encryptData(data);

    res.json(encrypted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


// Using Core UI chart

router.get("/count/users", async (req, res) => {
  try {

    const superadmin = await SuperAdmin.countDocuments()
    const manager = await Manager.countDocuments()
    const employee = await Employee.countDocuments()

    const total = superadmin + manager + employee

    res.json({
      total,
      superadmin,
      manager,
      employee
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


router.get("/count/customer", async (req, res) => {
  try {
    const customers = await User.countDocuments()

    res.json({
      customers
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router;