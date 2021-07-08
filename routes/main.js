const express = require('express')
const axios = require('axios')
const router = express.Router()


router.get('/', (req, res, next) => {

  res.render('index')

})

// router.get('/search', async (req, res, next) => {

//   const url = 'https://itunes.apple.com/search?term=sports&country=US&media=podcast'
//   const { data } = await axios({
//     url,
//     method: 'get',
//     options: {
//       headers: {Accept: 'application/json'}
//     }
//   })

//   const { results } = data
//   const podcasts = results.map(podcast => {
//     return {
//       name: podcast.artistName,
//       trackName: podcast.trackName,
//       icon: podcast.artworkUrl600,
//       genres: podcast.genres,
//       feed: podcast.feedUrl
//     }
//   })
//   res.json({podcasts})
// })

router.post('/search', async (req, res, next) => {
  const searchTerm = req.body.term
  const url = `https://itunes.apple.com/search?term=${searchTerm}&country=US&media=podcast`
  const { data } = await axios({
    url,
    method: 'get',
    options: {
      headers: {Accept: 'application/json'}
    }
  })

  const { results } = data
  const podcasts = results.map(podcast => {
    return {
      name: podcast.artistName,
      trackName: podcast.trackName,
      image: podcast.artworkUrl600,
      categories: podcast.genres,
      feed: podcast.feedUrl
    }
  })
  res.json({podcasts})
})

module.exports = router