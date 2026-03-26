# Perla Desjardins — UGC Creator Portfolio

Static website for Perla’s UGC portfolio. Clean, minimal design (beige, cream, light neutrals).

## What’s included

- **Home** — Split hero (name, tagline, “Get in touch”), reels CTA to Instagram, quick links
- **About** — Short intro (placeholder copy to personalize)
- **Gallery** — Photos + Videos tabs with placeholders; add your images/videos when ready
- **Services** — UGC services (reels, static, unboxings, custom packages)
- **Work with me** — Contact form + email, location, Instagram

## How to run it locally

1. Open the folder in Cursor or any editor.
2. **Option A:** Right-click `index.html` → “Open with Live Server” (VS Code/Cursor) or open in a browser.
3. **Option B:** From terminal:  
   `cd perla-desjardins-website`  
   `npx serve .`  
   Then open http://localhost:3000 (or the URL shown).

## What to add / edit

- **Hero portrait:** Add `images/hero-portrait.jpg`. In `index.html`, set the hero image to:  
  `src="images/hero-portrait.jpg"` (it’s currently empty so the placeholder shows).
- **About:** Edit the paragraphs in `about.html` with Perla’s real bio and interests.
- **Gallery:** Replace the placeholder `.gallery-item` divs in `gallery.html` with `<img src="images/gallery/1.jpg" alt="...">` or `<video src="videos/1.mp4" controls poster="...">` as needed.
- **Contact:** In `work-with-me.html` update:
  - Email to the real collab address (e.g. `collabs@perladesjardins.com`)
  - Location (city/region)
  - Form: connect to Formspree, Netlify Forms, or your own backend (see comment in the form script).

## Instagram reels

- The “See my reels” block links to [@perla.desjardins](https://www.instagram.com/perla.desjardins/) so views happen on Instagram.
- To embed specific reels on the site: on Instagram go to the post → ⋯ → **Embed**. Copy the code and paste it into the `#reels-embed` div in `index.html` (replace or add to the placeholder text).

## Domain and hosting

- **Domain:** Something like `perladesjardins.com` is ideal. Buy from Namecheap, Google Domains, Cloudflare, or your host. For “collabs@perladesjardins.com” you’ll set up email (e.g. Google Workspace, Zoho, or your host’s email).
- **Hosting:** Any static host works: Netlify, Vercel, GitHub Pages, or your current host. Upload this folder or connect the repo; point the domain in the host’s DNS settings.

## Moving this into WordPress + Elementor

When you’re ready to move to WordPress + Elementor:

1. Use this site as the design reference (layout, colors, copy).
2. In Elementor, set **Site Settings** → Colors & Typography to match (cream, beige, DM Sans / Outfit).
3. Recreate the home page: split hero, then reels CTA, then quick-link cards.
4. Recreate About, Gallery, Services, and Work with me using the same structure and copy from these HTML files.

---

Built for Perla Desjardins. Update copy, images, and links as needed.
