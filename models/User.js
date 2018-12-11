const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: String },
  exercises: [{
    description: { type: String },
    duration: { type: Number },
    date: { type: Date }
  }]
});

mongoose.model('User', UserSchema);

module.exports = UserSchema;