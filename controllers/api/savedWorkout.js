const User = require("../../models/User");

exports.create = async (req, res) => {
      const workoutId = req.body.id;
      console.log(workoutId);
      if (  !workoutId || req.session.userID) {
        res.json({result: 'error'});
      }
      try {
        await User.update({"_id": req.session.userID}, {$push:{saved_workouts: workoutId}})
      } catch (e) {
        res.json({result: 'error could not create a favourite'}); 
      }
  }






  