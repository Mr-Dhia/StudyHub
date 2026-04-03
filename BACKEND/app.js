const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// routes
app.use("/auth", authRoutes);

app.listen(3000, () => {
    console.log("Serveur démarré");
});