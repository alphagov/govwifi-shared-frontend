const { setCookie, getCookie, removeCookie } = require("./crud");

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

function cookiePreferencesDefined() {
  const seen = Cookies.get("cookie_preferences_set");

  return !!seen;
}

module.exports = {
  allowCategory,
  checkCookiePolicy,
  cookiePreferencesDefined,
  getCookiePreferences,
  isCategoryAllowed
};
