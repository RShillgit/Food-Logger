const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, maxLength: 50, required: true},
    hash: {type: String, required: true},
    salt: {type: String, required: true},
    jwtoken: {type: String},
})

// Export model
module.exports = mongoose.model("User", UserSchema);