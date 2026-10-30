# SBCN Website – Sri Balaji College of Nursing, Renigunta

Static, SEO-optimised website. No frameworks and no npm packages. You only need Node.js to build it.

## Build & preview

```bash
node build.js            # generates the site into ./public
node build.js --serve    # builds + previews at http://localhost:8080
```

To deploy, upload the **contents of `public/`** to any web host (cPanel/Apache, Nginx, Netlify, GitHub Pages, Cloudflare Pages).

## Where to edit

| What | File |
|---|---|
| Phone numbers, email, WhatsApp, domain, socials, GA4, Search Console | `src/site.config.js` |
| Page content | `src/pages/*.html` (JSON at top = SEO title/description/keywords) |
| Header, footer, menu, SEO meta tags, schema | `build.js` |
| Design (colours, fonts, layout) | `src/assets/css/style.css` |
| Interactions (menu, tabs, gallery, forms) | `src/assets/js/main.js` |
| Images (AVIF) | `src/assets/img/photos/` and `src/assets/img/logos/` |

Tokens such as `{{phone}}`, `{{email}}`, and `{{year}}` are filled in at build time.

## Images

- Save all page images as **AVIF** in `src/assets/img/photos/` (photos) or `src/assets/img/logos/` (emblems). Never put them in `public/`: that folder is deleted and rebuilt every time you run `node build.js`.
- Exceptions, kept as PNG/JPG for compatibility: browser icons (`logo-32/180/192/512.png`) and the social-sharing image (`og-image.jpg`). WhatsApp and Facebook do not reliably show AVIF previews.
- Free converter: https://squoosh.app (choose AVIF, quality 50-60, width up to 1800px).

## Before going live – checklist

- [ ] Set the real **domain** in `site.config.js` (`url`). Canonical URLs, sitemap and OG tags all depend on it.
- [ ] Upload the **Academic Calendar PDF** as `src/assets/docs/academic-calendar.pdf`. The download button appears automatically on the Academics and Disclosure pages.
- [ ] Add the **Principal's name** (Disclosure page) and, if wanted, a Principal's message on `about.html`.
- [ ] Fill every "To be updated" on `mandatory-disclosure.html` (intake, approvals, faculty) and upload the PDFs.
- [ ] Add nursing-specific photos (skill labs, lamp-lighting ceremony, clinical postings) and the Principal's photo on `about.html`.
- [ ] Add a GA4 ID and a Google Search Console verification code, then submit `sitemap.xml` in Search Console.
- [ ] Create or claim a **Google Business Profile** for "Sri Balaji College of Nursing, Renigunta". This is the biggest local-SEO win.

## Design

Source Serif 4 (headings) and Source Sans 3 (text). Colours come from the logo: plum #80005B, magenta #D31984 and warm black. Square corners, hairline rules, real campus photography and no decorative animation. All colours are CSS variables at the top of `src/assets/css/style.css`.

## SEO features included

- Unique title, meta description, keywords and canonical on every page
- Open Graph and Twitter cards (1200×630 OG image)
- JSON-LD: `CollegeOrUniversity` (with address, geo, contact points, parent org), `BreadcrumbList`, `Course` list, and an auto-generated `FAQPage` from any FAQ accordion
- `sitemap.xml`, `robots.txt`, a web manifest, and `.htaccess` (404, gzip, caching)
- Semantic HTML: one H1 per page, breadcrumbs, landmarks, and accessible labels
- Fast: no JS framework, lazy-loaded images and map, optimised logos
- Local-SEO keywords: Tirupati, Renigunta, Andhra Pradesh, and the nursing course names
