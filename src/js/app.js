// COOKIES
var cookieName = "acceptscookies",
  accepts = undefined,
  analytics = function() {
    (function(i, s, o, g, r, a, m) {
      i["GoogleAnalyticsObject"] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      "script",
      "//www.google-analytics.com/analytics.js",
      "ga"
    );

    ga("create", "UA-2309405-1", "auto");
    ga("send", "pageview");
  };

document.cookie.split(";").forEach((item, index) => {
  const parts = item.trim().split("=");
  if (cookieName == parts[0]) {
    accepts = parts[1];
  }
});

if (!accepts) {
  const cookieContainer = document.querySelector(".cookie-container");
  cookieContainer.classList.remove("hide");
  const acceptCookies = function() {
    document.cookie = cookieName + "=accepted;max-age=3153600000";
    cookieContainer.classList.add("hide");
    accepts = true;
    analytics();
  };
  document
    .querySelector(".accept-cookies")
    .addEventListener("click", acceptCookies);
} else {
  analytics();
}
