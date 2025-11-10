//middlewares/authMiddleware.js

const { verifyToken} = require("../services/jwtService");

//Middleware to protect routes
module.exports = (req, res, next) => {
    //Get authorization header
    const authHeader = req.headers["authorization"];
    if(!authHeader)
        return res.status(401).json({ message: "No token provided"});

    //Extract token from format"Bearer <token>"
    // 
    const token = authHeader.split(" ")[1];
    if(!token)
        return res.status(401).json({ message: "Malformed token"});

    try {
        //verify token using jwtService
        const decoded = verifyToken(token);

        //Attach decoded user info to request object
        req.user = decoded;

        //Proceed to the next middleware or route handler
        next();
    }
    catch(err) {
        //if token is invalid or expired
        res.status(401).json({ message: " Invalid or expired token"});
    }
};