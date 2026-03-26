const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const auth = require("../middleware/auth");
const permission = require("../middleware/permissionAcl");

router.post("/add",auth, permission("category_add"), async (req, res) => {

    try {

        const category = new Category({
            name: req.body.name,
            parentCategory: req.body.parentCategory || null
        });

        await category.save();

        res.json({ message: "Category Added" })

    }
    catch (err) {
        res.status(500).json(err)
    }

});

router.get("/list", async (req, res) => {

    try {

        const data = await Category.find();

        res.json(data);

    }
    catch (err) {
        res.status(500).json(err)
    }

});


router.put("/edit/:id", async (req, res) => {

  try {

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        parentCategory: req.body.parentCategory || null
      },
      { new: true }
    );

    res.json({
      message: "Category Updated",
      data: updated
    });

  }
  catch (err) {
    res.status(500).json(err);
  }

});

router.delete("/delete/:id",auth,permission("category_delete"), async (req, res) => {

  try {

    const subCategory = await Category.findOne({
      parentCategory: req.params.id
    });

    if (subCategory) {
      return res.json({
        message: "Cannot delete. Subcategory exists"
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category Deleted"
    });

  }
  catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;