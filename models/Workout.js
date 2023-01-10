const mongoose = require("mongoose");
const { Schema } = mongoose;

const workoutSchema = new Schema(
  {
    points: Number,
    title: String,
    description: String,
    friend_name: String,
    rep: String,
    time: String,

    time_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Time",
    },
    rep_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rep",
    },
    friend_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Friend",
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

workoutSchema.index({'$**': 'text'});
module.exports = mongoose.model("Workout", workoutSchema);
