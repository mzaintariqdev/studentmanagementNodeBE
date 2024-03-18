import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import jwtConfig from '../configs/jwt.js';

const authMiddleware = async (req, res, next) => {
    // Extract the token from the request headers
    const token = req.headers.authorization.split(' ');
    console.log(token)
    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }

    try {
        // Verify the token using the secret key from the JWT configuration
        const decoded = jwt.verify(token[1], jwtConfig.secretKey); // Extract token from 'Bearer <token>'
        console.log(decoded)
        // Check if the user associated with the token exists in the database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User associated with the token does not exist' });
        }

        // Attach the decoded user ID to the request object
        req.user = {
            userId : decoded.userId,
            role : decoded.role,
        } 

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If token is invalid, return an error response
        return res.status(401).json({ message: 'Invalid authentication token' });
    }
};

export default authMiddleware;
