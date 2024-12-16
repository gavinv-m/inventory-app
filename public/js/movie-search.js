const clear = function clearDropdown() {
  const dropdownContainer = document.getElementById('movie-dropdown-container');
  while (dropdownContainer.firstChild) {
    dropdownContainer.removeChild(dropdownContainer.firstChild);
  }
};

const populate = function populateMovieDropDown(movies) {
  const dropdownContainer = document.getElementById('movie-dropdown-container');
  clear();

  movies.slice(0, 5).forEach((movie) => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    // Create poster
    const poster = document.createElement('img');
    poster.setAttribute(
      'src',
      `https://image.tmdb.org/t/p/w500/${movie.poster_path}` ||
        'default-poster.jpg'
    );
    poster.setAttribute('alt', movie.original_title || 'Movie Poster');

    // Create title and description container
    const titleAndDescription = document.createElement('div');
    titleAndDescription.classList.add('title-description');

    // Add title
    const titleElement = document.createElement('h3');
    titleElement.textContent = movie.original_title || 'Unknown Title';

    // Add description
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent =
      movie.overview || 'No description available.';

    // Append title and description to container
    titleAndDescription.appendChild(titleElement);
    titleAndDescription.appendChild(descriptionElement);

    // Append all elements to the movie container
    movieContainer.appendChild(poster);
    movieContainer.appendChild(titleAndDescription);

    // Append movie container to dropdown
    dropdownContainer.appendChild(movieContainer);
  });

  return;
};

document.addEventListener('DOMContentLoaded', async () => {
  const movieInput = document.getElementById('movie-search');
  let abortController = null;

  try {
    // Fetch the API key from the backend
    const response = await fetch('/api/config');
    const data = await response.json();
    const apiKey = data.apiKey;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    };

    async function fetchMovieData(query) {
      // Cancel ongoing request
      if (abortController !== null) abortController.abort();
      abortController = new AbortController();

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&include_adult=false&language=en-US`,
          { ...options, signal: abortController.signal }
        );
        const data = await response.json();
        console.log(data.results);
        populate(data.results);
      } catch (error) {
        error.name === 'AbortError'
          ? console.log('Request was aborted')
          : console.error('Error fetching movie data:', error);
      }
    }

    // Call fetchmoviedata
    movieInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query !== '') {
        fetchMovieData(query);
      } else {
        clear();
      }
    });
  } catch (error) {
    console.error('Error fetching the API key:', error);
  }
});
