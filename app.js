if(process.env.NODE_ENV !== "production"){ // Check if the application is not running in a production environment, which allows you to load environment variables from a .env file during development without affecting the production environment where environment variables are typically set differently.
    require("dotenv").config(); // Load environment variables from a .env file into process.env, allowing you to keep sensitive information like database credentials and API keys out of your source code and easily manage them in a separate configuration file.
}

// IMPORTS REQUIRED MODULES
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErr");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const passportLocalMongoose = require("passport-local-mongoose");


// ROUTES
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user.js");


// DB
mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
.then(()=> console.log("DB Connected"))
.catch(err=> console.log(err));


// VIEW ENGINE
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

//SESSION OPTIONS
const sessionOptions = {
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true
    },
};
app.use(session(sessionOptions));
app.use(flash()); // Flash messages

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); // serializeUser and deserializeUser are methods provided by passport-local-mongoose to handle user serialization and deserialization for session management.

// Flash Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success"); // Make flash messages available in all templates
    res.locals.error = req.flash("error"); // Make flash messages available in all templates
    res.locals.currentUser = req.user; // Make the current user available in all templates
    next();
});

// Middleware to make currentUser available in all templates
// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({ 
//         username: "demouser", 
//         email: "student@gmail.com" 
//     });
//     let registeredUser = await User.register(fakeUser, "demopassword")
//         res.send(registeredUser);
//     });

// HOME
app.get("/",(req,res)=>{
    res.send("Working");
});

// ROUTERS
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// 404
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});


// ERROR
app.use((err,req,res,next)=>{
    let { statusCode=500 , message="Something Went Wrong"} = err;
    res.status(statusCode).render("listings/error",{ message });
});


app.listen(8080,()=>{
    console.log("Server Running");
});