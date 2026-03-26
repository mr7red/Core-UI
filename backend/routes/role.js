const express = require("express");
const router = express.Router();
const Role = require("../models/Role");
const auth = require("../middleware/auth");
const permission = require("../middleware/permissionAcl");

router.post("/create-role", auth, permission("user_add"), async (req, res) => {
  try {

    const existingRole = await Role.findOne({ name: req.body.name });

    if (existingRole) {
      return res.status(400).json({
        message: "Role already exists"
      });
    }

    const role = new Role(req.body);

    await role.save();

    res.json(role);

  } catch (err) {

    res.status(500).json(err);

  }
});


router.get("/roles", auth, permission("user_add"), async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/update/:id",auth, permission("user_add"), async (req, res) => {
  const updated = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updated)
})

router.delete("/delete/:id", async (req, res) => {
  await Role.findByIdAndDelete(req.params.id)
  res.json({ message: "Deleted" })
})

module.exports = router;