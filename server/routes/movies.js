const express = require('express');
const router = express.Router();
const { Movie, Genre } = require('../db');

router.get("/add-movie", async (req, res) => {
  const allMyGenres = await Genre.findAll();
  res.send(`<!DOCTYPE html>
  <html>
    <head>
      <title>Add A Movie To Your Watchlist</title>
      <link rel="stylesheet" type="text/css" href="/base-styling.css" />
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

router.get('/', async (req, res, next) => {
  const onlyUnwatched = req.query.unwatched === '1';
  const whereClause = {};
  const genreName = req.query.genre;
  if (onlyUnwatched === true) {
    whereClause.watched = false;
  }
  try {
    let movies;
    if (genreName) {
      const specificGenre = await Genre.findOne({
        where: {
          name: genreName
        }
      })
      if (!genreName) {
        res.status(404).send('Unknown Genre');
        return;
      }
      movies = await specificGenre.getMovies({
        include: [Genre],
        order: [
          ['title', 'ASC']
        ],
        where: whereClause
      });
    } else {
      movies = await Movie.findAll({
        include: [Genre],
        order: [
          ["title", "ASC"]
        ],
        where: whereClause
      })
    }
    res.send(
      `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Movie List</title>
            <link rel="stylesheet" type="text/css" href="/movie-list-stylesheet.css" />
            <link rel="stylesheet" type="text/css" href="/base-styling.css" />
          </head>
          <body>
            <h1>Movie List</h1>
            <nav>
              <a href="/movies?unwatched=1">Only Unwatched</a>
              <a href="/movies/feeling-lucky">I'm Feeling Lucky</a>
              <a href="/movies/add-movie">Add To Watchlist</a>
            </nav>
            <ul id="list-of-movies">
            ${movies.map((movie) => {
              return `
              <li class="${movie.watched === true ? "watched" : ""}" >
                <h2>${movie.title}  ${movie.imdbLink ? `<a taget="_blank" href="${movie.imdbLink}">IMDB</a>` : ""}</h2>
                <ul class="genres-list">
                  ${movie.genres.map((genre) => {
                    return `<li><a href="/movies?genre=${genre.name}">${genre.name}</a></li>`
                  }).join("")}
                </ul>
                ${movie.watched === false ? `<a class="watch-link" href="/movies/${movie.id}/mark-watched">I watched this!</a>` : ""}
              </li>`
            }).join("")}
            </ul>
          </body>
        </html>
      `
    )
  } catch (error) {
    next(error)
  }
})

router.get('/feeling-lucky', async (req, res, next) => {
  try {
    const allUnwatchedMovies = await Movie.findAll({
      where: {
        watched: false,
      }
    })
    const amountOfUnwatchedMovies = allUnwatchedMovies.length;
    const randomNumber = Math.floor(Math.random() * amountOfUnwatchedMovies);
    const chosenMovie = allUnwatchedMovies[randomNumber];
    res.send(
      `
      <!DOCTYPE>
      <html>
        <head>
          <title>Your Chosen Movie</title>
          <link rel="stylesheet" type="text/css" href="/base-styling.css" />
        </head>
        <body>
          <h1>
            You Should Watch: ${chosenMovie.title}
          </h1>
          <a href="/movies">Back To List</a>
          <a href="/movies/feeling-lucky">Try Again</a>
        </body>
      </html>
      `
    )
  } catch (error) {
      next(error);
  }
})
router.get('/:movieId/mark-watched', async (req, res, next) => {
  const id = req.params.movieId;

  try {
    const theMovie = await Movie.findByPk(id);
    if (!theMovie) {
      res.send('No movie with that id');
      return;
    }
    theMovie.watched = true;
    await theMovie.save();
    res.redirect("/movies")
  } catch (error) {
    next(err)
  }
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
