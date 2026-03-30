const express = require("express");
const router = express.Router();

const Blog = require("../models/Blog");

const auth = require("../middleware/auth");
const acl = require("../middleware/acl");
const permission = require("../middleware/permissionAcl");

const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinary");



router.post(
  "/add",
  auth,
  permission("blog_add"),
  acl("superAdmin", "admin", "manager"),
  upload.single("image"),
  async (req, res) => {
    try {

      let imageData = {};

      if (req.file) {

        const uploadImage = () =>
          new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
              { folder: "blogs" },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );

            stream.end(req.file.buffer);
          });

        const result = await uploadImage();

        imageData = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }

      const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        image: imageData,
      });

      await blog.save();

      res.json({ message: "Blog Added Successfully" });

    } catch (err) {
      console.log("BLOG ADD ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);



router.get("/list", async (req, res) => {
  try {

    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.json(blogs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.put(
  "/update/:id",
  auth,
  permission("blog_edit"),
  acl("superAdmin", "admin", "manager"),
  upload.single("image"),
  async (req, res) => {

    try {

      const blog = await Blog.findById(req.params.id);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      let updateData = {
        title: req.body.title,
        content: req.body.content,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      };


      if (req.file) {

        if (blog.image?.public_id) {
          await cloudinary.uploader.destroy(blog.image.public_id);
        }

        const uploadImage = () =>
          new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
              { folder: "blogs" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );

            stream.end(req.file.buffer);
          });

        const result = await uploadImage();

        updateData.image = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }

      await Blog.findByIdAndUpdate(req.params.id, updateData);

      res.json({ message: "Blog Updated Successfully" });

    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);




router.delete(
  "/delete/:id",
  auth,
  permission("blog_delete"),
  acl("superAdmin", "admin", "manager"),
  async (req, res) => {

    try {

      const blog = await Blog.findById(req.params.id);

      if (blog.image?.public_id) {
        await cloudinary.uploader.destroy(blog.image.public_id);
      }

      await Blog.findByIdAndDelete(req.params.id);

      res.json({ message: "Blog Deleted" });

    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

module.exports = router;