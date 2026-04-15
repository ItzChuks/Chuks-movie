// ============================================================
//  CineVault — Configuration
//  1. Get your FREE API key at: https://www.themoviedb.org/
//  2. Replace 'YOUR_TMDB_API_KEY' below with your key
//  3. Deploy to Vercel and you're live!
// ============================================================

const CONFIG = {
  // ✅ Replace with your free TMDB API key
  TMDB_API_KEY: 'YOUR_TMDB_API_KEY',

  TMDB_BASE: 'https://api.themoviedb.org/3',
  IMG_BASE:  'https://image.tmdb.org/t/p/',

  SITE_NAME: 'CineVault',
  SITE_TAGLINE: 'Your Universe of Free Downloads',

  // Poster sizes: w92 w154 w185 w342 w500 w780 original
  POSTER_SM:   'w185',
  POSTER_MD:   'w342',
  POSTER_LG:   'w500',
  BACKDROP_LG: 'w1280',

  PLACEHOLDER_POSTER:   'https://via.placeholder.com/300x450/161625/f0a500?text=No+Image',
  PLACEHOLDER_BACKDROP: 'https://via.placeholder.com/1280x720/07070e/f0a500?text=CineVault',
};
