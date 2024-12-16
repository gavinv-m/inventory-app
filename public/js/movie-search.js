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
        console.log(data);
      } catch (error) {
        error.name === 'AbortError'
          ? console.log('Request was aborted')
          : console.error('Error fetching movie data:', error);
      }
    }

    // Call fetchmoviedata
    movieInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query) {
        fetchMovieData(query);
      }
    });
  } catch (error) {
    console.error('Error fetching the API key:', error);
  }
});
