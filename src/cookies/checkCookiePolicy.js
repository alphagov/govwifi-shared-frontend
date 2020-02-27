const template = require("./cookie-banner.html");

const DEFAULT = {
  tracking: false
};

const COOKIES = {
  tracking: ["_ga", "_gid"],
  essential: [
    "seen_cookie_message",
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

  if (isCategoryAllowed(category)) {
    document.cookie = cookieName + "=" + cookieValue;
  } else {
    // we don't want to write random expiring cookies
    isRecognisedCookie(cookieName) && disableCookie(cookieName);
  }
}

function disableCookie(cookieName) {
  document.cookie = cookieName + "=;expires=" + new Date(0).toUTCString();
}

function setAllCookiesTo(bool) {
  return Object.keys(DEFAULT).reduce((policy, category) => {
    return Object.assign(policy, { [category]: bool });
  }, {});
}

function disableCookieCategory(category) {
  if (category === "essential") return;

  COOKIES[category].forEach(disableCookie);
}

const refuseAllCookies = () => {
  setCookiePreferences(setAllCookiesTo(false));

  Object.keys(COOKIES).forEach(disableCookieCategory);
};

const acceptAllCookies = () => setCookiePreferences(setAllCookiesTo(true));

function setCookiePreferences(policy) {
  setCookie("cookie_preferences", JSON.stringify(policy));
  setCookie("cookie_preferences_set", true);

  document.getElementById("cookie-banner").style.display = "none";
}

function getCookiePreferences() {
  if (!getCookie("cookie_preferences_set")) return DEFAULT;

  return JSON.parse(getCookie("cookie_preferences"));
}

function getCookie(cookieName) {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookiesArray = decodedCookie.split(";");
  for (var i = 0; i < cookiesArray.length; i++) {
    var cookie = cookiesArray[i];
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

function checkCookiePolicy(elementId) {
  const seen = getCookie("cookie_preferences_set");

  if (!seen || seen === "") {
    document.getElementById(elementId).innerHTML = template;

    document
      .getElementById("accept-cookies")
      .addEventListener("click", acceptAllCookies);

    document
      .getElementById("refuse-cookies")
      .addEventListener("click", refuseAllCookies);
  }
}

module.exports = {
  checkCookiePolicy,
  isCategoryAllowed
};
