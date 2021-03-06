require("dotenv").config();

var express = require("express");
var passport = require("passport");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");

var app = express();

require("./boot/auth")();

// Configure view engine to render EJS templates.
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// session setup
//
// This sequence of middleware is necessary for login sessions.  The first
// middleware loads session data and makes it available at `req.session`.  The
// next lines initialize Passport and authenticate the request based on session
// data.  If session data contains a logged in user, the user is set at
// `req.user`.
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/", authRouter);

module.exports = app;
