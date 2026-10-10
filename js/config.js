/*
 * SHA STEELS - business configuration
 * ------------------------------------
 * This is the ONE file the owner edits to update business details.
 *
 * WHATSAPP_NUMBER: international format, digits only, no "+" or spaces.
 *   Example for an Indian number: "919XXXXXXXXX"  (91 = country code)
 *   Leave as "" until the owner confirms the number. While empty, WhatsApp
 *   buttons are hidden/disabled and the quotation form explains that
 *   enquiries cannot be sent yet. No number is ever invented.
 *
 * PHONE_DISPLAY / PHONE_TEL: shown on the contact page. Leave "" until verified.
 * OPENING_HOURS: leave "" until verified (shown as "awaiting confirmation").
 * SITE_URL: final deployed URL, used only for documentation/SEO (see README).
 */
window.SHA_CONFIG = {
  BUSINESS_NAME: "SHA STEELS",
  // WhatsApp enquiries go to this number (international format, digits only).
  // NOTE: set to the first number provided; change if a different number is the WhatsApp one.
  WHATSAPP_NUMBER: "919497415551",
  // Phone numbers shown on the Contact page and footer (first one is used in the footer).
  PHONES: [
    { display: "+91 94974 15551", tel: "+919497415551" },
    { display: "+91 96566 65093", tel: "+919656665093" }
  ],
  OPENING_HOURS: "",
  SITE_URL: "",

  MAP: {
    lat: 8.9297427,
    lng: 76.6774953,
    placeUrl:
      "https://www.google.com/maps/place/SHA+STEELS/@8.929748,76.6749204,17z/data=!3m1!4b1!4m6!3m5!1s0x3b05e3005c89c90f:0x44f9cdd9c0311dc!8m2!3d8.9297427!4d76.6774953!16s%2Fg%2F11p1b5pvqp",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=8.9297427,76.6774953",
    embedUrl:
      "https://maps.google.com/maps?q=8.9297427,76.6774953&z=17&output=embed"
  }
};
