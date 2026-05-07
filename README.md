<img src="assets/logo.svg" alt="Abhey Deep systems stamp logo" width="64">

# Abhey Deep Portfolio

Static portfolio and resume package for Abhey Deep, Senior Full-Stack Software Engineer.

Live portfolio: <https://abheydeep.github.io/portfolio/>

Flagship projects:

- Market Narrative: <https://marketnarrative.in/> / <https://github.com/Abheydeep/marketNews>
- The Win List: <https://www.mywinlist.com/> / <https://github.com/Abheydeep/Habit-Ledger/tree/codex/personalized-onboarding>

## Files

- `index.html` - main portfolio page with MarketNews and The Win List architecture case studies.
- `resume.html` - shareable one-page resume page with a browser print/save-to-PDF action.
- `Abhey-Deep-Resume.pdf` - generated one-page PDF resume for direct sharing.
- `assets/logo.svg` - reusable AD systems stamp used across the site, favicon, and resume.
- `assets/styles.css` - shared portfolio styling.
- `assets/app.js` - mobile navigation, case-file tabs, canvas sketch, and tiny console easter eggs.

## Local Preview

Open `index.html` directly in a browser, or run a tiny static server from this directory:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy

This project has no build step. Deploy the folder as a static site on Vercel, Netlify, GitHub Pages, or any standard web host. Use the repository root as the output directory and leave the build command blank.

For GitHub Pages, the included workflow deploys the repository root on every push to `main`. In the repository settings, set Pages to use GitHub Actions as the source.
