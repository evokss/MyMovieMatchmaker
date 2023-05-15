const mongoose = require('mongoose')
const Movie = require('./movie')

const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

directorSchema.pre("deleteOne", async function (next) {
    try {
        const query = this.getFilter();
        const hasMovie = await Movie.exists({ director: query._id });

        if (hasMovie) {
            next(new Error("This director still has his reviews!"));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Director', directorSchema)
