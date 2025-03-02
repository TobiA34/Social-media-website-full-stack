const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  // Get the token from the request header
  const accessToken = req.header("accessToken");

  if (!accessToken) {
    return res.status(401).json({ error: "User not logged in!" });
  }

  try {
    // Verify the token
    const validToken = verify(accessToken, "importantsecret");

    // Attach the user data to the request object
    req.user = validToken;

    // If valid token, proceed to the next middleware or route handler
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.status(403).json({ error: "Invalid token!" });
  }
};

module.exports = { validateToken };
