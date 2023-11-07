if(process.env.NODE_ENV!="production"){
    require("dotenv").config(); 
}
const express = require("express");
const app = express();
const ip = require('ip');
const mongoose = require("mongoose"); 
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingsRouter =require("./routes/listing.js");
const reviewsRouter =require("./routes/review.js");
const usersRouter =require("./routes/user.js");


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.set(methodOverride("_method"));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto:{
        secret :process.env.SECRET,
    },
    touchAfter : 24*3600,
});
store.on("error",()=>{
    console.log("Error in mongo session");
});

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized :true,
    cookie : {
        expires : Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly :true
    },
};

const blockedIPs = ['10.0.0.2',];
// Middleware to block IP addresses
app.use((req, res, next) => {
    const clientIP = ip.address();
    if (blockedIPs.includes(clientIP)) {
      console.log(`Blocked request from IP: ${clientIP}`);
      const htmlResponse = `
      <html>
        <head>
          <style>
            body {
              background-color: red;
              text-align: center;
            }
            h1 {
              margin-top: 50vh;
              transform: translateY(-50%);
            }
          </style>
        </head>
        <body>
          <h1>You are Banned From our Website</h1>
          <p>Terms and Condition violation!!
        </body>
      </html>
    `;
        res.send(htmlResponse)
    } else {
      // 
      next();
    }
  });

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next(); 
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter)
app.use("/signup", usersRouter)


const dbUrl = process.env.ATLASDB_URL

main()
    .then(()=>console.log("Connected to DB"))
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
};

app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page not found"))
})

app.use((err,req,res,next)=>{
    let {statusCode= 500 , message="Something went Wrong"}= err;
    res.status(statusCode).render("listings/error.ejs",{message})
})

app.listen(8080,()=>{
    console.log("Server is working at port : 8080");
})

