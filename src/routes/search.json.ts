export async function get({ url: eventUrl }) {
  const term = eventUrl.searchParams.get('term');

  const BASE_MOVIE_DB_URL = import.meta.env.VITE_BASE_MOVIE_DB_URL;
  const MOVIE_DB_API_KEY = import.meta.env.VITE_MOVIE_DB_API_KEY;

  const url = `${BASE_MOVIE_DB_URL}/search/multi?query=${term}&api_key=${MOVIE_DB_API_KEY}&include_adult=false`;

  const response = await fetch(url);
  const data = await response.json();

  return {
    body: {
      results: data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv')
    },
  };
}
