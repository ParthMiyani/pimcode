const jwt = require("jsonwebtoken");

// Secret key for JWT
const secretKey = "your-secret-key";

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Verify token
  jwt.verify(token, secretKey, (err, user) => {
    console.log(err);
    console.log(user);
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}
module.exports = { authenticateToken };
