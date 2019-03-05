const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const passport = require("./config/passportConfig");
const session = require("express-session");
const flash = require("connect-flash");
const isLoggedIn = require("./middleware/isLoggedIn");
const landingPage = require("./middleware/landingPage");
const helmet = require("helmet");
require("dotenv").config();
const SequelizeStore = require("connect-session-sequelize")(
  session.Store
);
const db = require("./models");
const app = express();

const port = process.env.PORT || 3001;

app.set("view engine", "ejs");

app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(helmet());

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 30 * 60 * 1000
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore
  })
);

// use this line once to set up the store table
// sessionStore.sync();

//! must come after session & before passport
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get("/", landingPage, (req, res) => {
  db.poem
    .findAll({
      where: { isPublished: true },
      include: [db.user]
    })
    .then(poems => {
      res.render("main/index", { poems });
    });
});

app.get("/welcome", (req, res) => {
  res.render("index");
});

app.get("/profile", isLoggedIn, function(req, res) {
  res.render("profile");
});

app.use("/auth", require("./controllers/auth"));
app.use("/poems", require("./controllers/poems"));

var server = app.listen(port, function() {
  console.log(`🔥 Listening on port ${port}...`);
});

module.exports = server;
