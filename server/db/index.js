const Sequelize = require('sequelize');

const dbConnection = new Sequelize(
  "postgres://localhost:5432/moviewatchlist"
);

const Movie = dbConnection.define("movie", {
  title: {
    type: Sequelize.DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  imdbLink: {
    type: Sequelize.DataTypes.STRING(1000),
    validate: {
      isUrl: true
    }
  },
  watched: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  }
})

const Genre = dbConnection.define("genre", {
  name: {
    type: Sequelize.DataTypes.STRING(50),
    allowNull: false
  }
})

Movie.belongsToMany(Genre, { through: "movies_genres" });
Genre.belongsToMany(Movie, { through: "movies_genres" });

module.exports = {
  dbConnection: dbConnection,
  Movie: Movie,
  Genre: Genre
}
