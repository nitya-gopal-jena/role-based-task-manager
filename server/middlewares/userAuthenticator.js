import jwt from 'jsonwebtoken'

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
}

export default authenticateUser