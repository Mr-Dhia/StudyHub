const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth");

const app = express();


app.use(express.json());
app.use(cookieParser());

connectDB();

// routes
app.use(express.static(path.join(__dirname, "../FRONTEND")));
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoutes);



app.listen(3000, () => {
    console.log("Serveur démarré");
});