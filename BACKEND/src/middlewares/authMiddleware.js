const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(403).send("Accès refusé");
    }

    const token = authHeader.split(" ")[1];

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