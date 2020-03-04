const template = require("./banner.html");

const { allowCategory, cookiePreferencesDefined } = require("./index");

function hideBanner() {
  document.getElementById("cookie-banner").style.display = "none";
}

function check() {
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

module.exports = { check };
