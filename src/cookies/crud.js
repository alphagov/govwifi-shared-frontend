const {
  getCookieCategory,
  isCategoryAllowed,
  isRecognisedCookie
} = require("./preferences");

const Cookies = require("js-cookie");

const BASE_DOMAIN = "wifi.service.gov.uk";

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

function getCookie(cookieName) {
  return Cookies.get(cookieName);
}

function removeCookie(cookieName) {
  Cookies.remove(cookieName);
}

module.exports = {
  getCookie,
  setCookie,
  removeCookie
};
