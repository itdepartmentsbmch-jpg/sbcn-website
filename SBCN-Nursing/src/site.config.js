// ============================================================================
// SBCN website – central configuration.
// Edit values here, then run `node build.js`. Every page picks them up.
// Contact details below are as supplied by the nursing college office.
// ============================================================================
module.exports = {
  // VERIFY: final domain (used for canonical URLs, sitemap, Open Graph)
  url: "https://www.sbcn.ac.in",

  name: "Sri Balaji College of Nursing",
  shortName: "SBCN",
  location: "Renigunta, Tirupati",
  tagline: "Excellence in Nursing Education, Caring with Knowledge, Leading with Compassion.",
  foundingYear: "", // e.g. "2024" – leave empty to hide
  parent: "Sri Balaji Medical College, Hospital & Research Institute",
  parentShort: "SBMCH&RI",
  parentUrl: "https://www.sbmch.org",

  // The college office text says "Airport Road"; the building signboard says "New Airport Road".
  address: {
    street: "New Airport Road, Renigunta",
    city: "Tirupati",
    district: "Tirupati",
    state: "Andhra Pradesh",
    pin: "517520",
    country: "IN",
  },
  geo: { lat: 13.63744, lng: 79.531378 },
  mapsUrl: "https://maps.app.goo.gl/cJsxmqetTdKKJB567",

  // Order matters: [0] toll-free, [1] Dean/Principal office, [2] Administrative office are used in the header/footer.
  phones: [
    { label: "Toll-free", value: "1800 425 9999", tel: "18004259999" },
    { label: "Dean / Principal Office", value: "0877 2266700", tel: "+918772266700" },
    { label: "Administrative Office", value: "77999 38881", tel: "+917799938881" },
    { label: "Hospital", value: "0877 2266701", tel: "+918772266701" },
    { label: "Director-HR Office", value: "0877 2226999", tel: "+918772226999" },
    { label: "Director-HR", value: "72050 72030", tel: "+917205072030" },
  ],
  securityPhone: { label: "Security Officer", value: "+91 90000 22344", tel: "+919000022344" },
  whatsapp: "917799938881", // Administrative Office – country code + number, no "+"
  email: "info.sbcnursing@gmail.com",
  library: { phone: "0877 2226999", tel: "+918772226999", email: "library.sbmch@gmail.com" },

  social: {
    instagram: "https://instagram.com/sbmch_tirupati",
    facebook: "https://facebook.com/sbmch.tirupati",
    linkedin: "https://linkedin.com/company/sbmch-tirupati",
    youtube: "",
  },

  university: "Dr. NTR University of Health Sciences, Vijayawada",
  universityShort: "Dr. NTRUHS",

  admissionYear: "2026-27",
  calendarYear: "2025-26",
  // Put the PDF at src/assets/docs/academic-calendar.pdf and the download link appears automatically.
  calendarFile: "assets/docs/academic-calendar.pdf",

  // Google Analytics 4 / Search Console – fill in to enable
  ga4: "", // e.g. "G-XXXXXXXXXX"
  googleVerification: "", // content value of google-site-verification meta
};
