require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const timesModel = require("./models/Time");
const expressSession = require("express-session");
const User = require("./models/User");

/**
 * Controllers (route handlers).
 */
const friendController = require("./controllers/friend");
const workoutController = require("./controllers/workout");
const homeController = require("./controllers/home");
const userController = require("./controllers/user");
const workoutApiController = require("./controllers/api/workout");
const savedWorkoutApiController = require("./controllers/api/savedWorkout");
const savedWorkoutController = require("./controllers/savedWorkout");

const app = express();
app.set("view engine", "ejs");

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { WEB_PORT, MONGODB_URI } = process.env;

/**
 * connect to database
 */




mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

/***
 * We are applying our middlewear
 */
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({ secret: 'hey there', cookie: { expires: new Date(253402300000000) , resave: true, saveUninitailized: true } }))


app.use("*", async (req, res, next) => {
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

app.get("/", homeController.list);

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})

app.get("/create-friend", authMiddleware, (req, res) => {
  res.render("create-friend", { errors: {} });
});

app.post("/create-friend", friendController.create);

app.get("/friends", friendController.list);
app.get("/friends/delete/:id", friendController.delete);
app.get("/friends/update/:id", friendController.edit);
app.post("/friends/update/:id", friendController.update);



app.get("/create-workout", workoutController.createView);
app.post("/create-workout", workoutController.create);
app.get("/workouts/edit/:id", workoutController.edit);
app.post("/update-workout",workoutController.edit);


app.get("/search-workouts",(req,res) => {
  res.render('search-workouts', workoutApiController);
});

app.get("/saved-workouts", savedWorkoutController.list);

app.get("/api/search-workouts", workoutApiController.list);
app.post("/api/saved-workout", savedWorkoutApiController.create);



app.get("/workouts", workoutController.list);
app.get("/workouts/delete/:id", workoutController.delete);

app.get("api/workout", )

app.get("/join", (req, res) => {
  res.render('create-user', { errors: {} })
});

app.post("/join", userController.create);
app.get("/login", (req, res) => {
  res.render('login-user', { errors: {} })
});
app.post("/login", userController.login);


app.listen(WEB_PORT, () => {
  console.log(
    `Example app listening at http://localhost:${WEB_PORT}`,
    chalk.green("✓")
  );
});