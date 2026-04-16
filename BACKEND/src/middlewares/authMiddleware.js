const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;


function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "Accès refusé" });
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;