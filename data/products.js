/*
 * SHA STEELS - product catalogue data
 * Add or remove brands here; pages render automatically.
 * Brand names are text only (no third-party logos). No specs, grades,
 * prices or stock claims are stored - these must be confirmed by the owner.
 * `descKey` points to an entry in the translation dictionary (js/language.js).
 */
window.SHA_PRODUCTS = {
  categories: [
    { id: "tmt-bars", key: "tmt", nameKey: "cat.tmt", descKey: "cat.tmt.desc", image: "assets/images/tmt-bars.svg", alt: "alt.tmt" },
    { id: "cement", key: "cement", nameKey: "cat.cement", descKey: "cat.cement.desc", image: "assets/images/cement-bags.svg", alt: "alt.cement" },
    { id: "tubes", key: "tubes", nameKey: "cat.tubes", descKey: "cat.tubes.desc", image: "assets/images/steel-tubes.svg", alt: "alt.tubes" }
  ],
  brands: [
    { name: "Kenza TMT Bars", category: "tmt", descKey: "prod.tmt.desc" },
    { name: "Kalliyath TMT Bars", category: "tmt", descKey: "prod.tmt.desc" },
    { name: "Tata TMT Bars", category: "tmt", descKey: "prod.tmt.desc" },
    { name: "ACC Cement", category: "cement", descKey: "prod.cement.desc" },
    { name: "Ramco Cement", category: "cement", descKey: "prod.cement.desc" },
    { name: "UltraTech Cement", category: "cement", descKey: "prod.cement.desc" },
    { name: "Chettinad Cement", category: "cement", descKey: "prod.cement.desc" },
    { name: "Dalmia Cement", category: "cement", descKey: "prod.cement.desc" },
    { name: "Jain Tubes", category: "tubes", descKey: "prod.tubes.desc" },
    { name: "Apollo Tubes", category: "tubes", descKey: "prod.tubes.desc" }
  ]
};
