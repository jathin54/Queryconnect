const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  contact: { type: String},
  password: { type: String, required: true },
  profilePic: { type: String },
  about: { type: String },
  email: { type: String,required: true },
  address: { type: String },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
});

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;
