const Workout = require('../models/Workout');

exports.list = async (req, res) => {
    console.log(req.session);
    try {

        const totalWorkouts = await Workout.find({}).count();
        const totalTimes = await Workout.aggregate([
            { $group: { _id: "$time", totalTimes: { $sum: 1 } } },
            { $count: "totalTimes" }
        ])
        console.log(totalTimes)
        const friendCountSummaryRef = await Workout.aggregate(
            [
                { $match: { friend_name: { $ne: null } } },
                {
                    $group: {
                        _id: "$friend_name",
                        totalFriends: { $sum: 1 }
                    }
                }]);

        const friendCountSummary = friendCountSummaryRef.map(t => ({ name: t._id, totalTimes: t.total }));
        res.render("index", { friendCountSummary: friendCountSummary, totalWorkouts: totalWorkouts, totalFriends: friendCountSummary.length, totalTimes: totalTimes[0].total });

    } catch (e) {
        res.status(404).send({
            message: `error rendering page` + e,
        });
    }
}