const mongoose = require("mongoose");

// can also do this: const {Schema} = mongoose --> then would use const UserSchema = new Schema(...)

const UserSchema = new mongoose.Schema({
  name: String,
  email: {type: String, unique: true},
  password: String,
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;