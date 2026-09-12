const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const authorization = req.get('Authorization');
    const [scheme, token] = authorization ? authorization.split(' ') : [];

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'A Bearer token is required.' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = requireAuth;
