const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    value: {
        type: Number,
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    submitted_on: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);