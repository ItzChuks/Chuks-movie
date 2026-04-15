// ============================================================
//  CineVault — Search Page Logic
// ============================================================

let currentQuery = '';
let currentPage  = 1;
let currentType  = 'all';   // 'all' | 'movie' | 'tv'
let currentSort  = 'popular'; // 'popular' | 'trending' | 'latest'
let totalPages   = 1;

async function initSearchPage() {
  const params = new URLSearchParams(window.location.search);
  currentQuery = params.get('q') || '';
  currentType  = params.get('type') || 'all';
  currentSort  = params.get('sort') || 'popular';
  currentPage  = parseInt(params.get('page') || '1');

  // Set search input value
  const input = document.getElementById('searchInput');
  if (input) input.value = currentQuery;

  // Set active filter
  updateFilterUI();

  // Load results
  await loadResults();
}

async function loadResults() {
  showLoadingState();
  
  if (CONFIG.TMDB_API_KEY === 'YOUR_TMDB_API_KEY') {
    showError('Add your TMDB API key to js/config.js to see results.');
    return;
  }

  let data = null;

  if (currentQuery) {
    data = await TMDB.search(currentQuery, currentPage);
  } else if (currentSort === 'trending') {
    data = await TMDB.trending();
  } else if (currentType === 'tv') {
    data = await TMDB.popularTV(currentPage);
  } else {
    data = await TMDB.popularMovies(currentPage);
  }

  totalPages = data?.total_pages || 1;

  let results = data?.results || [];

  // Filter by type if needed
  if (currentType !== 'all' && currentQuery) {
    results = results.filter(i => {
      const t = i.media_type || (i.title ? 'movie' : 'tv');
      return t === currentType;
    });
  }

  // Filter out people
  results = results.filter(i => i.media_type !== 'person');

  renderResults(results);
  renderPagination();
}

function renderResults(items) {
  const el = document.getElementById('resultsGrid');
  const countEl = document.getElementById('resultCount');

  if (!el) return;

  if (!items.length) {
    el.innerHTML = `
      <div class="col-span-full text-center py-20">
        <div class="text-6xl mb-4">🎬</div>
        <h3 class="font-display text-2xl text-white mb-2">No Results Found</h3>
        <p class="text-gray-400">${currentQuery ? `No matches for "<strong>${escHtml(currentQuery)}</strong>"` : 'Nothing here yet'}</p>
      </div>
    `;
    if (countEl) countEl.textContent = '0 results';
    return;
  }

  el.innerHTML = items.map(i => createMovieCard(i, true)).join('');
  if (countEl) {
    countEl.textContent = currentQuery
      ? `Results for "${currentQuery}"`
      : (currentType === 'tv' ? 'Popular TV Shows' : 'Popular Movies');
  }
}

function showLoadingState() {
  const el = document.getElementById('resultsGrid');
  if (el) {
    el.innerHTML = Array(18).fill(
      `<div class="skeleton rounded-lg" style="aspect-ratio:2/3"></div>`
    ).join('');
  }
}

function showError(msg) {
  const el = document.getElementById('resultsGrid');
  if (el) el.innerHTML = `<div class="col-span-full text-center py-16 text-gray-400">${msg}</div>`;
}

function renderPagination() {
  const el = document.getElementById('pagination');
  if (!el || totalPages <= 1) { if (el) el.innerHTML = ''; return; }

  const maxPages = Math.min(totalPages, 20); // TMDB limits to ~500 pages
  const pages = [];

  // Prev
  pages.push(`
    <button onclick="goToPage(${currentPage - 1})" ${currentPage <= 1 ? 'disabled' : ''}
      class="px-3 py-2 rounded-lg ${currentPage <= 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-white/10 hover:text-white'} transition text-sm">
      ← Prev
    </button>
  `);

  // Page numbers
  let start = Math.max(1, currentPage - 2);
  let end   = Math.min(maxPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);

  if (start > 1) pages.push(`<button onclick="goToPage(1)" class="px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 text-sm">1</button>`);
  if (start > 2) pages.push(`<span class="px-2 text-gray-600">…</span>`);

  for (let p = start; p <= end; p++) {
    pages.push(`
      <button onclick="goToPage(${p})"
        class="px-3 py-2 rounded-lg text-sm font-medium transition ${p === currentPage ? 'bg-amber-500 text-gray-900 font-bold' : 'text-gray-300 hover:bg-white/10 hover:text-white'}">
        ${p}
      </button>
    `);
  }

  if (end < maxPages - 1) pages.push(`<span class="px-2 text-gray-600">…</span>`);
  if (end < maxPages) pages.push(`<button onclick="goToPage(${maxPages})" class="px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 text-sm">${maxPages}</button>`);

  // Next
  pages.push(`
    <button onclick="goToPage(${currentPage + 1})" ${currentPage >= maxPages ? 'disabled' : ''}
      class="px-3 py-2 rounded-lg ${currentPage >= maxPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-white/10 hover:text-white'} transition text-sm">
      Next →
    </button>
  `);

  el.innerHTML = `<div class="flex items-center justify-center gap-1 flex-wrap">${pages.join('')}</div>`;
}

function goToPage(page) {
  if (page < 1) return;
  currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateUrl();
  loadResults();
}

function updateUrl() {
  const params = new URLSearchParams();
  if (currentQuery) params.set('q', currentQuery);
  if (currentType !== 'all') params.set('type', currentType);
  if (currentSort !== 'popular') params.set('sort', currentSort);
  if (currentPage > 1) params.set('page', currentPage);
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.pushState({}, '', newUrl);
}

function setFilter(type) {
  currentType = type;
  currentPage = 1;
  updateFilterUI();
  updateUrl();
  loadResults();
}

function updateFilterUI() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const active = btn.dataset.type === currentType;
    btn.classList.toggle('bg-amber-500', active);
    btn.classList.toggle('text-gray-900', active);
    btn.classList.toggle('font-bold', active);
    btn.classList.toggle('bg-white/10', !active);
    btn.classList.toggle('text-gray-300', !active);
  });
}

function handleSearch(e) {
  e.preventDefault();
  const input = document.getElementById('searchInput');
  currentQuery = input?.value?.trim() || '';
  currentPage = 1;
  updateUrl();
  loadResults();
}

document.addEventListener('DOMContentLoaded', initSearchPage);
