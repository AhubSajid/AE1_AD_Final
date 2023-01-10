const mongoose = require("mongoose");
const { Schema } = mongoose;

const timeSchema = new Schema(
    {
        name: { type: String, required: [true, 'Name is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Time", timeSchema);