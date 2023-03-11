require("dotenv").config();

//grab our dependencies
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { check, validationResult } = require("express-validator");

//configure our application
//set sessions and cookie parser
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 60000 },
    resave: false, // forces the session to be saved back to the store
    saveUninitialized: false, //dont save unmodified sessions
  })
);
app.use(flash());

//tell express where to look for static assets
app.use(express.static(__dirname + "/public"));

//set ejs as our template engine
app.set("view engine", "ejs");
app.use(expressLayouts);

//connect to database
mongoose.connect(process.env.DB_URI);

//use body parsercto grab info from a form
app.use(bodyParser.urlencoded({ extended: true }));
app.post(
  "/events/create",
  [
    check("name").notEmpty().withMessage("Name required."),
    check("description").notEmpty().withMessage("Description required."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "errors",
        errors.array().map((err) => err.msg)
      );
      return res.redirect("/events/create");
    }

    // create a new event
    const event = new Event({
      name: req.body.name,
      description: req.body.description,
    });

    // save event using a Promise chain
    event
      .save()
      .then(() => {
        // set a successful flash message
        req.flash("success", "Successfully created event!");

        // redirect to the newly created event
        res.redirect(`/events/${event.slug}`);
      })
      .catch((err) => {
        throw err;
      });
  }
);

//set the routes
app.use(require("./app/routes"));

//start our server
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
