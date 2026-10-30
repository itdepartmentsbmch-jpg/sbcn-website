/* SBCN – small amount of site behaviour, no libraries */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Sticky header: shrink the masthead once the page is scrolled.
     Two thresholds (hysteresis) stop it flickering at the boundary. */
  var header = $(".site-header");
  if (header) {
    var compact = false;
    var onScroll = function () {
      var y = window.scrollY;
      if (!compact && y > 140) { compact = true; header.classList.add("is-compact"); }
      else if (compact && y < 40) { compact = false; header.classList.remove("is-compact"); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mobile menu */
  var nav = $(".mainnav");
  var toggle = $(".navtoggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  $$(".menu > li > button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.parentElement;
      var open = !li.classList.contains("is-open");
      $$(".menu > li.is-open").forEach(function (o) { o.classList.remove("is-open"); o.firstElementChild.setAttribute("aria-expanded", "false"); });
      li.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* Course tabs (with deep links like courses.html#msc-nursing) */
  var tabs = $$(".tabs [role=tab]");
  function selectTab(btn) {
    tabs.forEach(function (b) {
      b.setAttribute("aria-selected", String(b === btn));
      document.getElementById(b.getAttribute("aria-controls")).hidden = b !== btn;
    });
  }
  tabs.forEach(function (b) { b.addEventListener("click", function () { selectTab(b); history.replaceState(null, "", "#" + b.dataset.slug); }); });
  function tabFromHash() {
    var slug = location.hash.slice(1);
    var b = tabs.filter(function (t) { return t.dataset.slug === slug; })[0];
    if (b) { selectTab(b); $(".tabs").scrollIntoView(); }
  }
  if (tabs.length) { tabFromHash(); window.addEventListener("hashchange", tabFromHash); }

  /* Gallery lightbox */
  var lb = $(".lightbox");
  if (lb) {
    var lbImg = $("img", lb), lbCap = $("p", lb);
    var close = function () { lb.classList.remove("is-open"); };
    $$(".gallery button").forEach(function (b) {
      b.addEventListener("click", function () {
        var img = $("img", b);
        lbImg.src = img.dataset.full || img.src; lbImg.alt = img.alt;
        lbCap.textContent = b.parentElement.querySelector("figcaption").textContent;
        lb.classList.add("is-open"); $(".lightbox__close", lb).focus();
      });
    });
    $(".lightbox__close", lb).addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

})();
