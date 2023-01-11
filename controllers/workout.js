const Workout = require("../models/Workout");
const Time = require("../models/Time");
const Friend = require("../models/Friend");
const Rep = require("../models/Rep");
const Category = require("../models/Category");
const bodyParser = require("body-parser");
const { findById } = require("../models/Time");


exports.list = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
  const page = parseInt(req.query.page) || 1;
  const message = req.query.message;


  try {
    const workouts = await Workout.find({}).skip((perPage * page) - perPage).limit(limit);
    const count = await Workout.find({}).count();
    const numberOfPages = Math.ceil(count / perPage);

    res.render("workouts", {
      workouts: workouts,
      numberOfPages: numberOfPages,
      currentPage: page,
      message: message
    });
  } catch (e) {
    res.status(404).send({ message: "could not list workouts" });
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const times = await Time.find({});
    const friends = await Friend.find({});
    const categories = await Category.find({});
    const workout = await Workout.findById(id);
    if (!workout) throw Error('cant find workout');
    res.render('update-workout', {
      categories: categories,
      workout: workout,
      times: times,
      friends: friends,
      id: id,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('create-workout', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `could find friend ${id}`,
    });
  }
};

exports.create = async (req, res) => {
  try {

    const friend = await Friend.findById(req.body.friend_id);
    await Workout.create({
      title: req.body.title,
      friend_name: friend.name,
      calories: parseInt(req.body.calories),
      friend_id: req.body.friend_id,
      categories: req.body.categories
    })

    res.redirect('/workouts/?message=workout has been created')
  } catch (e) {
    if (e.errors) {
      res.render('create-workout', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.createView = async (req, res) => {
  try {
    const times = await Time.find({});
    const friends = await Friend.find({});
    const categories = await Category.find({});
    res.render("create-workout", {
      times: times,
      friends: friends,
      categories: categories,
      errors: {}
    });

  } catch (e) {
    res.status(404).send({
      message: `could not generate create data`,
    });
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Workout.findByIdAndRemove(id);
    res.redirect("/workouts");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};

