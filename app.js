const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRoute = require("./routes/listingroute.js");
const ReviewRoute = require("./routes/reviewroute.js");
const UserRoute = require("./routes/UserRoute.js");


const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/User.js");

const dbUrl = process.env.ATLASDB_URL;
//'mongodb://127.0.0.1:27017/trippy'

main()
.then((res)=>{
    console.log("connected to DB");
}
).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24*3600
});

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false ,
    saveUninitialized : true,
    cookie : 
    {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/",(req,res)=>{
//     res.send("root is working");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"student",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.get('/', (req, res) => {
    res.redirect('/listings');
});

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", ReviewRoute);
app.use("/", UserRoute);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

//Error Handling Middleware
app.use((err,req,res,next)=>{
    let {statusCode = 500 , message = "Something went wrong"} = err;
    
    res.status(statusCode).render("listings/Error.ejs",{message});
    // console.log(err);
    next();
});

app.listen("3000",()=>{
    console.log("Server listening to port 3000");
});

// app.get("/testlisting", wrapAsync(async (req,res)=>{
//     let samplelisting = new Listing({
//         title:"My new Villa",
//         description:"By the Beach",
//         price:1500,
//         location:"Calangute, Goa",
//         country:"India",
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// }));