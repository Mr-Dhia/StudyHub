const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

function verifyToken(req, res, next) {
    const token = req.cookies.token;
    console.log("Cookies reçus :", req.cookies);

    if (!token) {
        return res.status(403).send("Accès refusé");
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            console.log("JWT ERROR:", err.message);
            return res.status(401).send("Token invalide");
        }

        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;