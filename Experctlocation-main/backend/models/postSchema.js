const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  tags: { type: [String] },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
