// ============================================================
//  CineVault — TMDB API Service
// ============================================================

const TMDB = {
  async get(endpoint, params = {}) {
    const url = new URL(CONFIG.TMDB_BASE + endpoint);
    url.searchParams.set('api_key', CONFIG.TMDB_API_KEY);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

    try {
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`TMDB error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('TMDB fetch failed:', err);
      return null;
    }
  },

  poster(path, size = CONFIG.POSTER_MD) {
    return path ? `${CONFIG.IMG_BASE}${size}${path}` : CONFIG.PLACEHOLDER_POSTER;
  },

  backdrop(path, size = CONFIG.BACKDROP_LG) {
    return path ? `${CONFIG.IMG_BASE}${size}${path}` : CONFIG.PLACEHOLDER_BACKDROP;
  },

  // Returns display title for both movies and TV shows
  title(item) {
    return item.title || item.name || 'Unknown';
  },

  // Returns year string
  year(item) {
    const d = item.release_date || item.first_air_date || '';
    return d ? d.slice(0, 4) : '—';
  },

  // Returns rating string
  rating(item) {
    return item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  },

  // Fetches trending (week)
  async trending() {
    return await this.get('/trending/all/week');
  },

  // Latest movies in theatres
  async nowPlaying(page = 1) {
    return await this.get('/movie/now_playing', { page });
  },

  // Popular movies
  async popularMovies(page = 1) {
    return await this.get('/movie/popular', { page });
  },

  // Popular TV
  async popularTV(page = 1) {
    return await this.get('/tv/popular', { page });
  },

  // Search
  async search(query, page = 1) {
    return await this.get('/search/multi', { query, page });
  },

  // Movie or TV details
  async details(id, type = 'movie') {
    return await this.get(`/${type}/${id}`, { append_to_response: 'credits,similar,videos' });
  },

  // Genre list
  async genres(type = 'movie') {
    return await this.get(`/genre/${type}/list`);
  },

  // Discover by genre
  async byGenre(genreId, type = 'movie', page = 1) {
    return await this.get(`/discover/${type}`, { with_genres: genreId, page, sort_by: 'popularity.desc' });
  },
};
