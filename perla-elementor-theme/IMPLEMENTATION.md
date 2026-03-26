# Perla Desjardins — Elementor theme implementation

This theme replicates the static site design (beige/cream, Cormorant Garamond + Outfit, header, footer, brand logos) and is intended to be used with **Elementor** for page content.

---

## If you’ve already been messing with the site (multiple themes, extra pages)

Don’t worry — you can straighten things out without losing your site. Do this in order:

### Step A: Get the theme in place

1. **Copy the theme**  
   Copy the **perla-elementor-theme** folder from your project into WordPress:
   - **Local:** `Local Sites` → your site → right‑click **Go to site folder** (or similar) → open `app/public/wp-content/themes/` and paste **perla-elementor-theme** there.
   - **Live host:** Use FTP or File Manager to go to `wp-content/themes/` and upload the **perla-elementor-theme** folder.

2. **Activate this theme only**  
   - WP Admin → **Appearance → Themes**.  
   - Find **Perla Desjardins (Elementor)** and click **Activate**.  
   - Having multiple themes is fine; only the active one is used.

### Step B: Clean up pages (optional but helpful)

You might have duplicate or test pages. You don’t have to delete anything — just decide which page is “Home” and which others you’ll use.

1. Go to **Pages → All Pages**.
2. **Find or create a Home page:**
   - If you already have a page you want as the main homepage (e.g. “Home” or “Perla”), note its name. You’ll set it as the front page in Step C.
   - If you don’t, click **Add New**, title it **Home**, publish it. You can leave content empty and build it later with Elementor.
3. **Other pages you need:** About, Gallery, Services, Work with me, Privacy Policy, FAQ.  
   - If some exist with different names (e.g. “About Me”), keep them and use them.  
   - If you have duplicates (e.g. “Home”, “Home 2”), you can trash the extras later or leave them; only the page you set as the front page will show as the homepage.
4. **Slugs (URLs):** When editing a page, set the **Permalink** (e.g. `yoursite.com/about`). Use **Edit** next to the URL and set `about`, `gallery`, `services`, `work-with-me`, `privacy-policy`, `faq` so links match the static site. Not required, but keeps things consistent.

### Step C: Set the homepage

1. Go to **Settings → Reading**.
2. Under **Your homepage displays**, choose **A static page**.
3. **Homepage:** choose the page you want as the main landing page (e.g. **Home**).
4. **Posts page:** leave blank (unless you want a blog).
5. Click **Save Changes**.  
   Visiting your site’s root URL will now show that page.

### Step D: Set the menus

1. Go to **Appearance → Menus**.
2. **Header (primary) menu:**
   - If you already have a menu, select it. Otherwise click **create a new menu**, name it e.g. **Primary**, and save.
   - Add: **Home**, **About**, **Gallery**, **Services**, **Work with me** (from Pages or Custom Links).
   - Add **Shop** as a **Custom Link**: URL `https://linktr.ee/perladesjardins#collection-47b9d1f6-8636-4691-8537-333f3510b69c`, Link Text **Shop**, Add to Menu.
   - At the bottom, check **Primary (header)** (or whatever your theme calls the header), then **Save Menu**.
3. **Footer menu:**
   - Create or select a menu (e.g. **Footer**). Add **About**, **Gallery**, **Services**, **Work with me**.
   - Check **Footer** for display location, **Save Menu**.

If you don’t assign menus, the theme still shows a fallback (Home + pages + Shop in the header).

### Step E: Build or fix content

- Open the **Home** page and click **Edit with Elementor**. Build the hero, reels, blurb, etc., or paste content from the static site.
- Do the same for About, Gallery, Services, Work with me, and the legal pages.  
- Header and footer (logo, nav, socials, copyright) come from the theme and menus — you don’t re-add them on each page.

### If something looks wrong

- **Wrong theme showing:** Under **Appearance → Themes**, make sure **Perla Desjardins (Elementor)** is the only **Active** theme.
- **Homepage shows posts or wrong page:** Re-check **Settings → Reading** and the **Homepage** dropdown.
- **Menu missing in header/footer:** In **Appearance → Menus**, confirm the menu is assigned to **Primary (header)** and **Footer**.
- **No “Edit with Elementor”:** Install **Elementor** from **Plugins → Add New**, activate it, then use **Edit with Elementor** on a page.

---

## 1. Install the theme (fresh start)

- Copy the theme folder **perla-elementor-theme** into your WordPress themes directory:
  - **Local by Flywheel:**  
    `Local Sites/<site>/app/public/wp-content/themes/`
  - **Other:**  
    `wp-content/themes/`
- In **Appearance → Themes**, activate **Perla Desjardins (Elementor)**.
- Install and activate **Elementor** (and optionally **Elementor Pro**) if you haven’t already.

## 2. Create pages

Create these pages (titles and slugs can match the static site for consistency):

| Page title   | Slug (optional)  | Purpose                    |
|-------------|------------------|----------------------------|
| Home        | `home` or leave default | Front page             |
| About       | `about`          | About me                   |
| Gallery     | `gallery`         | Gallery                    |
| Services    | `services`        | Services                   |
| Work with me| `work-with-me`   | Contact / collaborations   |
| Privacy Policy | `privacy-policy` | Legal                      |
| FAQ         | `faq`            | FAQ                        |

- **Settings → Reading:** set “Your homepage displays” to **A static page** and choose **Home** as the Homepage.
- Leave “Posts page” blank unless you want a blog.

## 3. Menus

- **Appearance → Menus**
- Create a **Primary** menu and assign it to **Primary (header)**:
  - Add: Home, About, Gallery, Services, Work with me.
  - Add a **Custom Link** for Shop:  
    URL: `https://linktr.ee/perladesjardins#collection-47b9d1f6-8636-4691-8537-333f3510b69c`, Label: Shop.
- Create a **Footer** menu and assign it to **Footer**:
  - About, Gallery, Services, Work with me (or a subset).
- If you don’t assign menus, the theme uses a fallback (Home + all top-level pages + Shop in the header; default footer links).

## 4. Content: Elementor vs paste

- **Option A — Build with Elementor**  
  Edit each page with Elementor and recreate sections (hero, blurb, reels, quick links, etc.) using the theme’s existing CSS classes where needed (e.g. `hero`, `container`, `btn`).  
  Theme assets (images, CSS) are in the theme; reference them as below.

- **Option B — Paste static HTML**  
  Copy the inner content (sections only, no header/footer) from each static HTML file into the WordPress editor or an Elementor HTML widget. Update image paths to the theme or Media Library URLs (see below).

## 5. Images and assets

- **Theme assets** (no upload needed):  
  `perla-elementor-theme/assets/images/`  
  - `hm.svg`, `moxies.svg`, `dandurand.svg`, `dji.svg` — brand logos (e.g. “Select collaborations”).  
  - `hero-portrait.png` — hero portrait (if present).

- **In Elementor or content:**  
  - Use **Media Library** for images you upload (hero, gallery, etc.).  
  - For theme images (e.g. brand logos), use the theme URL in an Image widget or HTML:  
    `<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/hm.svg`  
    (Only works in a PHP/code widget or a shortcode; in Elementor use the full URL to the theme image, e.g.  
    `https://yoursite.com/wp-content/themes/perla-elementor-theme/assets/images/hm.svg`  
    or upload the SVGs to Media Library and use those.)

- **Hero portrait:**  
  Either place `hero-portrait.png` in `assets/images/` and reference it from your Home layout, or upload a hero image in Media Library and use it in the Elementor section for the hero.

## 6. Design notes

- **Fonts:** Cormorant Garamond + Outfit are loaded by the theme from Google Fonts.
- **Header / footer:** Same structure and styling as the static site (fixed header, footer nav, legal links, socials: Instagram, TikTok, YouTube, Linktree).
- **Shop link:** Point the main nav “Shop” to your Linktree shop collection URL (see step 3).
- **Reels (Home):** The static site uses Instagram embed blocks. On the WordPress front page you can paste the same embed markup into an HTML or Code widget, or use an Elementor embed/shortcode; the theme enqueues the Instagram embed script on the front page.

## 7. Optional: screenshot

To show a preview in **Appearance → Themes**, add a **screenshot.png** (1200×900 px recommended) to the theme root:  
`perla-elementor-theme/screenshot.png`.

---

**Summary:** Activate the theme, set a static Home page, create the pages and menus, then build or paste content with Elementor. Use theme assets from `assets/images/` or Media Library; header/footer and global styles are handled by the theme.
