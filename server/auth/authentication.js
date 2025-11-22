// middleware.js
const jwt = require("jsonwebtoken");

// Ye function JWT ke errors ko pakad ke acha message deta hai
const handleJWTError = (res, error) => {
    let message = 'Authentication failed';

    // Expired token?
    if (error.name === 'TokenExpiredError') {
        message = 'Token has expired, login again';
    } 
    // Galat token?
    else if (error.name === 'JsonWebTokenError') {
        message = 'Invalid token, please login';
    } 
    // Token abhi active nahi?
    else if (error.name === 'NotBeforeError') {
        message = 'Token not active yet';
    }

    // Development mein error dikhao, production mein chhupao
    return res.status(401).json({
        result: "Fail",
        message,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};

// Header se token nikalne ka function - Bearer ya direct
const getToken = (req) => {
    if (!req.headers.authorization) return null;

    // Bearer token? → split karo
    if (req.headers.authorization.startsWith('Bearer ')) {
        return req.headers.authorization.split(' ')[1];
    }
    // Ya fir direct token?
    return req.headers.authorization;
};

// Main middleware - role ke hisaab se token check karta hai
const verifyToken = (roles = []) => {
    return (req, res, next) => {
        const token = getToken(req);
        const includesPublic = roles.map(r => r && r.toString().toUpperCase()).includes('PUBLIC')

        // If no token and route allows PUBLIC, allow access
        if (!token) {
            if (includesPublic) return next();
            return res.status(401).json({
                result: "Fail",
                message: 'No token provided, please login'
            });
        }

        let lastError = null; // track last JWT error

        // Verify token against allowed roles (skip PUBLIC)
        for (const role of roles) {
            if (!role || role.toString().toUpperCase() === 'PUBLIC') continue;
            const secretKey = process.env[`JWT_SECRET_KEY_${role.toUpperCase()}`];
            if (!secretKey) continue;

            try {
                const decoded = jwt.verify(token, secretKey);
                req.user = decoded;
                req.user.role = role.toLowerCase();
                return next();
            } catch (err) {
                lastError = err;
            }
        }

        // If token was provided but didn’t match any allowed role
        if (lastError) {
            return handleJWTError(res, lastError);
        }

        // Token verified but role not permitted
        return res.status(403).json({
            result: "Fail",
            message: 'Access denied - insufficient permissions'
        });
    };
};

// Role-wise middleware - shortcut banaye
const verifySuperAdmin = verifyToken(['SUPER_ADMIN']);
const verifyAdmin       = verifyToken(['SUPER_ADMIN', 'ADMIN']);
const verifyUser        = verifyToken(['SUPER_ADMIN', 'ADMIN', 'BUYER']);
const verifyAll         = verifyToken(['SUPER_ADMIN', 'ADMIN', 'BUYER', 'PUBLIC']);

// Export karo sab
module.exports = {
    verifySuperAdmin,
    verifyAdmin,
    verifyUser,
    verifyAll,
    verifyToken
};