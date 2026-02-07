const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
 const token = req.header("Authorization") && req.header("Authorization").replace("Bearer ", "");

    // If no token is provided
    if (!token) {
        return res.status(401).json({ message: "Authorization token is required." });
    }

    // Verify the token
    jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }

        // Attach the decoded user info to the request object
        req.user = decoded;  // You can store the username or any other info from the JWT payload

        // Create a session for the user, if not already created
        if (!req.session.user) {
            req.session.user = req.user;  // Store the decoded user data in the session
        }

        // Allow the request to continue to the route handler
        next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
