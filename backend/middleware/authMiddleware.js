import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    // req{
    //     header: {
    //         authorization: 'Bearer siodfnwoeineoring' // ['Bearer', 'siodfnwoeineoring']
    //     }
    // }
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        console.log(payload)
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // Attach user data to the request object
        req.userId = payload.userId;
        next();
    });
}