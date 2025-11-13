const authController = require('../controllers/authController');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No authorization token provided' 
      });
    }

    const token = authHeader.substring(7);
    const user = authController.verifyToken(token);

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token' 
      });
    }

    req.userId = user.id;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = { authMiddleware };
