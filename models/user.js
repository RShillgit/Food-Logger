const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, maxLength: 50, required: true},
    calorie_budget: {type: Number, required: true},
    hash: {type: String, required: true},
    salt: {type: String, required: true},
    food_logs: [{type: Schema.Types.ObjectId, ref: "FoodLog"}]
})

// Export model
module.exports = mongoose.model("User", UserSchema);