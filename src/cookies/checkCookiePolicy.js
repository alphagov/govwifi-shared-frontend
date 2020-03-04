const template = require("./cookie-banner.html");
const Cookies = require("js-cookie");

const BASE_DOMAIN = "wifi.service.gov.uk";

const DEFAULT = {
  tracking: false
};

const COOKIES = {
  tracking: ["_ga", "_gid"],
  essential: [
    "cookie_preferences_set",
    "cookie_preferences",
    "_govwifi_admin_session"
  ]
};

function getCookieCategory(cookieName) {
  return Object.keys(COOKIES).find(category =>
    COOKIES[category].includes(cookieName)
  );
}

function isRecognised(cookieName) {
  return !!getCookieCategory(cookieName);
}

function isCategoryAllowed(category) {
  if (category === "essential") return true;

  const policy = getCookiePreferences();

  return policy[category];
}

function setCookie(cookieName, cookieValue) {
  const category = getCookieCategory(cookieName);
  const isDev = window.location.hostname === "localhost";

  if (isCategoryAllowed(category)) {
    Cookies.set(cookieName, cookieValue, {
      expires: 365,
      path: "",
      domain: isDev ? undefined : BASE_DOMAIN
    });
  } else {
    // we don't want to write random expiring cookies
    isRecognisedCookie(cookieName) && removeCookie(cookieName);
  }
}

function removeCookie(cookieName) {
  Cookies.remove(cookieName);
}

function allowCategory(category, isAllowed) {
  if (!COOKIES[category]) return;

  const preferences = getCookiePreferences();

  if (!isAllowed) Object.keys(COOKIES[category]).forEach(removeCookie);

  setCookiePreferences(
    Object.assign({}, preferences, { [category]: isAllowed })
  );
}

function setCookiePreferences(policy) {
  setCookie("cookie_preferences", JSON.stringify(policy));
  setCookie("cookie_preferences_set", true);
}

function getCookiePreferences() {
  if (!Cookies.get("cookie_preferences_set")) return DEFAULT;

  return JSON.parse(Cookies.get("cookie_preferences"));
}

function hideBanner() {
  document.getElementById("cookie-banner").style.display = "none";
}

function cookiePreferencesDefined() {
  const seen = Cookies.get("cookie_preferences_set");

  return !!seen;
}

function checkCookiePolicy() {
  const acceptAllCookies = () => allowCategory("analytics", true);
  const refuseAllCookies = () => allowCategory("analytics", false);

  if (!cookiePreferencesDefined()) {
    const banner = document.createElement("div");
    banner.id = "cookie-banner";

    document.body.prepend(banner);

    banner.innerHTML = template;

    document.getElementById("accept-cookies").addEventListener("click", () => {
      acceptAllCookies();
      hideBanner();
    });

    document.getElementById("refuse-cookies").addEventListener("click", () => {
      refuseAllCookies();
      hideBanner();
    });
  }
}

module.exports = {
  allowCategory,
  checkCookiePolicy,
  cookiePreferencesDefined,
  getCookiePreferences,
  isCategoryAllowed,
};
