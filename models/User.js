const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  hkid: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['voter', 'admin'], 
    default: 'voter' 
  },
  eligibleGroup: {
    type: String,
    enum: ['student', 'staff', 'public'],
    required: true
  },
  votedElections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election'
  }]
});

module.exports = mongoose.model('User', userSchema);