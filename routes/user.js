const express = require("express");
const WrapAsync = require("../utils/WrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users"); // Importing the user controller to handle the logic for each user-related route
const user = require("../models/user.js");


router.route("/signup")
    // Render the signup form for new users get request
    .get( userController.renderSignupForm) // Route to render the signup form for new users, using the renderSignupForm method from the user controller to handle the logic for rendering the form.
    // Handle user registration POST request
    .post(WrapAsync(userController.registerUser)); // Route to handle the registration of a new user, using the registerUser method from the user controller to handle the logic for registering the user, wrapped in the WrapAsync utility to handle any asynchronous errors that may occur during the execution of the route handler.

    
router.route("/login")
    // Render the login form for existing users get request
    .get(userController.renderLoginForm) // Route to render the login form for existing users, using the renderLoginForm method from the user controller to handle the logic for rendering the form.
    // Handle user login POST request
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),userController.postlogoutUser);


// Handle user logout GET request
router.get("/logout", userController.getlogoutUser); // Route to handle user logout, using the logoutUser method from the user controller to handle the logic for logging out the user.

module.exports = router;