// controllers/users.js

const User = require("../models/user.js");

// Render the signup form for new users get request
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

// Handle user registration POST request
module.exports.registerUser = async (req, res) => {
          try {
          const { username, email, password } = req.body;
          const newUser = new User({ username, email });
          const registerUser = await User.register(newUser, password)
          console.log(registerUser);
          // Automatically log in the user after successful registration
          req.login(registerUser, err => {
                    if (err) {
                              return next(err);
                    }
                    req.flash("success", "Welcome to Airbnb!");
                    res.redirect("/listings");
                });  
          } catch (e) {
                    req.flash("error", e.message);
                    res.redirect("/signup");
          }
}

// Render the login form for existing users get request
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

// Handle user login POST request
module.exports.postlogoutUser = async (req, res) => {
        req.flash("success", "Welcome Back!");
        let redirectUrl = res.locals.redirectUrl || "/listings"; // Use the redirect URL stored in res.locals if available, otherwise default to "/listings"
        res.redirect(redirectUrl);
}

// Handle user logout GET request
module.exports.getlogoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err); 
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
}
    
