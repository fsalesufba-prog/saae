import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'saae_linhares_jwt_secret_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};

export const generateToken = (payload: object) => {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
        return null;
    }
};