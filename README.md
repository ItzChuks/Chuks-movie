# 🎬 CineVault — Free Movie Download Site

A beautiful, fully functional movie site powered by TMDB, built with HTML + CSS + Tailwind + JS.
Deployable to Vercel in minutes — completely free.

---

## 🚀 Quick Start (5 minutes)

### Step 1 — Get a Free TMDB API Key
1. Go to [themoviedb.org/signup](https://www.themoviedb.org/signup) and create a free account
2. Navigate to **Settings → API → Create API Key** (choose "Developer")
3. Fill in the form (it's free, no credit card needed)
4. Copy your **API Key (v3 auth)**

### Step 2 — Add Your API Key
Open `js/config.js` and replace `YOUR_TMDB_API_KEY`:
```js
TMDB_API_KEY: 'paste_your_key_here',
```

### Step 3 — Add Your Site Name (Optional)
In the same `js/config.js` file, change:
```js
SITE_NAME: 'YourSiteName',
SITE_TAGLINE: 'Your tagline here',
```

### Step 4 — Deploy to Vercel
1. Upload this folder to a new [GitHub repository](https://github.com)
2. Go to [vercel.com](https://vercel.com) and sign up free
3. Click **New Project** → Import your GitHub repo
4. Click **Deploy** — done! ✅

Your site will have a free `.vercel.app` domain.

---

## 📥 Adding Download Links

Movie data (posters, descriptions, ratings) comes from TMDB automatically.
For actual download links, you need to add them manually in `js/movie.js`.

Open `js/movie.js` and find the `DOWNLOAD_LINKS` object at the top:

```js
const DOWNLOAD_LINKS = {
  // Format: "TMDB_MOVIE_ID": { "quality": "download_url" }
  
  "12345": {
    "1080p": "https://your-file-host.com/movie_1080p.mp4",
    "720p":  "https://your-file-host.com/movie_720p.mp4",
    "480p":  "https://your-file-host.com/movie_480p.mp4",
  },
  
  "67890": {
    "720p": "https://your-file-host.com/another_movie.mp4",
  },
};
```

**How to find a movie's TMDB ID:**
- Search for the movie on [themoviedb.org](https://www.themoviedb.org)
- The ID is in the URL: `themoviedb.org/movie/12345-movie-title` → ID is `12345`

**Supported quality keys:** `2160p`, `1080p`, `720p`, `480p`, `360p`

---

## 📁 File Structure

```
cinevault/
├── index.html        Homepage with hero, trending, movies, TV
├── movie.html        Movie/TV detail + download page
├── search.html       Search & browse page
├── vercel.json       Vercel deployment config
├── css/
│   └── style.css     Custom styles + design tokens
└── js/
    ├── config.js     ⚙️  API key & site settings (EDIT THIS)
    ├── tmdb.js       TMDB API wrapper
    ├── ui.js         Shared UI components (movie cards, etc.)
    ├── home.js       Homepage logic
    ├── movie.js      Movie detail + download links (EDIT THIS)
    └── search.js     Search & filter logic
```

---

## 🎨 Customization

### Change Site Name / Colors
Edit `js/config.js` for name/tagline.
Edit `css/style.css` → `:root` variables for colors:
```css
:root {
  --bg:      #07070e;   /* Page background */
  --surface: #0f0f1a;   /* Card backgrounds */
  --card:    #161625;   /* Movie cards */
  --accent:  #f0a500;   /* Gold highlight color */
}
```

### Replace Logo
Change the SVG/text in the `<nav>` section of each HTML file.

---

## ✅ Features

- 🎬 Live movie & TV data from TMDB API
- 🔍 Full search with type filters (Movies / TV)
- 🔥 Trending movies hero with auto-carousel
- ⭐ Ratings, genres, cast, trailers
- 📥 Download quality selector (you add the links)
- 📄 Pagination on search results
- 💀 Skeleton loading states
- 📱 Fully responsive (mobile-first)
- ⚡ Fast — pure HTML/JS, no frameworks
- 🆓 Free hosting on Vercel

---

## ⚠️ Legal Note

- TMDB API is free and legal to use for non-commercial sites
- Only add download links to content you legally own or have rights to distribute
- For public domain films, [archive.org](https://archive.org/details/movies) has thousands of free movies
- Respect copyright laws in your country

---

## 🙋 FAQ

**Q: The site shows "Setup Required" — what's wrong?**
A: You need to add your TMDB API key to `js/config.js`.

**Q: Movies show but download button says "not available"?**
A: Add download URLs to `DOWNLOAD_LINKS` in `js/movie.js`.

**Q: Can I use a custom domain?**
A: Yes! In Vercel dashboard → your project → Settings → Domains.

**Q: Is this completely free?**
A: Yes. TMDB API is free, Vercel hosting is free, the code is yours.
