const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Get the token from the request headers
    const token = req.headers['authorization'];

    // Check if the token is provided
    if (!token) {
        return res.status(403).send({ message: "Access token is required" });
    }

    // Verify the token
    const accessTokenSecret = "your_secret_key"; // Replace with your secret key
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Invalid or expired access token" });
        }

        // Attach user information from token to request object
        req.user = decoded;
        
        // Proceed to the next middleware or route handler
        next();
    });
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
