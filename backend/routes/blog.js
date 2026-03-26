const express = require("express");
const router = express.Router();

const Blog = require("../models/Blog");
const acl = require("../middleware/acl");
const upload = require("../middleware/multer");
const auth = require("../middleware/auth");


router.post(
  "/add",
  auth,
  acl("superAdmin", "admin", "manager"),
  upload.single("image"),
  async (req, res) => {

    try {

      const { title, content, startDate, endDate } = req.body;

      const blog = new Blog({
        title,
        content,
        startDate,
        endDate,
        image: req.file ? req.file.filename : ""
      });

      await blog.save();

      res.json({
        message: "Blog Uploaded",
        blog
      });

    }
    catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);


router.get("/list", async (req, res) => {

  try {

    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.json(blogs);

  }
  catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

router.put("/update/:id", auth, acl("superAdmin", "admin", "manager"), upload.single("image"), async (req, res) => {
  try {
    const { title, content, startDate, endDate } = req.body;

    const updateData = {
      title,
      content,
      startDate,
      endDate
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json({ message: "Blog Updated", blog });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/delete/:id", auth, acl("superAdmin", "admin", "manager"), async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;