import mongoose from 'mongoose';

// Schema
const roomdata = mongoose.Schema({
  roomid: {
    type: String,
  },
  username: [
    {
      type: String,
    },
  ],
});

// Collection
const rdata = mongoose.model('rdata', roomdata);

export default rdata;
