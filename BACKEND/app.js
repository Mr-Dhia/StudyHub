const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth");

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

// routes
app.use("/auth", authRoutes);

app.listen(3000, () => {
    console.log("Serveur démarré");
});