import jwt from 'jsonwebtoken'

const ROLE_ADMIN = 'admin';
const ROLE_USER = 'user';

const getCurrentUserRole = (req) => {
    return verifyAndDecodeJWT(req).role;
};

const getCurrentUserId = (req) => {
    return verifyAndDecodeJWT(req).id;
};

const verifyAndDecodeJWT = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }
    // Verify the token and extract the user id and role
    return jwt.verify(token, process.env.JWT_SECRET);
}
export { ROLE_ADMIN, ROLE_USER, getCurrentUserRole, getCurrentUserId };