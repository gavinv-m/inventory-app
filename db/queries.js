import pool from './pool.js';
import fetchMovieById from '../controllers/fetch-movie-by-id.js';

// Queried by addMovie in add-movie-controller.js
async function addMovie(data) {
  try {
    const filmDetails = await fetchMovieById(data['database-id']);

    // Add to movies if not in DB
    const movieInDB = await pool.query(
      `SELECT id FROM movies WHERE database_id = $1`,
      [data['database-id']]
    );

    let movieID;
    if (movieInDB.rowCount < 1) {
      result = await pool.query(
        `INSERT INTO movies
      (database_id, title, poster_url, rating, country, year)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
        [
          data['database-id'],
          filmDetails.title,
          filmDetails.posterURL,
          filmDetails.rating,
          filmDetails.country,
          filmDetails.year,
        ]
      );
      movieID = result.rows[0].id;
    } else {
      movieID = movieInDB.rows[0].id;
    }

    const collectionResult = await pool.query(
      `SELECT id FROM collections WHERE name = $1`,
      [data['select-collection']]
    );
    const collectionID = collectionResult.rows[0].id;

    await pool.query(
      `INSERT INTO movies_in_collection
    (collection_id, movie_id)
    VALUES ($1, $2)`,
      [collectionID, movieID]
    );
  } catch (error) {
    throw new Error('Error adding movie: Movie exists in collection');
  }
}

async function createCollection(collection) {
  await pool.query(
    `INSERT INTO collections (name, description)
    VALUES ($1, $2)`,
    [collection.name, collection.description]
  );
}

async function getCollections() {
  const { rows } = await pool.query('SELECT name FROM collections ORDER BY id');
  return rows;
}

const collectionID = async (collectionName) => {
  const { rows } = await pool.query(
    `SELECT id 
    FROM collections
    WHERE name = $1`,
    [collectionName]
  );
  return rows[0].id;
};

async function getCollectionDescription(collectionName) {
  const { rows } = await pool.query(
    `
    SELECT description
    FROM collections
    WHERE name = $1`,
    [collectionName]
  );
  return rows[0].description;
}

// Queried by collections-controller renderCollection
async function getCollectionMovies(collectionName) {
  const collectionId = await collectionID(collectionName);
  const { rows } = await pool.query(
    `
    SELECT movie_id
    FROM movies_in_collection
    WHERE collection_id = $1`,
    [collectionId]
  );
  const movies = await Promise.all(
    rows.map(async (row) => {
      const result = await pool.query(
        `
      SELECT * FROM movies
      WHERE id = $1`,
        [row.movie_id]
      );
      return result.rows;
    })
  );
  return movies;
}

async function getFirstPoster() {
  const { rows } = await pool.query(`SELECT DISTINCT 
    ON (collection_id) collection_id, movie_id
    FROM movies_in_collection
    ORDER BY collection_id
    `);

  const posters = await Promise.all(
    rows.map(async (row) => {
      const result = await pool.query(
        `SELECT poster_url
        FROM movies
        WHERE id = $1`,
        [row.movie_id]
      );
      let posterURL = result.rows[0];
      return posterURL === null ? defaultPosterURL : posterURL.poster_url;
    })
  );

  return posters;
}

const db = {
  addMovie,
  createCollection,
  getCollections,
  getCollectionDescription,
  getCollectionMovies,
  getFirstPoster,
};
export default db;
