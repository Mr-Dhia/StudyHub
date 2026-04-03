const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const transporter = require("../utils/mailer");
const generateCode = require("../utils/generateCode");

const verifyToken = require("../middlewares/authMiddleware");

const rateLimit = require("express-rate-limit");

const SECRET = process.env.SECRET;





// stockage codes
const codes = {};

// nettoyage automatique
setInterval(() => {
    const now = Date.now();

    for (let email in codes) {
        if (codes[email].expiresAt < now) {
            delete codes[email];
        }
    }
}, 5 * 60 * 1000);

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send("EMAIL_EXISTS");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            ...req.body,
            password: hashedPassword
        });

        await user.save();
        res.send("OK");

    } catch (err) {
        res.status(500).send("Erreur");
    }
});

// RATE LIMIT
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.status(429).json({
            message: "Trop de tentatives, réessayez plus tard ⛔"
        });
    }
});

// LOGIN
router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ status: "KO" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ status: "KO" });
        }

        const token = jwt.sign(
            { email: user.email, role: user.role },
            SECRET,
            { expiresIn: "1h" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });
        const code = generateCode();

        codes[email] = {
            code,
            expiresAt: Date.now() + 3 * 60 * 1000
        };

        if (user.role === "admin") {

            await transporter.sendMail({
                from: '"StudyHub" <' + process.env.EMAIL_USER + '>',
                to: email,
                subject: "Code de vérification",
                text: "Votre code est : " + code
            });

            return res.json({
                status: "CODE_SENT",
                role: user.role
            });
        }
        await transporter.sendMail({
            from: '"StudyHub" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: "Nouvelle connexion",
            text: "Connexion de votre compte etudiant" + process.env.EMAIL_USER
        });
        res.send({
            status: "OK",
            role: user.role
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur serveur");
    }
});

// VERIFY
router.post("/verify", async (req, res) => {
    const { email, code } = req.body;

    const data = codes[email];

    if (!data) {
        return res.status(400).json({ message: "Code invalide ❌" });
    }

    if (Date.now() > data.expiresAt) {
        delete codes[email];
        return res.status(400).json({ message: "Code expiré ⏰" });
    }

    if (data.code !== code) {
        return res.status(400).json({ message: "Code incorrect ❌" });
    }


    const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

    await transporter.sendMail({
        from: '"StudyHub" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: "Nouvelle connexion",
        text: "Connexion de votre compte admin " + process.env.EMAIL_USER
    });
    delete codes[email];
    res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
    path: "/"
});

    res.json({ status: "OK" });
});

router.get("/verify-token", verifyToken, (req, res) => {
    res.json({ ok: true, user: req.user,k:cookies.token });
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Email introuvable" });
    }

    const code = generateCode();

    codes[email] = {
        code,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    await transporter.sendMail({
        from: '"StudyHub" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: "Réinitialisation mot de passe",
        text: "Votre code est : " + code
    });

    res.json({ message: "Code envoyé" });
});

router.post("/verify-reset-code", (req, res) => {
    const { email, code } = req.body;

    const data = codes[email];

    if (!data) {
        return res.status(400).json({ message: "Code invalide" });
    }

    if (Date.now() > data.expiresAt) {
        delete codes[email];
        return res.status(400).json({ message: "Code expiré" });
    }

    if (data.code !== code) {
        return res.status(400).json({ message: "Code incorrect" });
    }

    res.json({ message: "Code valide" });
});

router.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
        { email },
        { password: hashedPassword }
    );


    res.json({ message: "Mot de passe modifié" });
});



router.get("/etudiant-data", verifyToken, (req, res) => {
    res.send("Bienvenue " + req.user.email);
});



module.exports = router;