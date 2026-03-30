const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const auth = require("../middleware/auth");
const permission = require("../middleware/permissionAcl");

const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/multer");



router.post(
    "/add",
    auth,
    permission("product_add"),
    upload.single("image"),
    async (req, res) => {
        try {

            let imageData = {};

            if (req.file) {

                const uploadImage = () =>
                    new Promise((resolve, reject) => {

                        const stream = cloudinary.uploader.upload_stream(
                            { folder: "products" },
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

            const product = new Product({
                name: req.body.name,
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                status: req.body.status,
                category: req.body.category,
                image: imageData,
            });

            await product.save();

            res.json({ message: "Product Added" });

        } catch (err) {
            console.log("ADD PRODUCT ERROR:", err);
            res.status(500).json({ error: err.message });
        }
    }
);


router.get("/list", auth, permission("product_view"), async (req, res) => {
    const data = await Product.find().populate("category", "name");
    res.json(data);
});



router.get("/category/:id", async (req, res) => {
    const data = await Product.find({
        category: req.params.id,
    }).populate("category", "name");

    res.json(data);
});



router.put(
    "/edit/:id",
    auth,
    permission("product_edit"),
    upload.single("image"),
    async (req, res) => {
        try {

            const product = await Product.findById(req.params.id);

            let updateData = {
                name: req.body.name,
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                status: req.body.status,
                category: req.body.category,
            };

            if (req.file) {

                if (product.image?.public_id) {
                    await cloudinary.uploader.destroy(product.image.public_id);
                }

                const uploadImage = () =>
                    new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { folder: "products" },
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

            await Product.findByIdAndUpdate(req.params.id, updateData);

            res.json({ message: "Product Updated" });

        } catch (err) {
            res.status(500).json(err.message);
        }
    }
);




router.delete(
    "/delete/:id",
    auth,
    permission("product_delete"),
    async (req, res) => {
        try {

            const product = await Product.findById(req.params.id);

            // delete cloud image
            if (product.image?.public_id) {
                await cloudinary.uploader.destroy(product.image.public_id);
            }

            await Product.findByIdAndDelete(req.params.id);

            res.json({ message: "Product Deleted" });

        } catch (err) {
            res.status(500).json(err.message);
        }
    }
);




router.get("/count", async (req, res) => {
    try {
        const products = await Product.countDocuments();
        res.json({ products });
    } catch (err) {
        res.status(500).json(err.message);
    }
});


module.exports = router;