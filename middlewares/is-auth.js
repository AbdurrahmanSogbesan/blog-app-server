require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Extract token from client in the Authorization header
  const authHeader = req.get("Authorization");
  // Error handling
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  // ie authHeader = Bearer token, all we want is the token
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    // Verify token with the secret (used in initialization in auth.js login controller)
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  // Error handling
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  // Make userId accessible in all authorized requests
  req.userId = decodedToken.userId;
  next();
};
