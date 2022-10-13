const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const todoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  PostedBy: {
    type: ObjectId,
    ref: 'User',
  },
});

module.exports = new mongoose.model('ToDo', todoSchema);
