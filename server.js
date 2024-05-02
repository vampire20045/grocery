const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const session = require('express-session');
const path = require('path');
let payment=require('./paymentschema')
app.use(session({
    secret: 'my-secret-string',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 } // Set the session cookie to expire after 1 minute for testing purposes
}));
// Here we are configuring the session middleware
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});
//This middleware sets the Content-Type header 
//to "application/javascript" for requests ending with ".js".
app.use(bodyparser.urlencoded({extended : false}));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/beauty");

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the script.js file from the grocery directory
app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});

// Define user schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
// creating object named User
const User = mongoose.model("myUser", userSchema);

// Route to render the index page
app.get("/index", (req, res) => {
    res.sendFile(__dirname + "/public/" + "index.html");
});

app.get("/exotic_fruits_vegetables", (req, res) => {
    res.sendFile(__dirname + "/public/" + "exotic_fruits_vegetables.html");
});

app.get("/tea", (req, res) => {
    res.sendFile(__dirname + "/public/" + "tea.html");
});

app.get("/refined_oil", (req, res) => {
    res.sendFile(__dirname + "/public/" + "refined_oil.html");
});

app.get("/kirana", (req, res) => {
    res.sendFile(__dirname + "/public/" + "kirana.html");
});

app.get("/contact", (req, res) => {
    res.sendFile(__dirname + "/public/" + "contact.html");
});

app.get("/payment", (req, res) => {
    res.sendFile(__dirname + "/public/" + "payment.html");
});
app.post("/payment",(req,res)=>{
    console.log(req.body);
    let d=payment.create({
        fistName:req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country:req.body.country,
        zip:req.body.zip,
    })
    res.send("You have succesfully placed the order...");
})
app.get("/bakery", (req, res) => {
    res.sendFile(__dirname + "/public/" + "bakery.html");
});

app.get("/login" , (req, res) => {
    res.sendFile(__dirname + "/public/" + "index.html");
});

app.post("/login" , (req , res) => {
    const email = req.body.user_email;
    const pass = req.body.user_password;
    // Check if the provided email exists in the database
    User.findOne({ email: email })
        .then(foundUser => {
            if (foundUser) {
                // If email exists, compare the passwords
                if (foundUser.password === pass) {
                    // Passwords match, set session variable to indicate that the user is logged in
                    console.log("Successfully logged in");
                    res.send(`<script>alert('Successfully logged in'); window.location.href = '/index';</script>`);
                    req.session.loggedIn = true;
                    req.session.save();
                    // res.redirect("/index"); // Redirect to the index page if login is successful
                } else {
                    res.send(`<script>alert('Invalid email or password. Please try again.'); window.location.href = '/login';</script>`);
                }
            } else {
                res.send(`<script>alert('Email not found. Please sign up first.'); window.location.href = '/sign';</script>`);
            }
        })
        .catch(err => {
            console.log(err);
            res.send("Error occurred during login.");
        });
});

// Define sign-up route
app.get("/sign" , (req , res) => {
    res.sendFile(__dirname + "/public/" + "sign.html");
});

app.post("/sign" , (req , res) => {
    const u_name = req.body.user_sign_name;
    const u_email = req.body.user_sign_email;
    const u_pass = req.body.user_sign_password;
    
    // Check if the provided email already exists in the database
    User.findOne({email: u_email})
        .then(foundUser => {
            if(!foundUser) {
                // Email not found, create a new user
                const data = new User({name: u_name, email: u_email, password: u_pass});
                data.save()
                    .then(doc => {
                        console.log(doc);
                        req.session.loggedIn = true;
                        req.session.save();
                        console.log("Successfully signed in")
                        res.send(`<script>alert('Successfully signed in'); window.location.href = '/index';</script>`);
                        // res.redirect("/index"); // Redirect to the index page if sign-up is successful
                    })
                    .catch(err => {
                        console.log("An error has occurred in the app.post");
                    });
            } else {
                // Email already exists, show error message and redirect to sign-up page
                res.send(`<script>alert('Email is already taken. Please use a different email to sign up.'); window.location.href = '/sign';</script>`);
            }
        });
});

// Add this route to check login status
app.get("/login-status", (req, res) => {
    if (req.session.loggedIn) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

app.listen(2000 , function(err) {
    console.log("server is live");
});
