import populate from './populate.js';
import clear from './clear-results.js';
import enableBtn from './enable-button.js';

let timeoutID = null;
const handleInput = (event) => {
  async function fetchMovieData(query) {
    try {
      const response = await fetch(`/api/fetch-movies?query=${query}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok === false) throw new Error('Failed to fetch movie data');
      const data = await response.json();
      populate(data.results);
    } catch (error) {
      console.error(error);
    }
  }

  const value = event.target.value;

  if (timeoutID !== null) clearTimeout(timeoutID);

  // Make request after 300ms
  // prettier-ignore
  if (value !== '') {
    timeoutID = setTimeout(() => {fetchMovieData(value)}, 500); 
  } else {
    clear();
    enableBtn();
    const hiddenInput = document.getElementById('database-id');
    hiddenInput.removeAttribute('value');
  }
};

const handleSelectChange = () => {
  enableBtn();
};

document.addEventListener('DOMContentLoaded', async () => {
  const movieInput = document.getElementById('movie-search');
  const selectCollection = document.getElementById('select-collection');

  movieInput.addEventListener('input', handleInput);
  selectCollection.addEventListener('change', handleSelectChange);
});
