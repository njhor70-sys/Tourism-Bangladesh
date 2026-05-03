// ── auth-guard.js — সব protected page-এ include করো ──
// (Home.html, Tourism.html, MyBookings.html, Profile.html, Admin.html)

(function () {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "null");

  // Token নেই → Login page-এ পাঠাও
  if (!token || !user) {
    window.location.replace("index.html");
    return;
  }

  // ── Back Button Fix ──
  // Logout করার পর back button press করলে protected page দেখাবে না
  history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", function () {
    if (!localStorage.getItem("token")) {
      window.location.replace("index.html");
    } else {
      history.pushState(null, "", window.location.href);
    }
  });

  // ── User name দেখানো ──
  window.addEventListener("DOMContentLoaded", function () {
    const el = document.getElementById("user-greeting");
    if (el) el.textContent = "Hi, " + user.name + "!";
  });

  // ── Logout ──
  window.logout = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("index.html");
  };
})();
