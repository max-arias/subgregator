import OpenSubtitles from 'opensubtitles-api';

export async function get({ params }) {
  const { type, id } = params;

  // TODO: Move this to .env
  const BASE_MOVIE_DB_URL = import.meta.env.VITE_BASE_MOVIE_DB_URL;
  const MOVIE_DB_API_KEY = import.meta.env.VITE_MOVIE_DB_API_KEY;

  const language = 'en'; // TODO: localstorage user setting?
  const url = `${BASE_MOVIE_DB_URL}/${type}/${id}?language=${language}&api_key=${MOVIE_DB_API_KEY}&append_to_response=external_ids`;

  const response = await fetch(url);
  const details = await response.json();

  const {
    external_ids: { imdb_id },
  } = details;

  const subs = new OpenSubtitles({
    useragent: import.meta.env.VITE_OPENSUBTITLES_USERAGENT,
  });

  const subs_found = await subs.search({
    imdbid: imdb_id,
    //   ...(seasonNum ? { season: seasonNum } : {}),
    //   ...(episodeNum ? { episode: episodeNum } : {}),
  });

  const subtitles = Object.keys(subs_found).map((key) => ({
    data: subs_found[key],
    language: subs_found[key].lang,
    langcode: subs_found[key].langcode,
    imdbId: imdb_id,
    provider: 'opensubtitles',
  }));

  // Body is the body of the response
  return {
    body: {
      details,
      subtitles,
    },
  };
}
