const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
