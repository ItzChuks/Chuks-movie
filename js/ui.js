// ============================================================
//  CineVault — Shared UI Utilities
// ============================================================

// ---- Movie Card ----
function createMovieCard(item, showType = false) {
  const type   = item.media_type || (item.title ? 'movie' : 'tv');
  const title  = TMDB.title(item);
  const year   = TMDB.year(item);
  const rating = TMDB.rating(item);
  const poster = TMDB.poster(item.poster_path, CONFIG.POSTER_MD);
  const url    = `movie.html?id=${item.id}&type=${type}`;

  const typeBadge = showType
    ? `<span class="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${type === 'tv' ? 'bg-blue-500' : 'bg-amber-500'} text-gray-900">${type === 'tv' ? 'TV' : 'Film'}</span>`
    : '';

  return `
    <a href="${url}" class="movie-card relative block rounded-lg overflow-hidden bg-card flex-shrink-0 cursor-pointer group">
      <div class="relative overflow-hidden" style="padding-top:150%">
        <img
          src="${poster}"
          alt="${escHtml(title)}"
          loading="lazy"
          class="card-img absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onerror="this.src='${CONFIG.PLACEHOLDER_POSTER}'"
        />
        <!-- Overlay on hover -->
        <div class="card-overlay absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <span class="text-white text-xs font-semibold uppercase tracking-wide px-3 py-1 bg-amber-500/90 rounded-full">Download</span>
        </div>
        ${typeBadge}
        <!-- Rating badge -->
        <div class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs font-bold rating-badge">${rating}</div>
      </div>
      <div class="p-2">
        <p class="text-white text-xs font-semibold truncate leading-tight">${escHtml(title)}</p>
        <p class="text-muted text-xs mt-0.5">${year}</p>
      </div>
    </a>
  `;
}

// ---- Trending card (wider, horizontal scroll) ----
function createTrendingCard(item) {
  const type   = item.media_type || 'movie';
  const title  = TMDB.title(item);
  const year   = TMDB.year(item);
  const rating = TMDB.rating(item);
  const poster = TMDB.poster(item.poster_path, CONFIG.POSTER_MD);
  const url    = `movie.html?id=${item.id}&type=${type}`;

  return `
    <a href="${url}" class="movie-card relative block rounded-lg overflow-hidden bg-card flex-shrink-0 w-36 md:w-44 cursor-pointer group">
      <div class="relative overflow-hidden" style="padding-top:150%">
        <img
          src="${poster}"
          alt="${escHtml(title)}"
          loading="lazy"
          class="card-img absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onerror="this.src='${CONFIG.PLACEHOLDER_POSTER}'"
        />
        <div class="card-overlay absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs font-bold rating-badge">${rating}</div>
        <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs font-bold uppercase ${item.media_type === 'tv' ? 'bg-blue-500' : 'bg-amber-500'} text-gray-900">${item.media_type === 'tv' ? 'TV' : 'Film'}</span>
      </div>
      <div class="p-2">
        <p class="text-white text-xs font-semibold truncate">${escHtml(title)}</p>
        <p class="text-muted text-xs">${year}</p>
      </div>
    </a>
  `;
}

// ---- Render skeleton cards ----
function skeletonCards(count, cls = '') {
  return Array(count).fill(
    `<div class="skeleton ${cls} rounded-lg" style="aspect-ratio:2/3;min-width:144px"></div>`
  ).join('');
}

// ---- Escape HTML ----
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---- Format runtime ----
function formatRuntime(mins) {
  if (!mins) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ---- Mobile menu toggle ----
function toggleMobileMenu() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.toggle('hidden');
}

// ---- Navbar scroll shadow ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  if (window.scrollY > 10) {
    nav.classList.add('shadow-lg');
  } else {
    nav.classList.remove('shadow-lg');
  }
});
