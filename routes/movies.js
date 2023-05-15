const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')
const Director = require('../models/director')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//All Movies Route
router.get('/', async (req, res) => {
    let query = Movie.find()
    if (req.query.movieTitle != null && req.query.movieTitle != '') {
        query = query.regex('movieTitle', new RegExp(req.query.movieTitle, 'i'))
    }
    try{
        const movies = await query.exec()
        res.render('movies/index', {
            movies: movies,
            searchOptions: req.query
        }) 
    } catch{
        res.redirect('/')
    }
})

//New Movie Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Movie())
})

//Create Movie Route
router.post('/', async (req, res) => {
    const movie = new Movie({
        reviewTitle: req.body.reviewTitle,
        movieTitle: req.body.movieTitle,
        director: req.body.director,
        description: req.body.description  
    })
    savePoster(movie, req.body.poster)

    try{
        const newMovie = await movie.save()
        //res.redirect(`directors/${newDirector.id}`)
        res.redirect('movies')
    } catch{
        renderNewPage(res, movie, true)
    }

})

// router.get(':/id', async (req, res) => {
//     try{
//         const movie = await Movie.findById(req.params.id).populate('director').exec()
//         res.render('movie/show', {movie: movie})
//     } catch {
//         res.redirect('movies')
//     }
// })

    async function renderNewPage(res, movie, hasError = false) {
        try {
            const directors = await Director.find({})
            const params = {
                directors: directors,
                movie: movie
            }
            if (hasError) params.errorMessage = 'Error Creating Movie Review!'
            res.render('movies/new', params)
          } catch{
              res.redirect('/movies')
          }
    }

function savePoster(movie, posterEncoded){
    if (posterEncoded == null) return
    const poster = JSON.parse(posterEncoded)
    if (poster != null && imageMimeTypes.includes(poster.type)) {
        movie.posterImage = new Buffer.from(poster.data, 'base64')
        movie.posterImageType = poster.type
    }
}

module.exports = router