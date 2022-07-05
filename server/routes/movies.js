const express = require('express');
const router = express.Router();
const { Movie, Genre } = require('../db');

router.get("/add-movie", async (req, res) => {
  const allMyGenres = await Genre.findAll();
  res.send(`<!DOCTYPE html>
  <html>
    <head>
      <title>Add A Movie To Your Watchlist</title>
    </head>
    <body>
      <h1>Add Movie</h1>
      <form method="POST" action="/movies">
        <div>
          <label>Title:</label>
          <input type="text" name="title" />
        </div>
        <div>
          <label>Imdb Link:</label>
          <input type="text" name="link" placeholder="Optional" />
        </div>
        <div>
            <div id="genre-selects-container">
              <select id="genre-select" name="genres">
              <option></option>
              ${allMyGenres.map(genre => {
                return `<option value="${genre.id}">${genre.name}</option>`
              }).join("")
              }
              </select>
            </div>
            <button type="button" id="add-button">+</button>
        </div>
        <button type="submit">Add Movie</button>
      </form>
      <script type="text/javascript" src="/movie-form.js"></script>
    </body>
  </html>`)
})

router.get('/', (req, res) => {
  res.send(`Pretend this is a movie form`)
})

router.post('/', async (req, res, next) => {
  const title = req.body.title;
  const imdbLink = req.body.link;
  const attchedGenresId = req.body.genres;
  try {
    const newMovie = await Movie.create({
      title: title,
      imdbLink: imdbLink || null
    })
    await newMovie.setGenres(attchedGenresId)
    res.redirect("/movies");
  } catch (error) {
    next(error)
  }
})

module.exports = router;
