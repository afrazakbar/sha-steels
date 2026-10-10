/*
 * SHA STEELS - shared site behaviour
 * Header/footer injection, navigation, WhatsApp helper, Maps links,
 * data-driven product rendering. No external dependencies.
 */
(function () {
  "use strict";
  var CFG = window.SHA_CONFIG || {};
  var DATA = window.SHA_PRODUCTS || { categories: [], brands: [] };
  var MAP = CFG.MAP || {};
  var T = function (k) { return window.ShaLang.t(k); };

  /* ---------- inline icons (Lucide-style, simple SVG) ---------- */
  var ICONS = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l1.9-5.4A8.4 8.4 0 1 1 21 11.5z"/>',
    layers: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>',
    send: '<path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    nav: '<path d="m3 11 19-9-9 19-2-8-8-2z"/>'
  };
  function icon(name, size) {
    var s = size || 24;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || "") + "</svg>";
  }
  var WA_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 0 1 0 16.2 8 8 0 0 1-4.13-1.14l-.3-.18-3.1.82.83-3.02-.2-.31A8.1 8.1 0 0 1 12.04 3.8zm-3.2 4.3c-.17 0-.45.06-.69.32-.24.26-.9.88-.9 2.15s.92 2.5 1.05 2.67c.13.17 1.8 2.86 4.45 3.9 2.2.87 2.65.7 3.13.65.48-.04 1.54-.63 1.76-1.24.22-.6.22-1.13.15-1.24-.06-.1-.24-.17-.5-.3-.27-.13-1.57-.78-1.82-.87-.24-.09-.42-.13-.6.13-.17.26-.68.87-.84 1.04-.15.17-.3.2-.57.07-.26-.13-1.1-.4-2.1-1.3-.77-.7-1.3-1.55-1.45-1.82-.15-.26-.02-.4.11-.53.12-.12.26-.3.4-.46.13-.15.17-.26.26-.44.09-.17.04-.33-.02-.46-.07-.13-.6-1.43-.82-1.95-.2-.5-.42-.43-.6-.44h-.5z"/></svg>';
  var LOGO_SVG = '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="6" fill="#F47721"/><path d="M8 14h24M8 20h24M8 26h24" stroke="#202326" stroke-width="3.2" stroke-linecap="round"/><path d="M14 14v12M20 14v12M26 14v12" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".85"/></svg>';

  /* ---------- helpers ---------- */
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function safeBrand(name) {
    // Accept only exact catalogue brand names (whitelist)
    for (var i = 0; i < DATA.brands.length; i++) if (DATA.brands[i].name === name) return DATA.brands[i];
    return null;
  }
  function currentPage() {
    var p = location.pathname.split("/").pop() || "index.html";
    return p === "" ? "index.html" : p;
  }
  function setExternal(a) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer"); }

  /* ---------- WhatsApp helper (shared by whole site) ---------- */
  var WA = {
    number: String(CFG.WHATSAPP_NUMBER || "").replace(/[^0-9]/g, ""),
    isConfigured: function () { return /^[0-9]{8,15}$/.test(this.number); },
    url: function (message) {
      if (!this.isConfigured()) return null;
      return "https://wa.me/" + this.number + "?text=" + encodeURIComponent(message);
    },
    defaultMessage: function () { return window.ShaLang.t("msg.default", "en"); },
    productMessage: function (name) { return window.ShaLang.t("msg.product", "en") + name; }
  };
  window.ShaWA = WA;

  /* ---------- header / footer ---------- */
  var NAV = [
    ["index.html", "nav.home"], ["products.html", "nav.products"],
    ["about.html", "nav.about"], ["contact.html", "nav.contact"]
  ];

  function buildHeader() {
    var host = document.getElementById("site-header");
    if (!host) return;
    var page = currentPage();
    var links = NAV.map(function (n) {
      return '<a class="nav__link" href="' + n[0] + '"' + (page === n[0] ? ' aria-current="page"' : "") + ' data-i18n="' + n[1] + '"></a>';
    }).join("");
    host.className = "site-header";
    host.innerHTML =
      '<div class="container nav">' +
      '<a class="logo" href="index.html" data-i18n-attr="aria-label:logo.label">' + LOGO_SVG + '<span>SHA <em>STEELS</em></span></a>' +
      '<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu" data-i18n-attr="aria-label:nav.menu">' + icon("menu") + "</button>" +
      '<nav class="nav__menu" id="nav-menu" data-i18n-attr="aria-label:nav.main">' + links +
      '<div class="nav__actions">' +
      '<div class="lang" role="group" data-i18n-attr="aria-label:lang.label">' +
      '<button type="button" data-lang="en" aria-pressed="true" lang="en">EN</button>' +
      '<button type="button" data-lang="ml" aria-pressed="false" lang="ml">മലയാളം</button></div>' +
      '<a class="btn btn--primary" href="contact.html#quote" data-i18n="nav.quote"></a></div></nav></div>';

    var toggle = host.querySelector(".nav__toggle");
    var menu = host.querySelector(".nav__menu");
    function close() { menu.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { close(); toggle.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 900) close(); });
  }

  function buildFooter() {
    var host = document.getElementById("site-footer");
    if (!host) return;
    host.className = "site-footer";
    host.innerHTML =
      '<div class="container"><div class="footer-grid">' +
      '<div><a class="logo" href="index.html" data-i18n-attr="aria-label:logo.label">' + LOGO_SVG + '<span>SHA <em>STEELS</em></span></a>' +
      '<p data-i18n="footer.desc"></p></div>' +
      '<div><h3 data-i18n="footer.explore"></h3><ul>' +
      NAV.map(function (n) { return '<li><a href="' + n[0] + '" data-i18n="' + n[1] + '"></a></li>'; }).join("") + "</ul></div>" +
      '<div><h3 data-i18n="footer.products"></h3><ul>' +
      DATA.categories.map(function (c) { return '<li><a href="products.html#' + c.id + '" data-i18n="' + c.nameKey + '"></a></li>'; }).join("") + "</ul></div>" +
      '<div><h3 data-i18n="footer.contact"></h3><ul>' +
      '<li><a data-map="directions" data-i18n="btn.directions"></a></li>' +
      '<li><a data-map="place" data-i18n="btn.viewmaps"></a></li>' +
      '<li data-footer-phone><span data-i18n="footer.phone.pending"></span></li></ul></div>' +
      '</div><div class="footer-bottom">&copy; <span id="year"></span> SHA STEELS. <span data-i18n="footer.rights"></span></div></div>';
    var y = host.querySelector("#year"); if (y) y.textContent = new Date().getFullYear();
    var phones = CFG.PHONES || [];
    if (phones.length) {
      var li = host.querySelector("[data-footer-phone]");
      li.textContent = "";
      phones.forEach(function (p, i) {
        if (i) li.appendChild(document.createElement("br"));
        li.appendChild(el("a", { href: "tel:" + String(p.tel).replace(/[^0-9+]/g, ""), text: p.display }));
      });
    }
  }

  function buildFloatingWA() {
    var a = el("a", { class: "wa-float", "data-wa": "", "data-i18n-attr": "aria-label:wa.float" });
    a.innerHTML = WA_ICON;
    document.body.appendChild(a);
  }

  /* ---------- maps + whatsapp hydration ---------- */
  function hydrateMaps() {
    document.querySelectorAll("[data-map]").forEach(function (a) {
      var kind = a.getAttribute("data-map");
      a.setAttribute("href", kind === "directions" ? MAP.directionsUrl : MAP.placeUrl);
      setExternal(a);
    });
    document.querySelectorAll("iframe[data-map-embed]").forEach(function (f) {
      f.setAttribute("src", MAP.embedUrl);
    });
  }

  function hydrateWhatsApp() {
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      var url = WA.url(WA.defaultMessage());
      if (url) { a.setAttribute("href", url); setExternal(a); a.hidden = false; }
      else { a.removeAttribute("href"); a.hidden = true; }
    });
  }

  /* ---------- product rendering ---------- */
  function requestHref(name) { return "contact.html?product=" + encodeURIComponent(name) + "#quote"; }

  function makeImg(src, altKey, lazy) {
    var img = el("img", { class: "card__img", src: src, width: "800", height: "500", "data-i18n-attr": "alt:" + altKey });
    if (lazy) img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
    img.addEventListener("error", function () { img.removeAttribute("src"); img.style.visibility = "hidden"; });
    return img;
  }

  function renderCategories(host) {
    DATA.categories.forEach(function (c) {
      var card = el("article", { class: "card reveal" }, [
        makeImg(c.image, c.alt, true),
        el("div", { class: "card__body" }, [
          el("h3", { "data-i18n": c.nameKey }),
          el("p", { "data-i18n": c.descKey }),
          el("a", { class: "btn btn--dark", href: "products.html#" + c.id, "data-i18n": "btn.view" })
        ])
      ]);
      host.appendChild(card);
    });
  }

  function renderBrandGroups(host) {
    DATA.categories.forEach(function (c) {
      var ul = el("ul", { class: "brand-list" });
      DATA.brands.filter(function (b) { return b.category === c.key; }).forEach(function (b) {
        ul.appendChild(el("li", { text: b.name }));
      });
      host.appendChild(el("div", { class: "brand-group" }, [el("h3", { "data-i18n": c.nameKey }), ul]));
    });
  }

  function renderCatalogue(host) {
    DATA.categories.forEach(function (c) {
      var grid = el("div", { class: "grid grid--products" });
      DATA.brands.filter(function (b) { return b.category === c.key; }).forEach(function (b) {
        grid.appendChild(el("article", { class: "card reveal" }, [
          makeImg(c.image, c.alt, true),
          el("div", { class: "card__body" }, [
            el("h3", { text: b.name }),
            el("p", { "data-i18n": b.descKey }),
            el("a", { class: "btn btn--primary", href: requestHref(b.name), "data-i18n": "btn.requestprice" })
          ])
        ]));
      });
      host.appendChild(el("section", { class: "cat-section", id: c.id, "aria-labelledby": c.id + "-h" }, [
        el("div", { class: "container" }, [
          el("h2", { id: c.id + "-h", "data-i18n": c.nameKey }),
          el("p", { class: "muted", "data-i18n": c.descKey }),
          grid
        ])
      ]));
    });
  }

  function renderAll() {
    document.querySelectorAll("[data-render]").forEach(function (h) {
      var k = h.getAttribute("data-render");
      if (k === "categories") renderCategories(h);
      else if (k === "brands") renderBrandGroups(h);
      else if (k === "catalogue") renderCatalogue(h);
    });
  }

  /* ---------- category nav active state & reveal ---------- */
  function setupCatNav() {
    var links = document.querySelectorAll(".cat-nav a");
    if (!links.length || typeof window.IntersectionObserver !== "function") return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".cat-section").forEach(function (s) { io.observe(s); });
  }

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    var reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof window.IntersectionObserver !== "function" || reduce) {
      items.forEach(function (i) { i.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    items.forEach(function (i) { io.observe(i); });
  }

  /* ---------- contact info cards (contact page) ---------- */
  function hydrateContactCards() {
    var phoneVal = document.getElementById("contact-phone");
    var phones = CFG.PHONES || [];
    if (phoneVal && phones.length) {
      phoneVal.removeAttribute("data-i18n");
      phoneVal.textContent = "";
      phones.forEach(function (p, i) {
        if (i) phoneVal.appendChild(document.createElement("br"));
        phoneVal.appendChild(el("a", { href: "tel:" + String(p.tel).replace(/[^0-9+]/g, ""), text: p.display }));
      });
    }
    var waVal = document.getElementById("contact-wa");
    if (waVal && WA.isConfigured()) {
      waVal.textContent = "";
      var a = el("a", { href: WA.url(WA.defaultMessage()), "data-i18n": "contact.wa.chat" });
      setExternal(a); waVal.appendChild(a);
    }
    var hrs = document.getElementById("contact-hours");
    if (hrs && CFG.OPENING_HOURS) { hrs.removeAttribute("data-i18n"); hrs.textContent = CFG.OPENING_HOURS; }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.classList.remove("no-js");
    buildHeader();
    buildFooter();
    buildFloatingWA();
    renderAll();
    hydrateMaps();
    hydrateWhatsApp();
    hydrateContactCards();
    window.ShaLang.init();
    setupCatNav();
    setupReveal();
    // Honour a hash after dynamic rendering (e.g. products.html#cement)
    if (location.hash) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) setTimeout(function () { target.scrollIntoView(); }, 50);
    }
  });

  window.ShaSite = { safeBrand: safeBrand, icon: icon };
})();
