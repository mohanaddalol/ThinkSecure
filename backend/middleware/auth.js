import jwt from "jsonwebtoken";

// Middleware to verify JWT token and protect routes
export const authenticateToken = (req, res, next) => {
           try {
                      // Get token from Authorization header
                      const authHeader = req.headers.authorization;
                      const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

                      if (!token) {
                                 return res.status(401).json({ message: "Access token required" });
                      }

                      // Verify token
                      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                                 if (err) {
                                            return res.status(403).json({ message: "Invalid or expired token" });
                                 }

                                 // Attach user info to request object
                                 req.user = user; // Contains: id, username, email
                                 next();
                      });
           } catch (error) {
                      res.status(500).json({ message: "Authentication error", error: error.message });
           }
};
