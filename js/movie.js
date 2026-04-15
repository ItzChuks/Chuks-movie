// ============================================================
//  CineVault — Movie Detail Page Logic
// ============================================================

async function initMoviePage() {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');
  const type   = params.get('type') || 'movie';

  if (!id) {
    window.location.href = 'index.html';
    return;
  }

  if (CONFIG.TMDB_API_KEY === 'YOUR_TMDB_API_KEY') {
    document.getElementById('movieContent').innerHTML = `
      <div class="max-w-lg mx-auto text-center py-16">
        <div class="text-6xl mb-4">⚙️</div>
        <h2 class="font-display text-3xl text-amber-400 mb-2">API Key Required</h2>
        <p class="text-gray-400 mb-4">Add your TMDB API key to <strong class="text-white">js/config.js</strong></p>
        <a href="index.html" class="btn-primary">← Back to Home</a>
      </div>
    `;
    return;
  }

  const data = await TMDB.details(id, type);
  if (!data || data.success === false) {
    document.getElementById('movieContent').innerHTML = `
      <div class="max-w-lg mx-auto text-center py-16">
        <div class="text-6xl mb-4">🎬</div>
        <h2 class="font-display text-3xl text-white mb-2">Movie Not Found</h2>
        <a href="index.html" class="btn-primary mt-4 inline-block">← Back to Home</a>
      </div>
    `;
    return;
  }

  renderMoviePage(data, type);
}

function renderMoviePage(m, type) {
  const title    = TMDB.title(m);
  const year     = TMDB.year(m);
  const rating   = TMDB.rating(m);
  const runtime  = type === 'movie'
    ? formatRuntime(m.runtime)
    : (m.episode_run_time?.[0] ? formatRuntime(m.episode_run_time[0]) + '/ep' : '—');
  const genres   = (m.genres || []).map(g => g.name);
  const cast     = (m.credits?.cast || []).slice(0, 8);
  const similar  = (m.similar?.results || []).slice(0, 6);
  const trailer  = (m.videos?.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');

  // Download URL — redirects to videodownloader.site with movie title pre-filled as search query
  const downloadUrl = `https://videodownloader.site/?q=${encodeURIComponent(title + ' ' + year)}`;

  document.title = `${title} — CineVault`;

  const bgEl = document.getElementById('movieBg');
  if (bgEl && m.backdrop_path) {
    bgEl.style.backgroundImage = `url('${TMDB.backdrop(m.backdrop_path)}')`;
  }

  document.getElementById('movieContent').innerHTML = `

    <!-- Hero Info -->
    <div class="flex flex-col md:flex-row gap-8 mb-10">

      <!-- Poster -->
      <div class="flex-shrink-0 mx-auto md:mx-0">
        <img
          src="${TMDB.poster(m.poster_path, CONFIG.POSTER_LG)}"
          alt="${escHtml(title)}"
          class="w-48 md:w-56 rounded-xl shadow-2xl ring-2 ring-amber-500/30"
          onerror="this.src='${CONFIG.PLACEHOLDER_POSTER}'"
        />
      </div>

      <!-- Details -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <span class="genre-badge text-xs px-2 py-1 rounded-full font-semibold uppercase">
            ${type === 'tv' ? '📺 TV Series' : '🎬 Movie'}
          </span>
          ${m.status ? `<span class="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">${m.status}</span>` : ''}
        </div>

        <h1 class="font-display text-4xl md:text-5xl text-white leading-tight mb-2">${escHtml(title)}</h1>

        <div class="flex flex-wrap items-center gap-4 text-sm mb-4">
          <span class="text-amber-400 font-bold text-lg">⭐ ${rating}</span>
          <span class="text-gray-400">${year}</span>
          <span class="text-gray-400">${runtime}</span>
          ${m.original_language ? `<span class="text-gray-400 uppercase">${m.original_language}</span>` : ''}
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          ${genres.map(g => `<span class="genre-badge text-xs px-3 py-1 rounded-full">${g}</span>`).join('')}
        </div>

        <p class="text-gray-300 leading-relaxed mb-6 max-w-2xl">
          ${escHtml(m.overview || 'No description available.')}
        </p>

        ${type === 'tv' && m.number_of_seasons ? `
          <div class="flex gap-6 text-sm mb-6">
            <div><span class="text-amber-400 font-bold text-lg">${m.number_of_seasons}</span> <span class="text-gray-400">Seasons</span></div>
            <div><span class="text-amber-400 font-bold text-lg">${m.number_of_episodes || '?'}</span> <span class="text-gray-400">Episodes</span></div>
          </div>
        ` : ''}

        <!-- ACTION BUTTONS -->
        <div class="flex flex-wrap gap-3">

          <!-- DOWNLOAD BUTTON -->
          <a href="${downloadUrl}" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 text-sm uppercase tracking-wide shadow-lg shadow-amber-500/30">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download Now
          </a>

          <!-- TRAILER BUTTON -->
          ${trailer ? `
            <a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl transition text-sm font-medium border border-white/20">
              <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
              Watch Trailer
            </a>
          ` : ''}

        </div>
      </div>
    </div>

    <!-- HOW TO DOWNLOAD INFO BANNER -->
    <div class="bg-surface rounded-2xl p-5 mb-8 border border-white/5 flex items-start gap-4">
      <div class="text-3xl mt-0.5">💡</div>
      <div>
        <p class="text-white font-semibold mb-1">How to download <span class="text-amber-400">${escHtml(title)}</span></p>
        <p class="text-gray-400 text-sm leading-relaxed">
          Click <strong class="text-white">Download Now</strong> above — you'll land on
          <strong class="text-white">videodownloader.site</strong> with
          <strong class="text-white">${escHtml(title)}</strong> already searched for you.
          Just pick your quality and download.
        </p>
      </div>
    </div>

    <!-- CAST -->
    ${cast.length ? `
    <div class="mb-8">
      <h2 class="font-display text-2xl text-white mb-4">CAST</h2>
      <div class="flex gap-3 overflow-x-auto pb-2 scroll-x">
        ${cast.map(actor => `
          <div class="flex-shrink-0 w-24 text-center">
            <div class="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 bg-card ring-2 ring-white/10">
              <img
                src="${actor.profile_path
                  ? TMDB.poster(actor.profile_path, 'w185')
                  : 'https://via.placeholder.com/80x80/161625/888?text=' + encodeURIComponent(actor.name[0])}"
                alt="${escHtml(actor.name)}"
                class="w-full h-full object-cover"
                onerror="this.style.display='none'"
              />
            </div>
            <p class="text-white text-xs font-medium leading-tight">${escHtml(actor.name)}</p>
            <p class="text-muted text-xs truncate">${escHtml(actor.character || '')}</p>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- SIMILAR -->
    ${similar.length ? `
    <div>
      <h2 class="font-display text-2xl text-white mb-4">YOU MAY ALSO LIKE</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        ${similar.map(i => createMovieCard({ ...i, media_type: type })).join('')}
      </div>
    </div>
    ` : ''}
  `;
}

document.addEventListener('DOMContentLoaded', initMoviePage);