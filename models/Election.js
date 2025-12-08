const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: String,
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'closed'],
        default: 'draft'
    },
    allowedGroups: [{
        type: String
    }],
    candidates: [{
        name: String,
        voteCount: { type: Number, default: 0 }
    }]
});

module.exports = mongoose.model('Election', electionSchema);