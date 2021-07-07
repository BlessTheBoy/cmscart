const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const config = require("./config/database");
const bodyParser = require("body-parser");
const session = require("express-session");

// Connecting Mongoose to db
mongoose.connect(config.database, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  // we're connected!
  console.log("Connected to mongo db");
});

// Initialize app
var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Set global error variables
app.locals.errors = null;

// Body parser middle ware
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Express session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

// Express messages middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Set up router
var pages = require("./routes/pages.js");
var adminPages = require("./routes/admin_pages.js");

app.use("/admin/pages", adminPages);
app.use("/", pages);

// Start server
var port = 3000;

app.listen(port, () => {
  console.log(`app is listening on port:${port}`);
});
