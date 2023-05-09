const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const FoodLogSchema = new Schema({
    parentUser: {type: Schema.Types.ObjectId, ref: "User", required: true},
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
    date: { type: Date, required: true }
})

// Export model
module.exports = mongoose.model("FoodLog", FoodLogSchema);