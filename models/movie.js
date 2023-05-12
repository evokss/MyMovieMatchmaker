const mongoose = require('mongoose')

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
    posterImage: {
        type: Buffer,
    },
    posterImageType: {
        type: String,
    },
    director:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Director'
    }
})

movieSchema.virtual('posterImagePath').get(function() {
    if (this.posterImage != null && this.posterImageType != null) {
        return `data: ${this.posterImageType};charset=utf-8;base64,${this.posterImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Movie', movieSchema)
