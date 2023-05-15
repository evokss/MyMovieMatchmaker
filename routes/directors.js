const express = require('express')
const router = express.Router()
const Director = require('../models/director')
const Movie = require('../models/movie')

//All Directors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const directors = await Director.find(searchOptions)
        res.render('directors/index', {
            directors: directors,
            searchOptions: req.query
        })
    } catch{
        res.redirect('/')
    }
})

//New Director Route
router.get('/new', (req, res) => {
    res.render('directors/new', {director: new Director()})
})

//Create Director Route
router.post('/', async (req, res) => {
    const director = new Director({
        name: req.body.name
    })
    try{
        const newDirector = await director.save()
        res.redirect(`directors/${newDirector.id}`)
    } catch{
      res.render('directors/new', {
        director: director,
        errorMessage: 'Error creating Director'
      })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const director = await Director.findById(req.params.id)
        const movieReviews = await Movie.find({ director: director.id }).exec()
        res.render('directors/show', {
            director: director,
            movieReviewsByDirector: movieReviews
        }) 
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try{
        const director = await Director.findById(req.params.id)
        res.render('directors/edit', {director: director })
    } catch{
        res.redirect('/director')
    }
})

router.put('/:id', async (req, res) => {
    let director
    try{
        director = await Director.findById(req.params.id)
        director.name = req.body.name
        await director.save()
        res.redirect(`/directors/${director.id}`)
    } catch{
        if(director == null){
            res.redirect('/')
        } else{
            res.render('directors/edit', {
                director: director,
                errorMessage: 'Error updating Director'
              })
        }
    }
})

router.delete('/:id', async (req, res) => {
    try {
      const response = await Director.deleteOne({_id: req.params.id});
      if (response.deletedCount === 0) {
        res.redirect('/');
      } else {
        res.redirect('/directors');
      }
    } catch (err) {
      console.error(err);
      res.redirect(`/directors/${req.params.id}`);
    }
  });

module.exports = router