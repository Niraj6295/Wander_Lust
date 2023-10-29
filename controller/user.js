const User = require("../models/user.js");


// Signup form render
module.exports.signupForm = async(req,res)=>{
    res.render("users/signup.ejs")
};

// Signup up user in DB
module.exports.signup = async(req,res)=>{
    try {
        let {username,email,password}= req.body
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcome to Wanderlust")
            res.redirect("/listings")
        })
        
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup")
    }
};

// Login form render
module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs")
};

// Login user  on website
module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)   
};

// Logout user from website
module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You are logged out")
        res.redirect("/listings")
    });
}