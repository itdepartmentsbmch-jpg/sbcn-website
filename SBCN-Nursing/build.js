#!/usr/bin/env node
// Zero-dependency static site builder for the SBCN website.
//   node build.js          -> builds into ./public
//   node build.js --serve  -> builds and serves http://localhost:8080
//
// Each page in src/pages/*.html starts with a JSON front-matter comment:
//   <!--{ "title": "...", "description": "...", "nav": "about", ... }-->
// Tokens like {{phone}}, {{email}}, {{name}} are replaced from src/site.config.js.

const fs = require("fs");
const path = require("path");
const site = require("./src/site.config.js");

const SRC = path.join(__dirname, "src");
const OUT = path.join(__dirname, "public");
const today = new Date().toISOString().slice(0, 10);

/* ---------------------------------------------------------------- helpers */
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p = "") => site.url.replace(/\/$/, "") + "/" + p.replace(/^\//, "").replace(/index\.html$/, "");
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} – ${site.address.pin}`;

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, f.name), d = path.join(to, f.name);
    if (f.isDirectory()) copyDir(s, d);
    else if (!/original/.test(f.name)) fs.copyFileSync(s, d);
  }
}

/* ------------------------------------------------------------- navigation */
const NAV = [
  { id: "home", label: "Home", href: "index.html" },
  {
    id: "about", label: "About", children: [
      ["About the College", "about.html"],
      ["Vision, Mission & Quality Policy", "about.html#vision"],
      ["Affiliations & Approvals", "about.html#affiliations"],
      ["Services", "services.html"],
    ],
  },
  {
    id: "academics", label: "Academics", children: [
      ["B.Sc Nursing", "courses.html"],
      ["Curriculum & Examinations", "academics.html"],
      ["Academic Calendar", "academics.html#calendar"],
      ["Departments", "departments.html"],
    ],
  },
  { id: "admissions", label: "Admissions", href: "admissions.html" },
  {
    id: "campus", label: "Campus", children: [
      ["Facilities & Labs", "facilities.html"],
      ["Clinical Training", "facilities.html#clinical"],
      ["Library", "library.html"],
      ["Hostel & Canteen", "facilities.html#hostel"],
      ["Security & Anti-Ragging", "facilities.html#security"],
      ["Gallery", "gallery.html"],
    ],
  },
  { id: "disclosure", label: "Disclosure", href: "mandatory-disclosure.html" },
  { id: "contact", label: "Contact", href: "contact.html" },
];

function renderNav(active) {
  return NAV.map((n) => {
    const cur = n.id === active ? ' aria-current="page"' : "";
    if (!n.children) return `<li><a href="${n.href}"${cur}>${n.label}</a></li>`;
    return `<li><button type="button" aria-expanded="false"${cur}>${n.label} ${icon("chevron-down")}</button>
        <ul class="sub">${n.children.map(([l, h]) => `<li><a href="${h}">${esc(l)}</a></li>`).join("")}</ul></li>`;
  }).join("\n        ");
}

/* ---------------------------------------------------------------- sprite */
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
<symbol id="i-chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
<symbol id="i-whatsapp" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.59-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4A9.87 9.87 0 0 1 7.02 20.4l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.89 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41z"/></symbol>
</defs></svg>`;

/* ---------------------------------------------------------------- schema */
function orgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["CollegeOrUniversity", "EducationalOrganization"],
    "@id": abs() + "#organization",
    name: site.name,
    alternateName: [site.shortName, `${site.shortName} Renigunta`, "SBCN Tirupati"],
    url: abs(),
    logo: abs("assets/img/logo-512.png"),
    image: abs("assets/img/og-image.jpg"),
    description: `${site.name}, ${site.location} a unit of Sri Balaji Medical College, Hospital & Research Institute, offers the 4-year B.Sc Nursing programme (INC 2021 syllabus) with clinical training in a 715-bed parent hospital. Recognised by INC and APNMC, affiliated to Dr. NTR University of Health Sciences.`,
    slogan: site.tagline,
    email: site.email,
    telephone: site.phones[0].tel,
    ...(site.foundingYear ? { foundingDate: site.foundingYear } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.pin,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    parentOrganization: { "@type": "CollegeOrUniversity", name: site.parent, url: site.parentUrl },
    memberOf: { "@type": "CollegeOrUniversity", name: site.university },
    contactPoint: site.phones.map((p) => ({ "@type": "ContactPoint", telephone: p.tel, contactType: p.label, areaServed: "IN", availableLanguage: ["English", "Telugu", "Hindi"] })),
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

function breadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: abs(c.href) })),
  };
}

/* ---------------------------------------------------------------- layout */
function layout(meta, body, file) {
  const canonical = abs(file);
  const title = meta.title.includes(site.shortName) ? meta.title : `${meta.title} | ${site.shortName} Renigunta`;
  const crumbs = meta.breadcrumb ? [{ label: "Home", href: "index.html" }, ...meta.breadcrumb] : null;
  const schemas = [orgSchema(), ...(crumbs ? [breadcrumbSchema(crumbs)] : []), ...(meta.schema || [])];
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hello, I would like to know about nursing admissions ${site.admissionYear} at SBCN.`)}`;
  const socials = [["instagram", "Instagram"], ["facebook", "Facebook"], ["linkedin", "LinkedIn"], ["youtube", "YouTube"]]
    .filter(([k]) => site.social[k])
    .map(([k, l]) => `<a href="${site.social[k]}" target="_blank" rel="noopener">${l}</a>`).join("");

  const pagehead = crumbs ? `
<header class="pagehead">
  <div class="wrap">
    <nav aria-label="Breadcrumb"><ol class="crumbs">${crumbs.map((c, i) => i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.label)}</li>` : `<li><a href="${c.href}">${esc(c.label)}</a></li>`).join("")}</ol></nav>
    <h1>${meta.h1 || esc(meta.title)}</h1>
    ${meta.intro ? `<p>${meta.intro}</p>` : ""}
  </div>
</header>` : "";

  const latest = [
    `Admissions open for B.Sc Nursing ${site.admissionYear}: through NEET / as per ${site.universityShort} guidelines. <a href="admissions.html">Admission details</a>`,
    `Clinical training in the 715-bed parent hospital, Sri Balaji Medical College, Hospital &amp; Research Institute.`,
    `Admission enquiries: toll-free <a href="tel:${site.phones[0].tel}">${site.phones[0].value}</a> · Administrative Office <a href="tel:${site.phones[2].tel}">${site.phones[2].value}</a>`,
  ];

  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta.description)}">
${meta.keywords ? `<meta name="keywords" content="${esc(meta.keywords)}">` : ""}
<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#80005b">
<meta name="author" content="${esc(site.name)}">
<meta name="geo.region" content="IN-AP">
<meta name="geo.placename" content="Renigunta, Tirupati">
<meta name="geo.position" content="${site.geo.lat};${site.geo.lng}">
<meta name="ICBM" content="${site.geo.lat}, ${site.geo.lng}">
${site.googleVerification ? `<meta name="google-site-verification" content="${site.googleVerification}">` : ""}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs("assets/img/og-image.jpg")}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(meta.description)}">
<meta name="twitter:image" content="${abs("assets/img/og-image.jpg")}">
<link rel="icon" type="image/png" sizes="32x32" href="assets/img/logo-32.png">
<link rel="apple-touch-icon" href="assets/img/logo-180.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap">
<link rel="stylesheet" href="assets/css/style.css">
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
${site.ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.ga4}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.ga4}');</script>` : ""}
</head>
<body data-whatsapp="${site.whatsapp}">
${SPRITE}
<a class="skip-link" href="#main">Skip to content</a>

<div class="util">
  <div class="wrap">
    <div class="util__l">
      <a href="tel:${site.phones[0].tel}">Toll-free ${site.phones[0].value}</a>
      <a href="mailto:${site.email}">${site.email}</a>
    </div>
    <div class="util__r">
      <a href="mandatory-disclosure.html">INC Mandatory Disclosure</a>
      <a href="${site.parentUrl}" target="_blank" rel="noopener">Sri Balaji Medical College</a>
      <a href="contact.html">Contact</a>
    </div>
  </div>
</div>

<header class="site-header">
<div class="masthead">
  <div class="wrap">
    <a class="crest" href="index.html">
      <img src="assets/img/logos/sbcn.avif" width="76" height="76" alt="SBCN logo">
      <span><span class="crest__name">${site.name}</span><span class="crest__sub">Renigunta, Tirupati &nbsp;·&nbsp; Affiliated to ${site.university}</span></span>
    </a>
    <div class="masthead__aside">
      <div class="mh-contact">Administrative Office<strong><a href="tel:${site.phones[2].tel}">${site.phones[2].value}</a></strong></div>
      <div class="mh-contact">Dean / Principal Office<strong><a href="tel:${site.phones[1].tel}">${site.phones[1].value}</a></strong></div>
    </div>
  </div>
</div>

<nav class="mainnav" aria-label="Main">
  <div class="wrap">
    <button class="navtoggle" type="button" aria-expanded="false">${icon("menu")} Menu</button>
    <ul class="menu">
        ${renderNav(meta.nav)}
    </ul>
    <div class="mainnav__apply"><a href="admissions.html">Apply ${site.admissionYear}</a></div>
  </div>
</nav>
</header>

${meta.latest === false ? "" : `<div class="latest" role="region" aria-label="Latest updates">
  <div class="wrap">
    <span class="latest__label">Latest</span>
    <div class="latest__track"><ul class="latest__list">${[...latest, ...latest].map((t, i) => `<li${i >= latest.length ? ' aria-hidden="true"' : ""}>${t}</li>`).join("")}</ul></div>
  </div>
</div>`}

<main id="main">
${pagehead}
${body}
</main>

<footer class="footer">
  <div class="wrap">
    <div class="footer__top">
      <div>
        <div class="footer__crest"><img src="assets/img/logos/sbcn.avif" width="60" height="60" alt="" loading="lazy"><b>${site.name}</b></div>
        <p>${site.tagline}</p>
        <p>A unit of ${site.parent}. Recognised by INC &amp; APNMC, affiliated to ${site.university}.</p>
        <div class="footer__social">${socials}</div>
      </div>
      <div>
        <h2>The College</h2>
        <ul>
          <li><a href="about.html">About SBCN</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="departments.html">Departments</a></li>
          <li><a href="facilities.html">Facilities</a></li>
          <li><a href="library.html">Library</a></li>
          <li><a href="gallery.html">Gallery</a></li>
          <li><a href="mandatory-disclosure.html">Mandatory Disclosure</a></li>
        </ul>
      </div>
      <div>
        <h2>Academics</h2>
        <ul>
          <li><a href="courses.html">B.Sc Nursing</a></li>
          <li><a href="academics.html">Curriculum &amp; Examinations</a></li>
          <li><a href="academics.html#calendar">Academic Calendar</a></li>
          <li><a href="admissions.html">Admissions ${site.admissionYear}</a></li>
          <li><a href="facilities.html#security">Anti-Ragging</a></li>
        </ul>
      </div>
      <div>
        <h2>Contact</h2>
        <address>
          ${site.name}<br>${site.address.street},<br>${site.address.city}, ${site.address.state} – ${site.address.pin}
        </address>
        <ul style="margin-top:12px">
          ${site.phones.slice(0, 4).map((p) => `<li>${p.label}: <a href="tel:${p.tel}">${p.value}</a></li>`).join("\n          ")}
          <li><a href="mailto:${site.email}">${site.email}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© ${new Date().getFullYear()} ${site.name}, Renigunta</span>
      <span><a href="${site.parentUrl}" target="_blank" rel="noopener">Sri Balaji Medical College, Hospital &amp; Research Institute</a></span>
    </div>
  </div>
</footer>

<a class="wa" href="${wa}" target="_blank" rel="noopener" aria-label="Chat with admissions on WhatsApp">${icon("whatsapp")}</a>

<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ build */
function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  copyDir(path.join(SRC, "assets"), path.join(OUT, "assets"));

  const calendarExists = fs.existsSync(path.join(SRC, site.calendarFile));
  const tokens = {
    name: site.name, shortName: site.shortName, email: site.email, address: fullAddress, tagline: site.tagline,
    phone: site.phones[0].value, phoneTel: site.phones[0].tel,
    phone2: site.phones[1].value, phone2Tel: site.phones[1].tel,
    phone3: site.phones[2].value, phone3Tel: site.phones[2].tel,
    phoneList: site.phones.map((p) => `<div><dt>${p.label}</dt><dd><a href="tel:${p.tel}">${p.value}</a></dd></div>`).join("\n          "),
    securityPhone: site.securityPhone.value, securityTel: site.securityPhone.tel,
    libraryPhone: site.library.phone, libraryTel: site.library.tel, libraryEmail: site.library.email,
    whatsapp: site.whatsapp, year: site.admissionYear, calendarYear: site.calendarYear,
    calendarLink: calendarExists
      ? `<a class="btn btn-plum" href="${site.calendarFile}" download>Download Academic Calendar ${site.calendarYear} (PDF)</a>`
      : `<span class="tbd">Academic Calendar ${site.calendarYear} will be available for download shortly.</span>`,
    university: site.university, universityShort: site.universityShort,
    parent: site.parent, parentShort: site.parentShort, parentUrl: site.parentUrl, url: abs(), mapsUrl: site.mapsUrl, lat: site.geo.lat, lng: site.geo.lng,
  };
  tokens.contactPanel = `<div class="aside-box contact-panel">
          <h3>Admission enquiries</h3>
          <p>Call, WhatsApp or email the college for eligibility, NEET counselling, hostels and scholarships.</p>
          <dl class="contact-dl">
            <div><dt>Toll-free</dt><dd><a href="tel:${site.phones[0].tel}">${site.phones[0].value}</a></dd></div>
            <div><dt>Administrative Office</dt><dd><a href="tel:${site.phones[2].tel}">${site.phones[2].value}</a></dd></div>
            <div><dt>Dean / Principal Office</dt><dd><a href="tel:${site.phones[1].tel}">${site.phones[1].value}</a></dd></div>
            <div><dt>Email</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div>
          </dl>
          <div class="btns">
            <a class="btn btn-plum" href="tel:${site.phones[0].tel}">Call toll-free</a>
            <a class="btn btn-line" href="https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hello, I would like to know about B.Sc Nursing admissions " + site.admissionYear + " at SBCN.")}" target="_blank" rel="noopener">WhatsApp</a>
          </div>
        </div>`;
  const fill = (s, skip) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in tokens && k !== skip ? tokens[k] : `{{${k}}}`));

  const pages = fs.readdirSync(path.join(SRC, "pages")).filter((f) => f.endsWith(".html"));
  const sitemap = [];
  for (const file of pages) {
    const raw = fs.readFileSync(path.join(SRC, "pages", file), "utf8");
    const m = raw.match(/^<!--([\s\S]*?)-->/);
    if (!m) throw new Error(`${file}: missing front-matter comment`);
    const meta = JSON.parse(fill(m[1]));
    const body = fill(raw.slice(m[0].length));
    // FAQ schema auto-generated from the FAQ accordions
    const faqs = [...body.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<div>([\s\S]*?)<\/div>\s*<\/details>/g)];
    if (faqs.length) {
      meta.schema = meta.schema || [];
      meta.schema.push({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map(([, q, a]) => ({ "@type": "Question", name: q.replace(/<[^>]+>/g, "").trim(), acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() } })),
      });
    }
    fs.writeFileSync(path.join(OUT, file), layout(meta, body, file));
    if (!meta.noindex) sitemap.push({ loc: abs(file), priority: meta.priority || "0.7" });
    console.log("  built", file);
  }

  fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.sort((a, b) => b.priority - a.priority).map((s) => `  <url><loc>${s.loc}</loc><lastmod>${today}</lastmod><priority>${s.priority}</priority></url>`).join("\n")}
</urlset>
`);
  fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${abs("sitemap.xml")}\n`);
  fs.writeFileSync(path.join(OUT, "site.webmanifest"), JSON.stringify({
    name: site.name, short_name: site.shortName, start_url: "./index.html", display: "standalone",
    background_color: "#faf6f8", theme_color: "#80005b",
    icons: [{ src: "assets/img/logo-192.png", sizes: "192x192", type: "image/png" }, { src: "assets/img/logo-512.png", sizes: "512x512", type: "image/png" }],
  }, null, 2));
  fs.writeFileSync(path.join(OUT, ".htaccess"), `# Apache: custom 404, compression & caching
AddType image/avif .avif
ErrorDocument 404 /404.html
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/json
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/png "access plus 6 months"
  ExpiresByType image/jpeg "access plus 6 months"
  ExpiresByType image/webp "access plus 6 months"
  ExpiresByType image/avif "access plus 6 months"
</IfModule>
`);
  console.log(`Done → ${path.relative(process.cwd(), OUT) || "."} (${pages.length} pages)`);
}

build();

if (process.argv.includes("--serve")) {
  const http = require("http");
  const types = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json", ".webp": "image/webp", ".avif": "image/avif", ".pdf": "application/pdf" };
  http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    const f = path.join(OUT, path.normalize(p).replace(/^(\.\.[/\\])+/, ""));
    fs.readFile(f, (err, data) => {
      if (err) { res.writeHead(404, { "Content-Type": "text/html" }); return res.end(fs.readFileSync(path.join(OUT, "404.html"))); }
      res.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" });
      res.end(data);
    });
  }).listen(8080, () => console.log("Serving on http://localhost:8080"));
}
