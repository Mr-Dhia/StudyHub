const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nom: String,
    email: String,
    id: String,
    password: String,
    filiere: String,
    classe: String,
    role: {
        type: String,
        enum: ["etudiant", "admin"],
        default: "etudiant"
    }
});

module.exports = mongoose.model("User", UserSchema);