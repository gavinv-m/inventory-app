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
    const posterPath =
      movie.poster_path !== null
        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        : '/public/images/default-poster.jpg';
    poster.setAttribute('src', posterPath);
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

  let timeoutID = null;
  const handleInput = (event) => {
    const value = event.target.value;

    if (timeoutID !== null) clearTimeout(timeoutID);

    // Make request after 300ms
    // prettier-ignore
    if (value !== '') {
      timeoutID = setTimeout(() => {fetchMovieData(value)}, 500)
    } else {
      clear()
    }
  };

  movieInput.addEventListener('input', handleInput);
});
