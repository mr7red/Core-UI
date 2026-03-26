const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const auth = require("../middleware/auth");
const permission = require("../middleware/permissionAcl");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({ storage: storage });

router.post("/add", auth, permission("product_add"), upload.single("image"), async (req, res) => {

    try {

        const product = new Product({

            name: req.body.name,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            status: req.body.status,
            category: req.body.category,
            image: req.file.filename

        });

        await product.save();

        res.json({ message: "Product Added" });

    }
    catch (err) {
        res.status(500).json(err);
    }

});


router.get("/list",auth, permission("product_view"), async (req, res) => {

    const data = await Product.find().populate("category", "name");

    res.json(data);

});


router.get("/category/:id", async (req, res) => {

    const data = await Product.find({
        category: req.params.id
    }).populate("category", "name");

    res.json(data);

});


router.put("/edit/:id", auth, permission("product_edit"), upload.single("image"), async (req, res) => {

    try {

        const updateData = {
            name: req.body.name,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            status: req.body.status
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({ message: "Product Updated" });

    }
    catch (err) {
        res.status(500).json(err);
    }

});


router.delete("/delete/:id", auth, permission("product_delete"), async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Product Deleted" });

    }
    catch (err) {
        res.status(500).json(err);
    }

});


// Using Core UI chart

router.get("/count", async (req, res) => {
    try {
        const products = await Product.countDocuments()

        res.json({
            products
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


module.exports = router;