const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const admin = require("./models/Admin")

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        try {
            console.log("MongoDB connected");

            const adminExists = await admin.findOne({ role: "admin" });

            if (!adminExists) {
                const hashed = await bcrypt.hash("123456", 10);

                await admin.create({
                    name: "Anand",
                    email: "anand@gmail.com",
                    password: hashed,
                    role: "admin"
                });

                console.log("Default Admin Created");

            } else {
                console.log("Admin already exists");
            }
        } catch (err) {
            console.log("Admin creation error:", err.message);
        }
    })
    .catch(err => console.log("Mongo error:", err.message));

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", require("./routes/auth"))
app.use("/api/create",require("./routes/usersCreate"))
app.use("/role", require("./routes/role"));
app.use("/blog", require("./routes/blog")); 
app.use("/category",require("./routes/category"));
app.use("/product",require("./routes/product"));


app.listen(5000, () => console.log("Server running on 5000"));