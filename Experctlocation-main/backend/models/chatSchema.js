const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;
