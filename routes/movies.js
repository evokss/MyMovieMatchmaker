const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Movie = require('../models/movie')
const uploadPath = path.join('public', Movie.posterImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const Director = require('../models/director')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//All Movies Route
router.get('/', async (req, res) => {
    try{
        const movies = await movie.find({})
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
router.post('/', upload.single('poster'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const movie = new Movie({
        reviewTitle: req.body.reviewTitle,
        movieTitle: req.body.movieTitle,
        director: req.body.director,
        posterImageName: fileName,
        description: req.body.description  
    })
    try{
        const newMovie = await movie.save()
        //res.redirect(`directors/${newDirector.id}`)
        res.redirect('movies')
    } catch{
        if(movie.posterImageName != null) {
            removePosterImage(movie.posterImageName)
        }
        renderNewPage(res, movie, true)
    }

})

function removePosterImage (fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}
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

module.exports = router