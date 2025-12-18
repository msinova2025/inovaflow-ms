import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-it';

// Middleware to protect routes
// TODO: For SETDIG/Keycloak integration, this middleware will be updated to validate 
// RS256 tokens using the Keycloak public key (JWKS) instead of a local secret.
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

export default router;
