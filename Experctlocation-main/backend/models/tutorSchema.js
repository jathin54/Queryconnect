const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  about:{type: String,},
  contact: { type: String},
  password: { type: String, required: true },
  profilePic: { type: String},
  email: { type: String, required: true },
  domain: { type: String },
  certifications: { type: [String] },
  experience: { type: Number },
  skills: { type: [String] },
  address: { type: String },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
  latitude:{type:Number},
  longitude:{type:Number}
});


const TutorModel = mongoose.model('Tutor', tutorSchema);

module.exports = TutorModel;
