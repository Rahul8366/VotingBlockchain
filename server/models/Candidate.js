const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Automatically trims whitespace from the candidate's name
    },
    numericalId: {
        type: Number,
        required: true,
        unique: true, // Ensures each candidate has a unique numerical ID
    },
    voteCount: {
        type: Number,
        default: 0,
        min: 0, // Prevents negative vote counts
    },
});

// Export the Mongoose model for use in other parts of the application
module.exports = mongoose.model('Candidate', CandidateSchema);
