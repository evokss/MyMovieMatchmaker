const mongoose = require('mongoose')
const path = require('path')

const posterImageBasePath = 'uploads/posterImages'

const movieSchema = new mongoose.Schema({
    reviewTitle: {
        type: String,
        required: true
    },
    movieTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    posterImageName:{
        type: String
    },
    director:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Director'
    }
})

movieSchema.virtual('posterImagePath').get(function() {
    if (this.posterImageName != null) {
        return path.join('/', posterImageBasePath, this.posterImageName)
    }
})

module.exports = mongoose.model('Movie', movieSchema)
module.exports.posterImageBasePath = posterImageBasePath
