const express = require('express');
const app = express();
const genresRouter = require("./routes/genres");
const moviesRouter = require("./routes/movies")

const PORT = 8080;

const { dbConnection } = require('./db');
const startServer = async () => {
  await dbConnection.sync();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`)
  })
}

startServer();

//Matches any URL for a GET request to a possible file in the public directory
app.use(express.static(__dirname + '/public'))

//Start of all middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/genre", genresRouter);
app.use("/movies", moviesRouter);

app.get("/", (req, res) => {
  res.send(
    `
      <!DOCTYPE html>
      <head>
        <title>Movie Watchlist App</title>
        <link rel="stylesheet" type="text/css" href="/base-styling.css" />
        <link rel="stylesheet" type="text/css" href="/movie-list-stylesheet.css" />
      </head>
      <body>
        <div id="react-goes-here"></div>
        <script src="/bundle.js"></script>
      </body>
    `
  )
})

