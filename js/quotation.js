/*
 * SHA STEELS - quotation form (contact.html)
 * Builds a WhatsApp message from the form. Nothing is stored, logged or sent
 * to any server; the customer must press Send in WhatsApp themselves.
 */
(function () {
  "use strict";
  var form = document.getElementById("quote-form");
  if (!form) return;

  var DATA = window.SHA_PRODUCTS;
  var L = window.ShaLang;
  var f = {
    name: form.elements["name"], phone: form.elements["phone"], category: form.elements["category"],
    brand: form.elements["brand"], quantity: form.elements["quantity"], notes: form.elements["notes"]
  };
  var status = document.getElementById("form-status");
  var selNote = document.getElementById("selected-note");
  var selName = document.getElementById("selected-name");
  var selected = null; // validated catalogue brand object or null

  function catKeyOf(brand) { return brand.category; }

  function fillCategories() {
    var keep = f.category.value;
    f.category.textContent = "";
    var o = document.createElement("option"); o.value = ""; o.textContent = L.t("form.choose"); f.category.appendChild(o);
    DATA.categories.forEach(function (c) {
      var op = document.createElement("option"); op.value = c.key; op.textContent = L.t(c.nameKey); f.category.appendChild(op);
    });
    f.category.value = keep;
  }

  function fillBrands() {
    var keep = f.brand.value;
    f.brand.textContent = "";
    var cat = f.category.value;
    var o = document.createElement("option"); o.value = "";
    o.textContent = cat ? L.t("form.choose") : L.t("form.choosecat");
    f.brand.appendChild(o);
    DATA.brands.filter(function (b) { return b.category === cat; }).forEach(function (b) {
      var op = document.createElement("option"); op.value = b.name; op.textContent = b.name; f.brand.appendChild(op);
    });
    f.brand.disabled = !cat;
    if (keep) f.brand.value = keep;
    if (f.brand.value !== keep) f.brand.value = "";
  }

  function showSelected() {
    if (selected) {
      selName.textContent = selected.name;
      selNote.hidden = false;
    } else {
      selNote.hidden = true;
    }
  }

  function readQuery() {
    var raw;
    try { raw = new URLSearchParams(location.search).get("product"); } catch (e) { raw = null; }
    if (!raw) return;
    var b = window.ShaSite.safeBrand(raw); // whitelist: unknown values are ignored
    if (!b) return;
    selected = b;
    f.category.value = b.category;
    fillBrands();
    f.brand.value = b.name;
  }

  function clearErr(key) {
    var box = document.getElementById("err-" + key);
    if (box) { box.textContent = ""; box.removeAttribute("data-key"); }
    f[key].closest(".field").classList.remove("has-error");
    f[key].removeAttribute("aria-invalid");
  }
  function setErr(key, msgKey) {
    var box = document.getElementById("err-" + key);
    box.textContent = L.t(msgKey); box.setAttribute("data-key", msgKey);
    f[key].closest(".field").classList.add("has-error");
    f[key].setAttribute("aria-invalid", "true");
  }

  function validate() {
    var bad = [];
    ["name", "phone", "category", "brand", "quantity"].forEach(clearErr);
    var name = f.name.value.trim();
    var digits = f.phone.value.replace(/[^0-9]/g, "");
    if (name.length < 2) { setErr("name", "form.err.name"); bad.push("name"); }
    if (!/^[0-9+\-\s()]{7,20}$/.test(f.phone.value.trim()) || digits.length < 7 || digits.length > 15) { setErr("phone", "form.err.phone"); bad.push("phone"); }
    if (!f.category.value) { setErr("category", "form.err.category"); bad.push("category"); }
    if (!f.brand.value || !window.ShaSite.safeBrand(f.brand.value)) { setErr("brand", "form.err.brand"); bad.push("brand"); }
    if (f.quantity.value.trim().length < 1) { setErr("quantity", "form.err.quantity"); bad.push("quantity"); }
    return bad;
  }

  function buildMessage() {
    var cat = DATA.categories.filter(function (c) { return c.key === f.category.value; })[0];
    var lines = [
      "Hello Sha Steels, I would like a price quotation.",
      "",
      "Name: " + f.name.value.trim(),
      "Phone: " + f.phone.value.trim(),
      "Category: " + L.t(cat.nameKey, "en"),
      "Brand: " + f.brand.value,
      "Quantity: " + f.quantity.value.trim()
    ];
    var notes = f.notes.value.trim();
    if (notes) lines.push("Requirements: " + notes);
    return lines.join("\n");
  }

  function showStatus(text, linkUrl, linkText) {
    status.textContent = "";
    status.appendChild(document.createTextNode(text));
    if (linkUrl) {
      status.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.href = linkUrl; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = linkText;
      status.appendChild(a);
    }
    status.hidden = false;
  }

  f.category.addEventListener("change", function () { selected = null; showSelected(); fillBrands(); clearErr("category"); });
  f.brand.addEventListener("change", function () {
    selected = window.ShaSite.safeBrand(f.brand.value); showSelected(); clearErr("brand");
  });
  ["name", "phone", "quantity"].forEach(function (k) { f[k].addEventListener("input", function () { clearErr(k); }); });

  document.getElementById("change-selection").addEventListener("click", function () {
    selected = null; f.category.value = ""; fillBrands(); showSelected();
    // drop ?product= from the address bar without reloading
    try { history.replaceState(null, "", location.pathname + location.hash); } catch (e) {}
    f.category.focus();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.hidden = true;
    var bad = validate();
    if (bad.length) { f[bad[0]].focus(); return; }
    if (!window.ShaWA.isConfigured()) { showStatus(L.t("form.nonumber")); return; }
    var url = window.ShaWA.url(buildMessage());
    var win = window.open(url, "_blank", "noopener,noreferrer");
    if (win) showStatus(L.t("form.opened"));
    else showStatus(L.t("form.blocked"), url, L.t("form.link"));
  });

  // Re-render translated dynamic bits when the language changes
  document.addEventListener("shalang", function () {
    fillCategories(); fillBrands();
    ["name", "phone", "category", "brand", "quantity"].forEach(function (k) {
      var box = document.getElementById("err-" + k);
      var key = box && box.getAttribute("data-key");
      if (key) box.textContent = L.t(key);
    });
    if (status && !status.hidden && !window.ShaWA.isConfigured()) status.textContent = L.t("form.nonumber");
  });

  document.addEventListener("DOMContentLoaded", function () {
    fillCategories();
    fillBrands();
    readQuery();
    showSelected();
  });
})();
