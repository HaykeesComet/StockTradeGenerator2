const { auth } = require('../config/firebase');

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  console.log('🔐 === TOKEN VERIFICATION ===');
  console.log('🔐 Auth header:', req.headers.authorization);
  console.log('🔐 Auth available:', !!auth);

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('❌ No authorization header');
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    console.log('🔐 Token extracted:', idToken ? 'Yes' : 'No');

    if (!idToken) {
      console.error('❌ No token in authorization header');
      return res.status(401).json({ error: 'No token provided' });
    }

    if (!auth) {
      console.error('❌ Firebase auth not initialized');
      return res.status(500).json({ error: 'Firebase auth not configured' });
    }

    console.log('🔐 Verifying token...');
    const decodedToken = await auth.verifyIdToken(idToken);
    console.log('✅ Token verified for user:', decodedToken.uid);

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.message);
    console.error('❌ Error code:', error.code);
    return res.status(401).json({ error: 'Invalid token: ' + error.message });
  }
};

// Middleware to check if user is authenticated (for web pages)
const requireAuth = (req, res, next) => {
  // For now, we'll handle auth on the client side
  // This middleware can be enhanced later for server-side session management
  next();
};

module.exports = { verifyToken, requireAuth };
