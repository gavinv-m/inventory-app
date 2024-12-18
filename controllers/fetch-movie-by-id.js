import dotenv from 'dotenv';
dotenv.config();

// Exports to db/queries.js
export default async function fetchMovieById(filmID) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${filmID}?api_key=${process.env.API_KEY}`,
      { mode: 'cors' }
    );
    if (response.ok === false) throw new Error('Failed to fetch film details');

    const data = await response.json();
    return {
      title: data.original_title,
      posterURL: `https://image.tmdb.org/t/p/w500/${data.poster_path}`,
      rating: data.vote_average,
      country: data.origin_country[0],
      year: Number(data.release_date.split('-')[0]),
    };
  } catch (error) {
    throw error;
  }
}
