const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header

  console.log("Token received:", token); // Debug log

  if (!token) {
    return res.status(403).send({ message: "Access token is required" });
  }

  const accessTokenSecret = "access_token_secret"; // Ensure this matches the signing secret
  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message); // Debug log
      return res.status(401).send({ message: "Invalid or expired access token" });
    }

    console.log("Token verified. Decoded payload:", decoded); // Debug log
    req.user = decoded;
    next();
  });
}); // <-- Close the middleware function here

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
