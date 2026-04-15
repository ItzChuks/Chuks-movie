// ============================================================
//  CineVault — Homepage Logic
// ============================================================

let heroItems = [];
let heroIndex = 0;
let heroTimer = null;

async function initHomepage() {
  if (CONFIG.TMDB_API_KEY === 'YOUR_TMDB_API_KEY') {
    showApiKeyWarning();
    return;
  }

  // Load all sections in parallel
  const [trendingData, moviesData, tvData] = await Promise.all([
    TMDB.trending(),
    TMDB.nowPlaying(),
    TMDB.popularTV(),
  ]);

  // Hero
  if (trendingData?.results?.length) {
    heroItems = trendingData.results.filter(i => i.backdrop_path).slice(0, 6);
    renderHero(heroItems[0]);
    renderHeroIndicators();
    startHeroAutoPlay();
  }

  // Trending scroll
  if (trendingData?.results?.length) {
    const el = document.getElementById('trendingGrid');
    if (el) el.innerHTML = trendingData.results.slice(0, 15).map(createTrendingCard).join('');
  }

  // Movies grid
  if (moviesData?.results?.length) {
    const el = document.getElementById('moviesGrid');
    if (el) el.innerHTML = moviesData.results.slice(0, 12).map(i => createMovieCard(i)).join('');
  }

  // TV grid
  if (tvData?.results?.length) {
    const el = document.getElementById('seriesGrid');
    if (el) el.innerHTML = tvData.results.slice(0, 12).map(i => createMovieCard(i)).join('');
  }
}

function renderHero(item) {
  const bg = document.getElementById('heroBg');
  const content = document.getElementById('heroContent');
  if (!bg || !content || !item) return;

  const type    = item.media_type || 'movie';
  const title   = TMDB.title(item);
  const year    = TMDB.year(item);
  const rating  = TMDB.rating(item);
  const overview = (item.overview || '').slice(0, 180) + (item.overview?.length > 180 ? '...' : '');
  const genres  = (item.genre_ids || []).slice(0, 3).map(id => genreName(id)).filter(Boolean);

  bg.style.backgroundImage = `url('${TMDB.backdrop(item.backdrop_path)}')`;

  content.innerHTML = `
    <div class="flex items-center gap-2 mb-3 flex-wrap">
      <span class="genre-badge text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide">${type === 'tv' ? '📺 TV Series' : '🎬 Movie'}</span>
      <span class="text-amber-400 text-sm font-medium">⭐ ${rating}</span>
      <span class="text-gray-400 text-sm">${year}</span>
      ${genres.map(g => `<span class="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded">${g}</span>`).join('')}
    </div>
    <h1 class="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-3 drop-shadow-lg">${escHtml(title)}</h1>
    <p class="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-md">${escHtml(overview)}</p>
    <div class="flex gap-3 flex-wrap">
      <a href="movie.html?id=${item.id}&type=${type}"
         class="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 text-sm uppercase tracking-wide">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 12.04L8 5.37a1 1 0 00-1.5.87v11.52a1 1 0 001.5.87l11.59-6.67a1 1 0 000-1.74z"/></svg>
        Download Now
      </a>
      <a href="movie.html?id=${item.id}&type=${type}"
         class="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 text-sm uppercase tracking-wide border border-white/20">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        More Info
      </a>
    </div>
  `;
}

function renderHeroIndicators() {
  const el = document.getElementById('heroIndicators');
  if (!el) return;
  el.innerHTML = heroItems.map((_, i) =>
    `<button onclick="goToHero(${i})" class="hero-dot w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-amber-400 w-6' : 'bg-white/40 hover:bg-white/70'}"></button>`
  ).join('');
}

function updateHeroIndicators() {
  document.querySelectorAll('.hero-dot').forEach((dot, i) => {
    if (i === heroIndex) {
      dot.classList.add('bg-amber-400', 'w-6');
      dot.classList.remove('bg-white/40', 'w-2');
    } else {
      dot.classList.remove('bg-amber-400', 'w-6');
      dot.classList.add('bg-white/40', 'w-2');
    }
  });
}

function goToHero(index) {
  heroIndex = index;
  renderHero(heroItems[heroIndex]);
  updateHeroIndicators();
  resetHeroTimer();
}

function startHeroAutoPlay() {
  heroTimer = setInterval(() => {
    heroIndex = (heroIndex + 1) % heroItems.length;
    renderHero(heroItems[heroIndex]);
    updateHeroIndicators();
  }, 6000);
}

function resetHeroTimer() {
  if (heroTimer) clearInterval(heroTimer);
  startHeroAutoPlay();
}

// Genre ID -> name map (TMDB genre IDs)
const GENRE_MAP = {
  28:'Action', 12:'Adventure', 16:'Animation', 35:'Comedy', 80:'Crime',
  99:'Documentary', 18:'Drama', 10751:'Family', 14:'Fantasy', 36:'History',
  27:'Horror', 10402:'Music', 9648:'Mystery', 10749:'Romance', 878:'Sci-Fi',
  53:'Thriller', 10752:'War', 37:'Western', 10759:'Action & Adventure',
  10762:'Kids', 10763:'News', 10764:'Reality', 10765:'Sci-Fi & Fantasy',
  10766:'Soap', 10767:'Talk', 10768:'War & Politics',
};

function genreName(id) {
  return GENRE_MAP[id] || '';
}

function showApiKeyWarning() {
  const hero = document.getElementById('heroContent');
  if (hero) {
    hero.innerHTML = `
      <div class="bg-amber-500/20 border border-amber-500/50 rounded-xl p-6 max-w-lg">
        <h2 class="font-display text-3xl text-amber-400 mb-2">⚙️ SETUP REQUIRED</h2>
        <p class="text-gray-300 text-sm mb-4">To power this site with live movie data, you need a free TMDB API key.</p>
        <ol class="text-gray-300 text-sm space-y-2 list-decimal list-inside mb-4">
          <li>Go to <a href="https://www.themoviedb.org/signup" target="_blank" class="text-amber-400 underline">themoviedb.org/signup</a> (free)</li>
          <li>Navigate to Settings → API → Create API Key</li>
          <li>Open <strong class="text-white">js/config.js</strong> in this project</li>
          <li>Replace <code class="bg-black/30 px-1 rounded">YOUR_TMDB_API_KEY</code> with your key</li>
          <li>Save and redeploy to Vercel</li>
        </ol>
        <p class="text-xs text-gray-500">TMDB API is 100% free for non-commercial use.</p>
      </div>
    `;
  }
  ['trendingGrid', 'moviesGrid', 'seriesGrid'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<div class="col-span-full text-center text-gray-500 py-8">Add your API key to load content.</div>`;
  });
}

document.addEventListener('DOMContentLoaded', initHomepage);
