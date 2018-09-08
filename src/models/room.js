const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  upvoteCount: {
    type: Number,
    required: true,
    default: 0,
  },
  downvoteCount: {
    type: Number,
    required: true,
    default: 0,
  },
  flagged: {
    type: Boolean,
    required: true,
    default: false,
  },
});

class Room {

}

roomSchema.loadClass(Room);

module.exports = exports = mongoose.model("Room", roomSchema);
