const User = require("../models/User");

exports.list = async (req, res) => {
    try {
      const userRef = await User.findOne({"_id": user.id}).populate('saved_workouts');
      res.render('saved-workouts', {workouts: userRef.saved_workouts});
    } catch (e) {
      console.log(e);
      res.json({result: 'could not find user faves'}); 
    }
}